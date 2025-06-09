package rabbitmq

import (
	"encoding/json"
	"fmt"
	"log/slog"

	"github.com/streadway/amqp"
)

func (rabbitmq *RabbitMQ) failOnError(err error, msg string) {
	if err != nil {
		slog.Error(msg, "err", err.Error())
	}
}

// CreateCon create connection
func (rabbitmq *RabbitMQ) CreateCon(connectionString string) *amqp.Connection {
	conn, err := amqp.Dial(connectionString)
	if err != nil {
		slog.Error("Failed to connect to RabbitMQ", "err", err)
	}

	rabbitmq.failOnError(err, "Failed to connect to RabbitMQ")
	return conn
}

// CreateChannel create channel
func (rabbitmq *RabbitMQ) CreateChannel(conn *amqp.Connection) *amqp.Channel {
	ch, err := conn.Channel()
	if err != nil {
		rabbitmq.failOnError(err, "Failed to open a channel")
		return nil
	}
	err = ch.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		rabbitmq.failOnError(err, "Failed to set QoS")
		return nil
	}
	return ch
}

// CreateQueue create queue
func (rabbitmq *RabbitMQ) CreateQueue(rbmq *amqp.Channel, queuename string, arg amqp.Table) amqp.Queue {
	q, err := rbmq.QueueDeclare(
		queuename, // name
		true,      // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		arg,       // arguments
	)
	if err != nil {
		rabbitmq.failOnError(err, "Failed to declare a queue")
	}
	return q
}

func (rabbitmq *RabbitMQ) CreateExchange(ch *amqp.Channel, name string) {
	err := ch.ExchangeDeclare(
		name,                // name
		amqp.ExchangeFanout, // type
		true,                // durable
		false,               // auto-deleted
		false,               // internal
		false,               // no-wait
		nil,                 // arguments
	)
	if err != nil {
		rabbitmq.failOnError(err, "Failed to declare a queue")
	}
}

type RabbitMQ struct {
	//queue        amqp.Queue
	rbCon        *amqp.Connection
	ch           *amqp.Channel
	exchangeName string
	connString   string
}

func (rabbitmq *RabbitMQ) reconnect() error {
	if rabbitmq.rbCon != nil {
		_ = rabbitmq.rbCon.Close()
		rabbitmq.rbCon = nil
	}
	if rabbitmq.ch != nil {
		_ = rabbitmq.ch.Close()
		rabbitmq.ch = nil
	}

	conn := rabbitmq.CreateCon(rabbitmq.connString)
	if conn == nil {
		return fmt.Errorf("failed to reconnect to RabbitMQ")
	}
	rabbitmq.rbCon = conn

	ch := rabbitmq.CreateChannel(conn)
	if ch == nil {
		return fmt.Errorf("failed to create new channel")
	}
	rabbitmq.ch = ch

	rabbitmq.CreateExchange(ch, rabbitmq.exchangeName)
	return nil
}

func (rabbitmq *RabbitMQ) Publish(msg interface{}) error {
	if rabbitmq.ch == nil || rabbitmq.rbCon == nil {
		rabbitmq.reconnect()
	}

	bytes, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	err = rabbitmq.ch.Publish(
		rabbitmq.exchangeName, // exchange
		"",                    // routing key
		false,                 // mandatory
		false,
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "text/plain",
			Body:         bytes,
		})
	if err != nil {
		slog.Warn("Publish failed", "err", err)
		if err == amqp.ErrClosed || err.Error() == "channel/connection is not open" {
			slog.Warn("Attempting to reconnect...")
			if recErr := rabbitmq.reconnect(); recErr != nil {
				return recErr
			}
			return rabbitmq.Publish(msg)
		}
		return err
	}
	return err
}

func New(conn, queueName, queueNameRetry string) *RabbitMQ {
	rabbitmq := &RabbitMQ{}
	rabbitCon := rabbitmq.CreateCon(conn)
	if rabbitCon == nil {
		slog.Error("Failed to establish connection to RabbitMQ")
	}
	rabbitmq.connString = conn
	rabbitmq.rbCon = rabbitCon
	rabbitmq.ch = rabbitmq.CreateChannel(rabbitCon)
	rabbitmq.exchangeName = queueName
	return rabbitmq
}
