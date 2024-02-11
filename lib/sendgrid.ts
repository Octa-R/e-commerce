import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface sendEmailFields {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(msg: sendEmailFields) {
  /*
	try {
		console.log({ msg });
		const response = await sgMail.send(msg);
		console.log("sendgrid", response);
	} catch (error) {
		console.error(error);
	}*/
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
