import nodemailer from "nodemailer";

export const sendEmail = async (emailTo, subject, textEmail, HTMLEmail) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
  });

  try {
    await transporter.sendMail({
      from: `"EcoPlastic" <${process.env.USER_EMAIL}>`,
      to: emailTo,
      subject: subject,
      text: textEmail,
      html: HTMLEmail,
    });

    return {
      error: "",
      data: { message: "El email fue enviado exitosamente.", access: true },
    };
  } catch (error) {
    return { error: error, data: "" };
  }
};
