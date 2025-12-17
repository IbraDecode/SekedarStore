const FONNTE_BASE = 'https://api.fonnte.com/send';

function getToken() {
  const token = process.env.FONNTE_TOKEN;
  if (!token) throw new Error('FONNTE_TOKEN missing');
  return token;
}

export type WhatsAppPayload = {
  target: string;
  message: string;
};

export async function sendWhatsApp({ target, message }: WhatsAppPayload) {
  const form = new FormData();
  form.append('target', target);
  form.append('message', message);
  form.append('schedule', '0');
  form.append('delay', '2');
  form.append('countryCode', '62');

  const res = await fetch(FONNTE_BASE, {
    method: 'POST',
    headers: { Authorization: getToken() },
    body: form,
  });
  return res.json();
}
