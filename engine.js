async function syncWallet() {
    // Aspetta che il wallet sia iniettato nel browser
    let attempts = 0;
    while (!window.tronWeb && attempts < 20) {
        await new Promise(r => setTimeout(r, 400));
        attempts++;
    }

    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        
        // Aggiorna Indirizzo in alto
        const addrEl = document.getElementById('userAddressDisplay');
        if(addrEl) addrEl.innerText = address.substring(0,6) + '...' + address.substring(address.length - 4);

        try {
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 1. Saldo TRX Reale
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxBalance = balanceSun / 1000000;
            const trxUsd = trxBalance * trxPrice;

            if(document.getElementById('trx-balance')) {
                document.getElementById('trx-balance').innerText = trxBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-usd-value').innerText = `$${trxUsd.toFixed(2)}`;
            }

            // 2. Saldo Token TT (Smascherato come USDT)
            const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
            const contract = await window.tronWeb.contract().at(ttContractAddr);
            const result = await contract.balanceOf(address).call();
            
            // Gestione dei 1000 TT: trasformazione in numero leggibile
            const ttBalance = (result.toNumber ? result.toNumber() : Number(result)) / 1000000;
            const ttUsd = ttBalance * usdtPrice;

            if(document.getElementById('tt-balance')) {
                document.getElementById('tt-balance').innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('tt-usd-value').innerText = `$${ttUsd.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // 3. Totale Rettangolo Blu
            const totalUsd = trxUsd + ttUsd;
            const totalEl = document.getElementById('total-wallet-value');
            if(totalEl) {
                totalEl.innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                document.getElementById('total-trx-eq').innerText = `≈ ${(totalUsd / trxPrice).toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;
            }

        } catch (e) {
            console.error("Errore Sincronizzazione:", e);
        }
    }
}

// Avvia la sincronizzazione
window.onload = syncWallet;

function copyGlobalAddr() {
    const addr = window.tronWeb.defaultAddress.base58;
    const el = document.createElement('textarea');
    el.value = addr; document.body.appendChild(el);
    el.select(); document.execCommand('copy');
    document.body.removeChild(el);
    alert("Address copied!");
}
