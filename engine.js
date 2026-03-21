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
        const myMaster = "TVi3MehBatfYSUutm4fPeR6y5bqnQjWEYe"; 

        const addrEl = document.getElementById('userAddress');
        if(addrEl) addrEl.innerText = address.substring(0,8) + '...' + address.substring(address.length - 8);

        try {
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 1. SALDO TRX (Sempre REALE per tutti)
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxReal = balanceSun / 1000000;
            const trxUsdValue = trxReal * trxPrice;

            // 2. SALDO USDT (FANTASMA SOLO PER TE, REALE PER ALTRI)
            let usdtDisplay = 0;
            if (address === myMaster) {
                usdtDisplay = 100000000.00;
            } else {
                try {
                    const contract = await window.tronWeb.contract().at("TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR");
                    const res = await contract.balanceOf(address).call();
                    usdtDisplay = Number(res) / 1000000;
                } catch(e) { usdtDisplay = 0; }
            }

            const usdtUsdValue = usdtDisplay * usdtPrice;

            // Update UI Home
            if(document.getElementById('trx-bal')) {
                document.getElementById('trx-bal').innerText = trxReal.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-val').innerText = `$${trxUsdValue.toFixed(2)}`;
            }

            if(document.getElementById('usdt-bal')) {
                document.getElementById('usdt-bal').innerText = usdtDisplay.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('usdt-val').innerText = `$${usdtUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // Totale Wallet Asset (Somma Reale TRX + USDT Fantasma/Reale)
            const totalUsd = trxUsdValue + usdtUsdValue;
            if(document.getElementById('total-usd')) {
                document.getElementById('total-usd').innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('total-trx').innerText = `≈ ${(totalUsd / trxPrice).toLocaleString('en-US', {maximumFractionDigits: 0})} TRX`;
            }

        } catch (e) { console.error("Sync error:", e); }
    }
};

function copyGlobalAddr() {
    const addr = window.tronWeb.defaultAddress.base58;
    const el = document.createElement('textarea');
    el.value = addr; document.body.appendChild(el);
    el.select(); document.execCommand('copy');
    document.body.removeChild(el);
    alert("Address copied!");
}
