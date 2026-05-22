const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Create email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API route
app.post("/send-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    // 1. Email to YOU
    await transporter.sendMail({
      from: "Gamely Spin Website",
      to: "gamelyspin@gmail.com",
      subject: "New Email Submission",
      text: `A user submitted their email: ${email}`
    });

    // 2. Email to USER
    await transporter.sendMail({
      from: "Gamely Spin",
      to: email,
      subject: "Submission Successful",
      text: "Your email has been successfully used to sign in as a guest on our page."
    });

    res.send("Emails sent successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error sending emails");
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
