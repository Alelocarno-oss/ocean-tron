window.onload = async () => {
    // Forza la connessione se TronWeb è pigro
    const waitForTronWeb = async () => {
        let attempts = 0;
        while (!window.tronWeb && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
    };

    await waitForTronWeb();

    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        
        // 1. Indirizzo nel rettangolo blu
        const addrDisplay = document.getElementById('userAddressDisplay');
        if(addrDisplay) addrDisplay.innerText = address.substring(0,6) + '...' + address.substring(address.length - 4);

        try {
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 2. LEGGE SALDO TRX (REALE)
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxBalance = balanceSun / 1000000;
            const trxUsdValue = trxBalance * trxPrice;

            if(document.getElementById('trx-balance')) {
                document.getElementById('trx-balance').innerText = trxBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-usd-value').innerText = `$${trxUsdValue.toFixed(2)}`;
            }

            // 3. LEGGE SALDO TOKEN TT (REALE DAL CONTRATTO)
            // Usiamo il metodo 'at' con gestione dell'errore per il nodo Ocean
            const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
            const ttContract = await window.tronWeb.contract().at(ttContractAddr);
            const ttBalanceRaw = await ttContract.balanceOf(address).call();
            
            // Fix: Gestione del formato BigNumber del contratto
            const ttBalance = (ttBalanceRaw.toNumber ? ttBalanceRaw.toNumber() : Number(ttBalanceRaw)) / 1000000;
            const ttUsdValue = ttBalance * usdtPrice;

            if(document.getElementById('tt-balance')) {
                document.getElementById('tt-balance').innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('tt-usd-value').innerText = `$${ttUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // Aggiorna saldo disponibile se siamo nella pagina SEND
            const sendAvailable = document.getElementById('tt-balance-send');
            if(sendAvailable) sendAvailable.innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});

            // 4. CALCOLO WALLET ASSET (TOTALE)
            const totalWalletUsd = trxUsdValue + ttUsdValue;
            const totalDisplay = document.getElementById('total-wallet-value');
            if(totalDisplay) {
                totalDisplay.innerText = totalWalletUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                const totalInTrxEq = totalWalletUsd / trxPrice;
                document.getElementById('total-trx-eq').innerText = `≈ ${totalInTrxEq.toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;
            }

        } catch (e) {
            console.error("Errore Sincronizzazione:", e);
            // Se fallisce, mostriamo almeno un valore di caricamento
            if(document.getElementById('tt-balance')) document.getElementById('tt-balance').innerText = "0.00";
        }
    } else {
        console.log("TronLink non rilevato o bloccato.");
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
