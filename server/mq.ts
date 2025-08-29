import amqp from 'amqplib';

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost';
let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export async function connectToQueue() {
  if (channel) return channel;

  try {
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    throw error;
  }
}

export async function publishToQueue(queueName: string, message: string) {
  if (!channel) {
    await connectToQueue();
  }
  if (channel) {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
  }
}

export async function closeQueueConnection() {
  if (connection) {
    await connection.close();
    connection = null;
    channel = null;
    console.log('RabbitMQ connection closed');
  }
}
