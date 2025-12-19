import qs from 'querystring';

async function main() {
  try {
    console.log('=== ATLANTIC API DEBUG (Working Code Version) ===');
    
    // Test dengan format persis seperti kode yang work
    const api_key = process.env.ATLANTIC_API_KEY;
    const reff_id = `TEST${Date.now()}`;
    const total = 10000;
    
    console.log('API Key:', api_key?.substring(0, 20) + '...');
    console.log('Reff ID:', reff_id);
    console.log('Total:', total);
    
    // Test deposit create dengan format yang work
    const depositData = qs.stringify({
        api_key,
        reff_id,
        nominal: total, // integer
        type: 'ewallet',
        metode: 'qris'
    });

    console.log('\nDeposit Data:', depositData);
    
    const depositRes = await fetch('https://atlantich2h.com/deposit/create', depositData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const dataRes = await depositRes.json();
    console.log('\nDeposit Response:', JSON.stringify(dataRes, null, 2));
    
    if (!dataRes.status) {
        console.log('❌ Create deposit failed:', dataRes.message);
        return;
    }

    const info = dataRes.data;
    console.log('\n✅ Deposit berhasil!');
    console.log('Deposit ID:', info.id);
    console.log('QR String length:', info.qr_string?.length || 0);
    
    // Test status check
    console.log('\n=== Testing Status Check ===');
    const checkData = qs.stringify({
        api_key,
        id: info.id
    });

    console.log('Check Data:', checkData);
    
    const checkRes = await fetch('https://atlantich2h.com/deposit/status', checkData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const statusData = await checkRes.json();
    console.log('\nStatus Response:', JSON.stringify(statusData, null, 2));
    
  } catch (err) {
    console.error('Error', err);
  }
}

main();