import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import config from '../../utils/config';

type Response = {
  message: string;
};

sgMail.setApiKey(config.env.sendGridApiKey as string);

export const contactMessageEmail = (message: string, email: string) => ({
  to: 'dev.diego.romero@gmail.com',
  from: 'listu.hello@gmail.com',
  subject: `New message in DEEPFLOW from ${email}`,
  html: `
    <h3>Email from contact from</h3>
    <br>
    <p>
    ${message}
    </p>
  `,
});

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { message, email } = req.body;
  if (req.method === 'POST') {
    try {
      await sgMail.send(contactMessageEmail(message, email));
      return res.status(OK).json({ message: 'Email sent' });
    } catch (_err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'endpoint does not exist' });
    }
  }
  return res.status(NOT_FOUND).json({ message: 'endpoint does not exist' });
};

export default handler;
