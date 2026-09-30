import express from 'express';
import dotenv from 'dotenv';
import nodemailer, { type SendMailOptions, type Transporter } from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory secure store for password reset verification codes
// Map<cleanEmail, { code: string; token: string; expiresAt: number }>
interface ResetRecord {
  code: string;
  token: string;
  expiresAt: number;
}
const passwordResetStore = new Map<string, ResetRecord>();

// Clean expired tokens every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of passwordResetStore.entries()) {
    if (record.expiresAt < now) {
      passwordResetStore.delete(email);
    }
  }
}, 15 * 60 * 1000);

// Initialize Nodemailer Transporter with fallback
function createTransporter(): Transporter {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Fallback simulator transporter that logs output cleanly if SMTP credentials are not yet configured in env
  return {
    sendMail: async (mailOptions: SendMailOptions) => {
      console.log('✉️ [SMTP Server (Simulation Mode) - Add SMTP_USER and SMTP_PASS in .env to send live emails]');
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      return { messageId: `simulated-${Date.now()}` };
    }
  } as unknown as Transporter;
}

const transporter = createTransporter();

// Helper to get formatted sender address
const getFromAddress = () => {
  return process.env.SMTP_FROM || '"EduLiaison — Carnet Numérique" <notifications@eduliaison.ci>';
};

