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
	try {
		await sgMail.send(msg);
	} catch (error) {
		console.error(error);
	}
}
