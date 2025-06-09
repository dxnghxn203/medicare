package queue

import (
	"consumer/pkg/rabbitmq"
	"consumer/statics"
	"context"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"sync"

	"github.com/streadway/amqp"
)

// Queue Queue
type Queue interface {
	process([]byte, *amqp.Channel, context.Context) (bool, error)
	queueName() string
	queueRetry() string
	numberOfWorker() int
}

// Manager Manager
type Manager struct {
	Quit chan bool
}

// Run Run queues
func (m *Manager) Run(ctx context.Context, cancelF context.CancelFunc, wg *sync.WaitGroup, queues ...Queue) {
	for _, q := range queues {
		wg.Add(q.numberOfWorker())
		slog.Info("start queue", q.queueName(), q.numberOfWorker())
		go func(q Queue, wg *sync.WaitGroup, cancelF context.CancelFunc) {
			var amqpURL string
			appEnv := os.Getenv("APP_ENV")
			if appEnv == "local" {
				amqpURL = fmt.Sprintf("amqp://%s:%s@%s:%s",
					os.Getenv("RABBITMQ_USER"),
					os.Getenv("RABBITMQ_PW"),
					os.Getenv("RABBITMQ_HOST"),
					os.Getenv("RABBITMQ_PORT"),
				)

			} else {
				amqpURL = fmt.Sprintf("amqps://%s:%s@%s/%s",
					os.Getenv("RABBITMQ_USER"),
					os.Getenv("RABBITMQ_PW"),
					os.Getenv("RABBITMQ_HOST"),
					os.Getenv("RABBITMQ_USER"),
				)
			}
			rabbitCon := rabbitmq.CreateCon(amqpURL)
			if rabbitCon != nil {
				runQueue(ctx, cancelF, wg, q, rabbitCon, m.Quit)
			}
		}(q, wg, cancelF)
	}
}

func runQueue(ctx context.Context, cancelF context.CancelFunc, wg *sync.WaitGroup, q Queue, con *amqp.Connection, quit chan<- bool) {
	queueName := q.queueName()
	queueNameRetry := q.queueRetry()
	for w := 0; w < q.numberOfWorker(); w++ {
		go func(w int) {
			chconsumer := rabbitmq.CreateChannel(con)
			chpub := rabbitmq.CreateChannel(con)
			conClose := make(chan *amqp.Error)
			consumerTag := queueName + "_" + strconv.Itoa(w)
			defer chconsumer.Close()
			defer chpub.Close()
			con.NotifyClose(conClose)
			rabbitmq.CreateExchange(chconsumer, queueName)
			rabbitmq.CreateQueue(chconsumer, queueName, nil)
			chconsumer.QueueBind(queueName, "", queueName, false, nil)
			msgs := rabbitmq.CreateConsumer(chconsumer, queueName, consumerTag)
			queueRetryArgs := amqp.Table{}
			rabbitmq.CreateExchange(chpub, queueNameRetry)
			queueRetryArgs["x-dead-letter-exchange"] = queueNameRetry
			rabbitmq.CreateQueue(chpub, queueNameRetry, queueRetryArgs)
			chpub.QueueBind(queueNameRetry, "", queueNameRetry, false, nil)
			for {
				select {
				case close := <-conClose:
					if close != nil {
						slog.Error("lost connection, restart app")
						cancelF()
					}
				case <-ctx.Done():
					slog.Info(fmt.Sprintf("%s shutdown", consumerTag))
					wg.Done()
					quit <- true
					return
				case d := <-msgs:
					slog.Info("Received message", "queue", consumerTag, "msg_body", string(d.Body))
					jsonBody := string(d.Body)
					isRetryMsg, IsMaxRetry, currentRetry := rabbitmq.IsMaxRetry(d, statics.MaxRetry)
					if isRetryMsg && IsMaxRetry {
						slog.Info(fmt.Sprintf("msg %s max retry %d", jsonBody, currentRetry))
						d.Ack(false)
						continue
					} else if isRetryMsg {
						slog.Info(fmt.Sprintf("retry msg %s, time: %d", jsonBody, currentRetry))
					} else {
						slog.Info("The message has received", "queue", consumerTag, "msg", jsonBody)
					}
					slog.Info("Calling process function", "msg_body", jsonBody)
					isRetry, err := q.process(d.Body, chpub, ctx)
					if err != nil {
						slog.Error("Error processing message", "msg_body", jsonBody, "error", err)
						if isRetry {
							slog.Info(fmt.Sprintf("retry the msg %s", jsonBody))
							err = chpub.Publish(
								queueNameRetry,
								"",
								false,
								false,
								amqp.Publishing{
									ContentType: "text/plain",
									Body:        d.Body,
									Headers:     d.Headers,
									Expiration:  statics.RetryInSeconds,
								})
							if err != nil {
								slog.Error("can not retry the msg", "body", jsonBody, "err", err)
							}
						}
					}
					d.Ack(false)
				}
			}
		}(w)
	}
}
