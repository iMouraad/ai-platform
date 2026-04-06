import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendActivationEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const activationUrl = `${process.env.APP_BASE_URL}/activate-account?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Activa tu cuenta en AI Platform",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 32px">
        <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 16px">¡Hola ${name}!</h1>
        <p style="color: #475569; font-size: 16px; line-height: 24px">
          Gracias por registrarte en <strong>AI Platform</strong>, la plataforma de aprendizaje de IA más moderna.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 32px">
          Para activar tu cuenta y configurar tu contraseña, por favor haz clic en el siguiente botón:
        </p>
        <a href="${activationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block">
          Activar mi cuenta
        </a>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 32px">
          Si no has solicitado este registro, puedes ignorar este correo.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0">
        <p style="color: #94a3b8; font-size: 12px; text-align: center">
          © 2026 AI Platform. Todos los derechos reservados.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
