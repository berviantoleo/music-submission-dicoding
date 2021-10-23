import MailSender from "../src/MailSender";

jest.mock('nodemailer');

describe("Mail Sender Test", () => {
  it("Mock Send Email Test", async () => {
    const to = "bervianto-test@gmail.com";
    const mailSender = new MailSender();
    const result = await mailSender.sendEmail(to, "Hello World!");
    expect(result.envelope.to).toContain(to);
  });
});
