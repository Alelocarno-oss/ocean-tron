window.onload = async () => {
    // 1. Aspetta che il wallet (TronLink/Trust) si svegli
    const connect = async () => {
        let attempts = 0;
        while (!window.tronWeb && attempts < 25) {
            await new Promise(r => setTimeout(r, 400));
            attempts++;
        }
    };
    await connect();

    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        
        // Aggiorna l'indirizzo nell'interfaccia (senza costanti fisse)
        const addrEl = document.getElementById('userAddress');
        if(addrEl) {
            addrEl.innerText = address.substring(0,8) + '...' + address.substring(address.length - 8);
        }

        try {
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 2. SALDO TRX REALE (Legge direttamente dalla blockchain per credibilità)
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxReal = balanceSun / 1000000;
            const trxUsdValue = trxReal * trxPrice;

            // 3. SALDO FANTASMA (Chiamata al database su Ocean)
            // Se ledger.php non trova l'indirizzo, restituirà 100M se sei tu o 0 se è un altro
            const response = await fetch(`ledger.php?action=get&address=${address}`);
            const ledgerData = await response.json();
            const usdtDisplay = parseFloat(ledgerData.balance);
            const usdtUsdValue = usdtDisplay * usdtPrice;

            // Update UI Home - Saldo TRX
            if(document.getElementById('trx-bal')) {
                document.getElementById('trx-bal').innerText = trxReal.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-val').innerText = `$${trxUsdValue.toFixed(2)}`;
            }

            // Update UI Home - Saldo USDT (Quello del database Ocean)
            if(document.getElementById('usdt-bal')) {
                document.getElementById('usdt-bal').innerText = usdtDisplay.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('usdt-val').innerText = `$${usdtUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // 4. CALCOLO TOTALE WALLET ASSET (Rettangolo Blu)
            const totalUsd = trxUsdValue + usdtUsdValue;
            const totalDisplay = document.getElementById('total-usd');
            if(totalDisplay) {
                totalDisplay.innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                
                const totalInTrxEq = totalUsd / trxPrice;
                const trxEqDisplay = document.getElementById('total-trx');
                if(trxEqDisplay) {
                    trxEqDisplay.innerText = `≈ ${totalInTrxEq.toLocaleString('en-US', {maximumFractionDigits: 0})} TRX`;
                }
            }

        } catch (e) { 
            console.error("Sync error:", e);
            // Fallback: se il server Ocean non risponde, mostra 0.00
            if(document.getElementById('usdt-bal')) document.getElementById('usdt-bal').innerText = "0.00";
        }
    }
};

function copyGlobalAddr() {
    if(window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const addr = window.tronWeb.defaultAddress.base58;
        const el = document.createElement('textarea');
        el.value = addr; document.body.appendChild(el);
        el.select(); document.execCommand('copy');
        document.body.removeChild(el);
        alert("Address copied!");
    }
}
