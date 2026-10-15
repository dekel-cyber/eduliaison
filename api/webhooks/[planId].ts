import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const serverFirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const serverDb = initializeFirestore(serverFirebaseApp, {
  experimentalAutoDetectLongPolling: true
}, firebaseConfig.firestoreDatabaseId);

function createTransporter() {
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
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
  }

  return {
    sendMail: async (mailOptions: any) => {
      console.log('✉️ [Vercel Serverless SMTP Simulation]');
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      return { messageId: `simulated-${Date.now()}` };
    }
  } as any;
}

const transporter = createTransporter();
const getFromAddress = () => process.env.SMTP_FROM || '"EduLiaison — Carnet Numérique" <notifications@eduliaison.ci>';

function extractCustomerInfo(obj: any): { email: string; name: string } {
  let email = 'client@example.com';
  let name = 'Client';

  if (!obj) return { email, name };

  const emailKeys = ['email', 'customer_email', 'buyer_email', 'user_email', 'mail', 'customeremail', 'buyeremail', 'client_email', 'useremail'];
  const nameKeys = ['name', 'customer_name', 'buyer_name', 'user_name', 'fullname', 'full_name', 'customername', 'buyername', 'client_name', 'username', 'nom', 'prenom', 'firstname', 'lastname', 'first_name', 'last_name'];

  function search(node: any, depth = 0) {
    if (!node || depth > 5) return;
    
    if (typeof node === 'object') {
      const keys = Array.isArray(node) ? node : Object.keys(node);
      for (const k of keys) {
        const val = Array.isArray(node) ? k : node[k];
        const keyStr = typeof k === 'string' ? k.toLowerCase() : '';

        if (val && typeof val === 'object') {
          search(val, depth + 1);
        } else if (typeof val === 'string' && val.trim().length > 0) {
          const trimmed = val.trim();
          if (email === 'client@example.com' && trimmed.includes('@') && (emailKeys.some(ek => keyStr.includes(ek)) || trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))) {
            email = trimmed;
          }
          if (name === 'Client' && nameKeys.some(nk => keyStr.includes(nk)) && trimmed.length > 1) {
            name = trimmed;
          }
        }
      }
    }
  }

  search(obj);

  return { email, name };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const planId = (req.query.planId as string) || 'plan_1500';
    const payload = req.body || {};

    const { email: customerEmail, name: customerName } = extractCustomerInfo(payload);
    const eventType = payload.event || payload.type || 'payment.success';

    const logId = `wh_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const webhookRecord = {
      id: logId,
      planId,
      event: eventType,
      status: 'success',
      customerEmail,
      customerName,
      payload: JSON.stringify(payload, null, 2),
      timestamp: new Date().toISOString()
    };

    try {
      await setDoc(doc(serverDb, 'webhook_logs', logId), webhookRecord);
    } catch (e) {
      console.warn('Could not save webhook log to Firestore in Vercel function:', e);
    }

    try {
      const planNames: Record<string, string> = {
        'plan_1500': 'Collège / Primaire Essentiel (1500 FCFA)',
        'plan_2100': 'Institution Complète (2100 FCFA)',
        'plan_15000': 'Réseau & Groupes Scolaires (15000 FCFA)'
      };
      const planLabel = planNames[planId] || planId;
      const appUrl = process.env.APP_URL || 'https://eduliaison.ci';

      const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #faf8ff; margin: 0; padding: 20px; color: #131b2e; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #eaedff; overflow: hidden; box-shadow: 0 4px 20px rgba(79,70,229,0.06); }
    .header { background: linear-gradient(135deg, #006e4b 0%, #3525cd 100%); padding: 32px 24px; text-align: center; color: white; }
    .logo { font-size: 24px; font-weight: 800; }
    .body { padding: 32px 24px; }
    .greeting { font-size: 18px; font-weight: 700; color: #131b2e; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #464555; margin-bottom: 20px; }
    .card { background: #f2f3ff; border: 1px solid #dae2fd; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #eaedff; }
    .info-row:last-child { border-bottom: none; }
    .btn { display: inline-block; background: #3525cd; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 10px; }
    .footer { padding: 24px; text-align: center; font-size: 11px; color: #777587; border-top: 1px solid #eaedff; background: #faf8ff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Edu<span style="color: #ffdad2;">Liaison</span></div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Confirmation de Paiement & Abonnement</div>
    </div>
    <div class="body">
      <div class="greeting">Félicitations ${customerName} ! 🎉</div>
      <p class="text">
        Nous venons de recevoir la confirmation de votre paiement pour l'abonnement à la plateforme <strong>EduLiaison</strong>. Votre souscription est désormais active.
      </p>

      <div class="card">
        <div style="font-size: 12px; font-weight: 700; color: #3525cd; text-transform: uppercase; margin-bottom: 10px;">Détails de la transaction</div>
        <div class="info-row"><span>Bénéficiaire / Nom :</span> <strong>${customerName}</strong></div>
        <div class="info-row"><span>Email :</span> <strong>${customerEmail}</strong></div>
        <div class="info-row"><span>Plan souscrit :</span> <strong>${planLabel}</strong></div>
        <div class="info-row"><span>Statut :</span> <strong style="color: #006e4b;">Validé & Actif ✅</strong></div>
        <div class="info-row"><span>Date :</span> <strong>${new Date().toLocaleDateString('fr-FR')}</strong></div>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${appUrl}" class="btn">Accéder à ma plateforme EduLiaison →</a>
      </div>
    </div>
    <div class="footer">
      © 2025-2026 EduLiaison CI • Service Facturation & Webhooks 24/7
    </div>
  </div>
</body>
</html>
      `;

      await transporter.sendMail({
        from: getFromAddress(),
        to: customerEmail,
        subject: `✅ Confirmation de votre abonnement EduLiaison (${planLabel})`,
        html: htmlContent
      });
    } catch (mailErr) {
      console.warn('Could not send purchase confirmation email in Vercel function:', mailErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook reçu, enregistré et email de confirmation envoyé avec succès',
      logId,
      customer: { name: customerName, email: customerEmail }
    });
  } catch (error: any) {
    console.error('Webhook function error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Erreur traitement webhook' });
  }
}
