"use server";

import nodemailer from "nodemailer";

interface EmailDetails {
  action: "Approved" | "Rejected" | "requested more information";
  userName: string;
  userEmail: string;
  fileName: string;
  dateSubmitted: string;
  lastActionDate: string;
  currentOffice: string;
  comment?: string;
}

const generateTextEmail = (details: EmailDetails): string => `
Subject: File ${details.action} - ${details.fileName}

Dear ${details.userName},

We are pleased to inform you that your file, “${details.fileName},” has been ${details.action}. Below are the details of your file for your reference:

- File Name: ${details.fileName}
- Date Submitted: ${details.dateSubmitted}
- Date ${details.action}: ${details.lastActionDate}
- Current Office Location: ${details.currentOffice}

Thank you for using the File Tracking System (FTS) at Begum Rokeya University Rangpur. If you have any further queries, feel free to reach out to us.

Best regards,
FTS Support Team
Begum Rokeya University Rangpur
`;

const generateHtmlEmail = (details: EmailDetails): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            font-size: 16px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        h2 {
            color: #0056b3;
        }
        p {
            margin: 10px 0;
        }
        
        .comment {
            background-color: yellow;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .details {
            background-color: #eef;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
    <title>Email</title>
</head>
<body>
    <div class="container">
        <h2>File ${details.action} - ${details.fileName}</h2>
        <p>Dear ${details.userName},</p>
        <p>We are pleased to inform you that your file, “${details.fileName},” has been ${details.action}. Below are the details of your file for your reference:</p>
        ${details.comment ? `<div><h2>The Following information are needed to continue: </h2><pre class="comment">${details.comment}</pre></div>` : ""}
        <div class="details">
            <p><strong>File Name:</strong> ${details.fileName}</p>
            <p><strong>Date Submitted:</strong> ${details.dateSubmitted}</p>
            <p><strong>Date ${details.action}:</strong> ${details.lastActionDate}</p>
            <p><strong>Current Office Location:</strong> ${details.currentOffice}</p>
        </div>
        <p>Thank you for using the File Tracking System (FTS) at Begum Rokeya University Rangpur. If you have any further queries, feel free to reach out to us.</p>
        <p>Best regards,<br>FTS Support Team<br>Begum Rokeya University Rangpur</p>
    </div>
</body>
</html>
`;

export const sendFTSEmail = async (details: EmailDetails) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.fts.brur.ac.bd',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: details.userEmail,
    subject: `File ${details.action} - ${details.fileName}`,
    text: generateTextEmail(details),
    html: generateHtmlEmail(details),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
