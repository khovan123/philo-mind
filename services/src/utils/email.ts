// @ts-expect-error — nodemailer has no bundled types
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const isConfigured = Boolean(
  env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM,
);

let transporter: any = null;
if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST!,
    port: env.SMTP_PORT!,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export async function sendResetEmail(to: string, code: string) {
  const subject = "PhiloMind — Mã xác thực đặt lại mật khẩu";
  const text = `Mã xác thực: ${code}\nSử dụng mã này để đặt lại mật khẩu. Mã sẽ hết hạn trong 15 phút.\nNếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.`;

  if (!transporter) {
    console.info("[Email] SMTP not configured — falling back to console.log");
    console.info("To:", to);
    console.info(text);
    return;
  }

  await transporter.sendMail({
    from: env.SMTP_FROM!,
    to,
    subject,
    text,
  });
}
