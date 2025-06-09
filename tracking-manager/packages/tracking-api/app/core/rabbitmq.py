import time

import pika
import os

from dotenv import load_dotenv

from app.core import logger

load_dotenv()
queue_host = os.getenv("RABBITMQ_HOST")
queue_port = os.getenv("RABBITMQ_PORT")
queue_user = os.getenv("RABBITMQ_USER")
queue_pwd = os.getenv("RABBITMQ_PW")
queue_vhost = os.getenv("RABBITMQ_VHOST")

# Connect to RabbitMQ
def connect():
    credentials = pika.PlainCredentials(queue_user, queue_pwd)
    rabbitmq_parameters = pika.ConnectionParameters(queue_host, queue_port, queue_vhost, credentials)
    connection = pika.BlockingConnection(rabbitmq_parameters)
    return connection

def send_message(queue_name, message):
    try:
        connection = connect()
        channel = connection.channel()
        channel.basic_publish(exchange=queue_name, routing_key=queue_name, body=message)
        connection.close()
        logger.info("Pushed mess to queue", queue=queue_name, body=message)
    except pika.exceptions.AMQPConnectionError:
        print("Lost connection. Reconnecting...")
        time.sleep(5)  # Wait before reconnecting