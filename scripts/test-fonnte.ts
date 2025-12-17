import { sendWhatsApp } from '../src/lib/fonnte';

async function main() {
  try {
    const target = process.env.TEST_WA || '62';
    const res = await sendWhatsApp({ target, message: 'Tes notifikasi Sekedar Store' });
    console.log('Fonnte response:', res);
  } catch (err) {
    console.error('Error', err);
  }
}

main();