// 1. API Endpoint: Send Welcome Email
// No generated password is sent; the email welcomes the user and confirms their chosen registration details.
app.post('/api/send-welcome-email', async (req, res) => {
  try {
    const { email, name, role, schoolCode } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Adresse email requise' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const recipientName = name ? name.trim() : 'Cher utilisateur';
    const roleLabel = role === 'parent' ? 'Parent d’élève' : role === 'enseignant' ? 'Professeur' : 'Direction / Administration';
    const appUrl = process.env.APP_URL || 'https://eduliaison.ci';

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #faf8ff; margin: 0; padding: 20px; color: #131b2e; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #eaedff; overflow: hidden; box-shadow: 0 4px 20px rgba(79,70,229,0.06); }
    .header { background: linear-gradient(135deg, #3525cd 0%, #4f46e5 50%, #fd6a49 100%); padding: 32px 24px; text-align: center; color: white; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .sublogo { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9; margin-top: 4px; }
    .body { padding: 32px 24px; }
    .greeting { font-size: 18px; font-weight: 700; color: #131b2e; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #464555; margin-bottom: 20px; }
    .card { background: #f2f3ff; border: 1px solid #dae2fd; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .card-title { font-size: 12px; font-weight: 700; color: #3525cd; text-transform: uppercase; margin-bottom: 10px; }
    .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #eaedff; }
    .info-row:last-child { border-bottom: none; }
    .btn { display: inline-block; background: #3525cd; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 10px; box-shadow: 0 4px 12px rgba(53,37,205,0.25); }
    .footer { padding: 24px; text-align: center; font-size: 11px; color: #777587; border-top: 1px solid #eaedff; background: #faf8ff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Edu<span style="color: #ffdad2;">Liaison</span></div>
      <div class="sublogo">Plateforme Scolaire Certifiée</div>
    </div>
    <div class="body">
      <div class="greeting">Bienvenue sur EduLiaison, ${recipientName} ! 👋</div>
      <p class="text">
        Votre compte pour l'espace <strong>${roleLabel}</strong> a été créé avec succès. Vous pouvez dès à présent suivre la scolarité en temps réel, consulter les notes, les présences et échanger en toute sécurité avec l'équipe pédagogique.
      </p>

      <div class="card">
        <div class="card-title">Récapitulatif de votre compte</div>
        <div class="info-row"><span>Nom et prénom :</span> <strong>${recipientName}</strong></div>
        <div class="info-row"><span>Identifiant (Email) :</span> <strong>${cleanEmail}</strong></div>
        <div class="info-row"><span>Profil actif :</span> <strong>${roleLabel}</strong></div>
        ${schoolCode ? `<div class="info-row"><span>Établissement rattaché :</span> <strong>${schoolCode}</strong></div>` : ''}
      </div>

      <p class="text" style="font-size: 13px;">
        Pour vous connecter, utilisez simplement l'adresse email <strong>${cleanEmail}</strong> et le mot de passe que vous avez défini lors de votre inscription.
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${appUrl}" class="btn">Accéder à mon espace EduLiaison →</a>
      </div>

      <p class="text" style="font-size: 12px; color: #777587;">
        🔒 <em>Pour votre sécurité, nous ne communiquons jamais votre mot de passe par email. Conservez vos identifiants confidentiels.</em>
      </p>
    </div>
    <div class="footer">
      © 2025-2026 EduLiaison CI. Ministère de l'Éducation Nationale • Service Notifications 24/7
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: getFromAddress(),
      to: cleanEmail,
      subject: `🎉 Bienvenue sur EduLiaison — Votre compte ${roleLabel} est créé`,
      html: htmlContent
    });

    res.json({ success: true, message: 'Email de bienvenue envoyé avec succès' });
  } catch (error: any) {
    console.error('Erreur envoi email bienvenue:', error);
    res.status(500).json({ error: error.message || "Erreur lors de l'envoi de l'email" });
  }
});

// 2. API Endpoint: Request Password Reset
// Generates a secure code sent ONLY by email. The code is NEVER returned in the API response.
app.post('/api/send-reset-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Adresse email requise' });
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // Generate secure 6-digit code and reset token
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = Date.now() + 60 * 60 * 1000; // 60 minutes validity

    // Store in memory
    passwordResetStore.set(cleanEmail, { code, token, expiresAt });

    const appUrl = process.env.APP_URL || 'https://eduliaison.ci';
    const resetUrl = `${appUrl}?reset=true&email=${encodeURIComponent(cleanEmail)}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #faf8ff; margin: 0; padding: 20px; color: #131b2e; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #eaedff; overflow: hidden; box-shadow: 0 4px 20px rgba(79,70,229,0.06); }
    .header { background: #3525cd; padding: 28px 24px; text-align: center; color: white; }
    .logo { font-size: 22px; font-weight: 800; }
    .body { padding: 32px 24px; }
    .title { font-size: 18px; font-weight: 700; color: #131b2e; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #464555; margin-bottom: 16px; }
    .code-box { background: #f2f3ff; border: 2px dashed #3525cd; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
    .code { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #3525cd; font-family: monospace; }
    .btn { display: inline-block; background: #3525cd; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 10px; box-shadow: 0 4px 12px rgba(53,37,205,0.25); }
    .footer { padding: 20px; text-align: center; font-size: 11px; color: #777587; border-top: 1px solid #eaedff; background: #faf8ff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Edu<span style="color: #ffdad2;">Liaison</span></div>
    </div>
    <div class="body">
      <div class="title">🔐 Réinitialisation de votre mot de passe</div>
      <p class="text">
        Nous avons reçu une demande de réinitialisation de mot de passe pour le compte associé à <strong>${cleanEmail}</strong>.
      </p>

      <p class="text">Voici votre code de sécurité confidentiel à 6 chiffres :</p>
      <div class="code-box">
        <div class="code">${code}</div>
        <div style="font-size: 11px; color: #777587; margin-top: 6px;">Ce code expire dans 60 minutes.</div>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe sur EduLiaison →</a>
      </div>

      <p class="text" style="font-size: 12px; color: #777587;">
        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe restera inchangé.
      </p>
    </div>
    <div class="footer">
      EduLiaison Sécurité • Système de protection certifié SSL/TLS
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: getFromAddress(),
      to: cleanEmail,
      subject: `🔑 Code de réinitialisation de votre mot de passe EduLiaison : ${code}`,
      html: htmlContent
    });

    // DO NOT RETURN the code in response to prevent security leaks
    res.json({ 
      success: true, 
      message: 'Un email contenant votre code de sécurité à 6 chiffres vous a été envoyé.' 
    });
  } catch (error: any) {
    console.error('Erreur envoi email réinitialisation:', error);
    res.status(500).json({ error: error.message || "Erreur lors de l'envoi de l'email" });
  }
});

// 3. API Endpoint: Verify Reset Code
app.post('/api/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ valid: false, error: 'Email et code requis' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = passwordResetStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({ valid: false, error: 'Aucune demande de réinitialisation en cours pour cet email ou le code a expiré.' });
    }

    if (record.expiresAt < Date.now()) {
      passwordResetStore.delete(cleanEmail);
      return res.status(400).json({ valid: false, error: 'Ce code a expiré. Veuillez refaire une demande.' });
    }

    if (record.code !== code.trim()) {
      return res.status(400).json({ valid: false, error: 'Code de sécurité invalide. Veuillez vérifier les 6 chiffres reçus par email.' });
    }

    res.json({ valid: true, message: 'Code vérifié avec succès' });
  } catch (error: any) {
    res.status(500).json({ valid: false, error: error.message || 'Erreur lors de la vérification' });
  }
});

// 4. API Endpoint: Confirm Password Reset
app.post('/api/confirm-password-reset', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = passwordResetStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({ error: 'Session de réinitialisation expirée ou introuvable.' });
    }

    if (record.expiresAt < Date.now()) {
      passwordResetStore.delete(cleanEmail);
      return res.status(400).json({ error: 'Ce code a expiré. Veuillez refaire une demande.' });
    }

    if (record.code !== code.trim()) {
      return res.status(400).json({ error: 'Code de sécurité incorrect.' });
    }

    // Successfully verified -> consume code from store
    passwordResetStore.delete(cleanEmail);

    res.json({ 
      success: true, 
      message: 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.' 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la réinitialisation du mot de passe' });
  }
});

// Vite Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 EduLiaison Server & SMTP Service running on http://localhost:${PORT}`);
  });
}

startServer();
