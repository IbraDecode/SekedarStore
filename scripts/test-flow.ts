import { fetchServices, createOrder } from '../src/lib/zaynflazz';
// import { createDeposit, checkDepositStatus } from '../src/lib/atlantic';

async function main() {
  try {
    // 1) Test fetch services
    const services = await fetchServices();
    console.log('Services count', services?.data?.length || 0);
    const sample = services?.data?.[0];
    if (!sample) return;
    
    console.log('Sample service:', {
      id: sample.sid,
      name: sample.layanan,
      category: sample.kategori,
      min: sample.min,
      max: sample.max,
      price: sample.harga
    });

    // 2) Test create order (skipping deposit for now due to Atlantic API issues)
    console.log('Testing order creation...');
    const order = await createOrder({ 
      layanan: sample.sid, 
      target: 'https://tiktok.com/@test', 
      jumlah: Number(sample.min) || 10 
    });
    console.log('Order created:', order);

    // TODO: Fix Atlantic API later
    // const deposit = await createDeposit(10000, `FLOW${Date.now()}`);
    // console.log('Deposit', deposit);
    
  } catch (err) {
    console.error('Error', err);
  }
}

main();
