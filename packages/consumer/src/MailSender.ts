import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class MailSender {

  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail: string, content: string): Promise<SMTPTransport.SentMessageInfo> {
    const message : Mail.Options = {
      from: 'Music Apps',
      to: targetEmail,
      subject: 'Ekspor Playlist',
      text: 'Terlampir hasil dari ekspor playlist',
      attachments: [
        {
          filename: 'playlists.json',
          content,
        },
      ],
    };
    return this.transporter.sendMail(message);
  }
}

export default MailSender;
