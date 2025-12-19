import { createDeposit, checkDepositStatus } from '../src/lib/atlantic';

async function main() {
  try {
    const deposit = await createDeposit(1000, `TEST${Date.now()}`);
    console.log('Create deposit:', deposit);
    if (deposit?.data?.id) {
      const status = await checkDepositStatus(deposit.data.id);
      console.log('Status:', status);
    }
  } catch (err) {
    console.error('Error', err);
  }
}

main();
