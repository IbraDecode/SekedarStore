import { createDeposit, checkDepositStatus } from '../src/lib/atlantic';
import qs from 'querystring';

async function main() {
  try {
    // Test manual curl logic
    const testBody = qs.stringify({
      api_key: process.env.ATLANTIC_API_KEY,
      reff_id: `TEST${Date.now()}`,
      nominal: '10000',
      type: 'ewallet',
      method: 'qris',
    });
    console.log('Test body:', testBody);
    
    const manualRes = await fetch('https://atlantich2h.com/deposit/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: testBody,
    });
    const manualJson = await manualRes.json();
    console.log('Manual response:', manualJson);
    
    const deposit = await createDeposit(10000, `TEST${Date.now()}`);
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
