window.onload = async () => {
    const connect = async () => {
        let attempts = 0;
        // Aspettiamo fino a 10 secondi (20 * 500ms) per i wallet lenti
        while (!window.tronWeb && attempts < 20) {
            await new Promise(r => setTimeout(r, 500));
            attempts++;
        }
    };
    await connect();

    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        
        // MOSTRA L'INDIRIZZO REALE DELL'UTENTE
        if(document.getElementById('userAddress')) {
            document.getElementById('userAddress').innerText = address.substring(0,8) + '...' + address.substring(address.length - 8);
        }

        try {
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 1. TRX REALI
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxReal = balanceSun / 1000000;

            // 2. CHIAMATA AL SERVER (Senza indirizzi fissi nel JS)
            const response = await fetch(`ledger.php?action=get&address=${address}`);
            const ledgerData = await response.json();
            const usdtDisplay = parseFloat(ledgerData.balance);

            // Update UI
            document.getElementById('trx-bal').innerText = trxReal.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('usdt-bal').innerText = usdtDisplay.toLocaleString('en-US', {minimumFractionDigits: 2});
            
            const totalUsd = (trxReal * trxPrice) + (usdtDisplay * usdtPrice);
            document.getElementById('total-usd').innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2});
        } catch (e) { console.error("Sync error"); }
    } else {
        // SE NON C'E' WALLET, NON MOSTRARE IL TUO!
        if(document.getElementById('userAddress')) document.getElementById('userAddress').innerText = "Wallet not connected";
    }
};
