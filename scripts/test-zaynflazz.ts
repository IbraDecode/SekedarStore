import { fetchServices } from '../src/lib/zaynflazz';

async function main() {
  try {
    const res = await fetchServices();
    console.log('Services response:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error', err);
  }
}

main();
