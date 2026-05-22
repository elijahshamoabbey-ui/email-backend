const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check route (useful for testing Render)
app.get("/", (req, res) => {
  res.send("Email backend is running");
});

// Email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST endpoint for form submission
app.post("/send-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Email to YOU
    await transporter.sendMail({
      from: `Gamely Spin Website <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Email Submission",
      text: `A user submitted their email: ${email}`
    });

    // Email to USER
    await transporter.sendMail({
      from: `Gamely Spin <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Submission Successful",
      text: "Your email has been successfully used to sign in as a guest on our page."
    });

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send emails" });
  }
});

// Render port configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
