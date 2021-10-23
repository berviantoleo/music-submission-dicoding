import 'dotenv/config';
import amqp from 'amqplib';
import PlaylistService from './PlaylistService';
import MailSender from './MailSender';
import Listener from './Listener';

const init = async () => {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER || '');
  const channel = await connection.createChannel();
  await channel.assertQueue('export:playlist', {
    durable: true,
  });
  channel.consume('export:playlist', listener.listen, { noAck: true });
};

init();
