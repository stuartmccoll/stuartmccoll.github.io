+++
date = "2017-05-14 10:10:32 +0000"
description = "Quick and Dirty Kombu/RabbitMQ Application"
linktitle = ""
title = "Quick and Dirty Kombu/RabbitMQ Application"
slug = "Quick and Dirty Kombu/RabbitMQ Application"
type = "post"
+++

[Kombu](https://github.com/celery/kombu) is an open-source messaging library available for Python which aims to make messaging as simple as possible. Kombu provides a high-level interface for the [Advanced Message Queuing Protocol](http://amqp.org/) (AMQP), an open standard protocol for message orientation, queuing, routing, reliability, and security. The most popular implementation of AMQP is the [RabbitMQ](http://www.rabbitmq.com/) open-source messaging server.

In the example application we're going to create here, we're going to use Kombu and RabbitMQ in combination to do the following:

* Send a message from a Kombu application (in this case a simple Python script).
* Receive the message at an exchange (our RabbitMQ server), which will then place the message on a queue.
* Read from the queue within another Kombu application (in this case, another simple Python script).

The application we're going to create will only feature one queue, one script which will fire a message at the exchange (our producer), and another script that will read from the queue as soon as it finds something on it (our consumer). It's a basic example, but we could build upon and utilise this for any number of uses.

## Tutorial

Let's begin with our script that'll consume messages - `consumer.py`.

In order to send and receive messages, we'll need to fulfil a few prerequisites. Firstly, we need to create a connection to our RabbitMQ server.

```python
conn = Connection("amqp://localhost:5672/")
```

We'll use this connection in a moment when we instantiate the Consumer class. Next, we'll create our exchange.

```python
test_exchange = Exchange("test_exchange", type="direct")
```

The first parameter passed gives the name of our exchange and the second parameter dictates what type of exchange we're creating. Here, we can pass either direct (matches  if the routing_key attribute and the routing key property of the message are identical), fanout (always matches), and topic (matches the routing key property of the message by a pattern matching scheme). For this small example we're going to create a simple direct exchange.

With a connection and an exchange created, we're now going to create our queue. This is what we'll drop our messages onto before consuming them.

```python
queue = Queue(name="queue", exchange=test_exchange, routing_key="test")
```

To configure our queue, we're simply giving it a name, passing an exchange to it, and a routing key. The routing key will be utilised based on the type of the exchange, as we've set above.

Lastly, we need to set up our Consumer. A Consumer needs a connection (or channel) and a list of queues to consume from. We're also going to pass it a callback, which is a function which it'll call when it finds an event on our queue.

```python
with Consumer(conn, queues=queue, callbacks=[process_message], accept=["text/plain"]):
    conn.drain_events()
```

Our Consumer takes our connection variable, our queue, and a callback to a process_message function which we'll create in a moment. We're not passing any kind of timeout only because for this example we want it to consume messages indefinitely to give an idea of how Kombu and RabbitMQ work. I'll expand upon this further in future posts where I'll be looking at putting Kombu to a more functional use.

Here's our `consumer.py` file in full:

```python
from kombu import Connection, Exchange, Consumer, Queue
from process_message import process_message

# Create the connection
conn = Connection("amqp://localhost:5672/")

# Create the exchange
test_exchange = Exchange("test_exchange", type="direct")

# Create the queue
queue = Queue(name="queue", exchange=test_exchange, routing_key="test")

# Create the consumer
with Consumer(conn, queues=queue, callbacks=[process_message],
              accept=["text/plain"]):
```

Now, to create our `process_message` function. This is going to live in it's own `process_message.py` file.

```python
def process_message(body, message):
    print "The following message has been received: %s" % body

    # Acknowledge the message
    message.ack()
```

This function receives the body and message of our event, prints a statement to the console detailing what has been received, then acknowledges the message. By acknowledging the message we remove it from the queue.

At this stage, we have our queue ready to put messages on, we've got a consumer that's ready to grab messages off the queue, and we've also got a function that's going to process the message once we've taken it from the queue. The only thing left to do is to set up our producer, which is what will drop our messages onto the queue.

A lot of our `producer.py` file is going to look similar to our `consumer.py` file.

```python
conn = Connection("amqp://localhost:5672/")
```

We need to set up our connection as before.

```python
channel = conn.channel()
```

Then we create and return a new channel.

```python
test_exchange = Exchange("test_exchange", type="direct")
```

We create our exchange in the same way that we did within our `consumer.py` file.

```python
producer = Producer(exchange=test_exchange, channel=channel, routing_key="test")
```

Our instantiation of the Producer class looks similar to the way we instantiated our Consumer class. We pass in our exchange and our channel, and then we also pass in the same routing_key that we gave to our consumer. As we're using a direct exchange, we need to make sure that our messages are going to the same place, which is why we ensure that we pass in the same routing_key to both the producer and the consumer.

```python
producer.publish("Hello World!")
```

Lastly, we call the publish method and pass through a string as our message. Whenever we run the `producer.py` script this will send our message to the exchange.

Here's our `producer.py` in full:

```python
from kombu import Connection, Exchange, Producer

# Create the connection
conn = Connection("amqp://localhost:5672/")

# Create a new channel
channel = conn.channel()

# Create the exchange
test_exchange = Exchange("test_exchange", type="direct")

# Create the producer
producer = Producer(exchange=test_exchange, channel=channel,
                    routing_key="test")

# Publish a message
producer.publish("Hello World!")
```

If we run our `consumer.py` script now, it'll run indefinitely and wait until it finds something on the queue we've created. Now, if we run `producer.py` it'll fire a message at the exchange which will route it onto the queue. The already-running `consumer.py` will find it on the queue and process it, which removes it from the queue.

A simple example that doesn't do anything of use, but I hope it's given you an insight into the way Kombu and RabbitMQ work together.