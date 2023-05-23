import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const emailRouter = express();

// Serve static files from the "public" directory
emailRouter.use(cors());
emailRouter.use(express.static('public'));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mi.tech0786@gmail.com',
    pass: 'MADMAXROAD#786',
  },
});

// Handle the form submission
emailRouter.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'ismaeelpakistanii@gmail.com',
    subject: 'New Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log("transporter inside")
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

export default emailRouter;