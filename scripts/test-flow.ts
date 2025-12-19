import { fetchServices, createOrder } from '../src/lib/zaynflazz';
import { createDeposit, checkDepositStatus } from '../src/lib/atlantic';

async function main() {
  try {
    const services = await fetchServices();
    console.log('Services count', services?.data?.length || 0);
    const sample = services?.data?.[0];
    if (!sample) return;
    const deposit = await createDeposit(1000, `FLOW${Date.now()}`);
    console.log('Deposit', deposit);
    if (deposit?.data?.id) {
      const status = await checkDepositStatus(deposit.data.id);
      console.log('Deposit status', status);
    }
    const order = await createOrder({ layanan: sample.id, target: 'test', jumlah: Number(sample.min) || 10 });
    console.log('Order', order);
  } catch (err) {
    console.error('Error', err);
  }
}

main();
