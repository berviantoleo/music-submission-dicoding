import amqp from 'amqplib';

export interface ProducerService {
  sendMessage(queue: string, message: string): Promise<void>
}

const producerService: ProducerService = {
  sendMessage: async (queue: string, message: string): Promise<void> => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER || '');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(queue, Buffer.from(message));
    await connection.close();
  },
};

export default producerService;
