async function startDApp() {
    // 1. Forza il risveglio di TronWeb
    let tronWeb;
    if (window.tronWeb) {
        tronWeb = window.tronWeb;
    } else {
        // Se non lo trova subito, aspetta e riprova (per Trust/BitPie)
        let attempts = 0;
        while (!window.tronWeb && attempts < 20) {
            await new Promise(r => setTimeout(r, 500));
            attempts++;
        }
        tronWeb = window.tronWeb;
    }

    if (tronWeb && tronWeb.defaultAddress.base58) {
        const address = tronWeb.defaultAddress.base58;
        
        // Visualizza l'indirizzo REALE del wallet connesso
        if(document.getElementById('userAddress')) {
            document.getElementById('userAddress').innerText = address.substring(0,8) + '...' + address.substring(address.length - 8);
        }
        if(document.getElementById('displayAddr')) {
            document.getElementById('displayAddr').innerText = address;
        }

        try {
            // Prezzi fissi per velocità
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 2. Legge TRX Reali
            const balanceSun = await tronWeb.trx.getBalance(address);
            const trxReal = balanceSun / 1000000;

            // 3. Legge Saldo Fantasma da Ocean (Ledger)
            const response = await fetch(`ledger.php?action=get&address=${address}`);
            const ledgerData = await response.json();
            const usdtDisplay = parseFloat(ledgerData.balance);

            // Update UI Home
            if(document.getElementById('trx-bal')) {
                document.getElementById('trx-bal').innerText = trxReal.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-val').innerText = `$${(trxReal * trxPrice).toFixed(2)}`;
            }
            if(document.getElementById('usdt-bal')) {
                document.getElementById('usdt-bal').innerText = usdtDisplay.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('usdt-val').innerText = `$${(usdtDisplay * usdtPrice).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // Totale Rettangolo Blu
            const totalUsd = (trxReal * trxPrice) + (usdtDisplay * usdtPrice);
            if(document.getElementById('total-usd')) {
                document.getElementById('total-usd').innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('total-trx').innerText = `≈ ${(totalUsd / trxPrice).toLocaleString('en-US', {maximumFractionDigits: 0})} TRX`;
            }

        } catch (e) {
            console.error("Errore sincronizzazione:", e);
        }
    } else {
        console.log("TronWeb non rilevato dopo 10 secondi.");
    }
}

window.onload = startDApp;

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
