const nodemailer = require("nodemailer");

function readBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    return Object.fromEntries(new URLSearchParams(body));
  }

  return body;
}

function hasHeaderInjection(value) {
  return /[\r\n]/.test(value);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const { name = "", email = "", subject = "", message = "" } = readBody(req.body);
  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedSubject = String(subject).trim();
  const trimmedMessage = String(message).trim();

  if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
    res.status(400).send("Please fill in all required fields.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    res.status(400).send("Please enter a valid email address.");
    return;
  }

  if ([trimmedName, trimmedEmail, trimmedSubject].some(hasHeaderInjection)) {
    res.status(400).send("Invalid form input.");
    return;
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    res.status(500).send("Email service is not configured.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Website" <${process.env.GMAIL_USER}>`,
      to: "harikrishnab101@gmail.com",
      replyTo: `"${trimmedName}" <${trimmedEmail}>`,
      subject: `Portfolio contact form: ${trimmedSubject}`,
      text: [
        "You received a new message from your portfolio contact form.",
        "",
        `Name: ${trimmedName}`,
        `Email: ${trimmedEmail}`,
        `Subject: ${trimmedSubject}`,
        "",
        "Message:",
        trimmedMessage
      ].join("\n")
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Message could not be sent. Please try again later.");
  }
};
