require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  try {
    const formData = req.body;
    const name = formData.name;
    const email = formData.email;
    const message = formData.message;

    if(!email || !name || !message) throw new Error({message: "data is empty"});
    
    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        secureConnection: false,
        requireTLS: true,
        tls: {
            ciphers: "SSLv3",
        },
        debug: true,
        connectionTimeout: 10000,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.RECEIVER,
      subject: `Teguh's Website Message`,
      html: `
        Name: ${name}
        <br/>
        Email: ${email}
        <br/>
        Message: ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);

    res.status(201).json({ message: 'The message has been sent' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred while sending the email." });
  }
});

const port = process.env.PORT || 8000; 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
