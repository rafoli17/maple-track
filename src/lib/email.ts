// ════════════════════════════════════════════
// Email — Resend helpers
// ════════════════════════════════════════════

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "MapleTrack <onboarding@resend.dev>";

export async function sendHouseholdInvite(
  email: string,
  inviterName: string,
  householdName: string
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `${inviterName} convidou você para o MapleTrack`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>🍁 Você foi convidado!</h2>
        <p><strong>${inviterName}</strong> convidou você para a família <strong>${householdName}</strong> no MapleTrack.</p>
        <p>Juntos vocês vão acompanhar toda a jornada de imigração para o Canadá.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login?invite=true" style="display:inline-block;padding:12px 24px;background:#0D9488;color:#fff;text-decoration:none;border-radius:8px;margin-top:16px;">Aceitar convite</a>
      </div>
    `,
  });
}

export async function sendDocumentExpiryAlert(
  email: string,
  documentName: string,
  expiryDate: string
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `⚠️ Documento vencendo: ${documentName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>⚠️ Documento vencendo</h2>
        <p>Seu documento <strong>${documentName}</strong> vence em <strong>${expiryDate}</strong>.</p>
        <p>Acesse o MapleTrack para verificar e atualizar.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/documents" style="display:inline-block;padding:12px 24px;background:#0D9488;color:#fff;text-decoration:none;border-radius:8px;margin-top:16px;">Ver documentos</a>
      </div>
    `,
  });
}

export async function sendStepReminder(
  email: string,
  stepTitle: string,
  dueDate: string
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `📌 Lembrete: ${stepTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>📌 Tarefa pendente</h2>
        <p>A tarefa <strong>${stepTitle}</strong> tem prazo para <strong>${dueDate}</strong>.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/journey" style="display:inline-block;padding:12px 24px;background:#0D9488;color:#fff;text-decoration:none;border-radius:8px;margin-top:16px;">Ver jornada</a>
      </div>
    `,
  });
}
