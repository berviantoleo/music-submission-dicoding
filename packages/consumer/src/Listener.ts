import amqp from 'amqplib';
import MailSender from "./MailSender";
import PlaylistService from "./PlaylistService";

class Listener {

  private playlistService: PlaylistService;
  private mailSender: MailSender;

  constructor(playlistService: PlaylistService, mailSender: MailSender) {
    this.playlistService = playlistService;
    this.mailSender = mailSender;
    this.listen = this.listen.bind(this);
  }

  public async listen(message: amqp.ConsumeMessage | null): Promise<void> {
    try {
      if (!message)
      {
        console.log("Message Empty!");
        return;
      }
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      const songs = await this.playlistService.getSongsfromPlaylist(playlistId);
      const result = await this.mailSender.sendEmail(targetEmail, JSON.stringify(songs));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

export default Listener;
