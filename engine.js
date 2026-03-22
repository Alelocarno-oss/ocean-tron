window.onload = async () => {
    const connect = async () => {
        let count = 0;
        while (!window.tronWeb && count < 15) {
            await new Promise(r => setTimeout(r, 500));
            count++;
        }
    };
    await connect();

    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        
        if(document.getElementById('userAddress')) {
            document.getElementById('userAddress').innerText = address.substring(0,8) + '...' + address.substring(address.length - 8);
        }

        try {
            // 1. SALDO TRX REALE
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxReal = balanceSun / 1000000;
            
            // 2. SALDO FANTASMA DAL SERVER OCEAN
            const response = await fetch(`ledger.php?action=get&address=${address}`);
            const ledgerData = await response.json();
            const usdtDisplay = parseFloat(ledgerData.balance);

            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // Update UI
            if(document.getElementById('trx-bal')) {
                document.getElementById('trx-bal').innerText = trxReal.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-val').innerText = `$${(trxReal * trxPrice).toFixed(2)}`;
            }

            if(document.getElementById('usdt-bal')) {
                document.getElementById('usdt-bal').innerText = usdtDisplay.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('usdt-val').innerText = `$${(usdtDisplay * usdtPrice).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            if(document.getElementById('send-available-balance')) {
                document.getElementById('send-available-balance').innerText = usdtDisplay.toLocaleString('en-US', {minimumFractionDigits: 2});
            }

            const totalUsd = (trxReal * trxPrice) + (usdtDisplay * usdtPrice);
            if(document.getElementById('total-usd')) {
                document.getElementById('total-usd').innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('total-trx').innerText = `≈ ${(totalUsd / trxPrice).toLocaleString('en-US', {maximumFractionDigits: 0})} TRX`;
            }

        } catch (e) { console.error("Sync error:", e); }
    }
};
