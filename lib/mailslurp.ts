import { MailSlurp } from "mailslurp-client";
import nodemailer from "nodemailer";

const apiKey = process.env.MAILSLURP_API_KEY;
const mailslurp = new MailSlurp({ apiKey });
async function configureEmailServer() {
  // get access details for smpt server
  const server = await mailslurp.getImapSmtpAccessDetails();

  // use details to configure SMTP client like NodeMailer
  const opts = {
    host: server.smtpServerHost,
    port: server.smtpServerPort,
    secure: false, // Disable tls recommended
    auth: {
      user: server.smtpUsername,
      pass: server.smtpPassword,
      type: "PLAIN", // Note the use of PLAIN AUTH
    },
  };
  const transport = nodemailer.createTransport(opts);
}

export async function sendEmail({
  emailTo,
  subject,
  body,
}: {
  emailTo: string;
  subject: string;
  body: string;
}) {
  const inbox = await mailslurp.createInbox();
  const options = {
    to: [emailTo],
    subject: subject,
    body: body,
  };
  const sent = await mailslurp.sendEmail(inbox.id, options);
  console.log("email enviado", sent);
  return sent;
}
