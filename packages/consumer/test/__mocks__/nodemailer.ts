import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class MockTransportClass {
  sendMail(options: Mail.Options): Promise<SMTPTransport.SentMessageInfo> {
    console.log("Message sent!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, _) => {
      resolve({
        pending: [],
        rejected: [],
        accepted: [],
        messageId: "mock",
        response: "OK",
        envelope: {
          from: typeof options.from == "string" ? options.from : "random",
          to: Array.isArray(options.to)
            ? (options.to as string[])
            : [options.to as string],
        },
      });
    });
  }
}

const createTransport = (): MockTransportClass => {
  return new MockTransportClass();
};

export default { createTransport };
