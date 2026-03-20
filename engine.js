window.onload = async () => {
    if (window.tronWeb) {
        const address = window.tronWeb.defaultAddress.base58;
        
        // 1. Mostra Indirizzo Wallet
        const addrDisplay = document.getElementById('userAddressDisplay');
        if(addrDisplay) addrDisplay.innerText = address.substring(0,6) + '...' + address.substring(address.length - 4);

        try {
            // --- DATI MERCATO FISSI ---
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 2. LEGGE SALDO TRX (REALE DAL WALLET)
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxBalance = balanceSun / 1000000;
            const trxUsdValue = trxBalance * trxPrice;

            // Aggiorna riga TRX in Home
            if(document.getElementById('trx-balance')) {
                document.getElementById('trx-balance').innerText = trxBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-usd-value').innerText = `$${trxUsdValue.toFixed(2)}`;
            }

            // 3. LEGGE SALDO TOKEN TT (USDT) DAL CONTRATTO
            const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
            const ttContract = await window.tronWeb.contract().at(ttContractAddr);
            const ttBalanceRaw = await ttContract.balanceOf(address).call();
            const ttBalance = Number(ttBalanceRaw) / 1000000;
            const ttUsdValue = ttBalance * usdtPrice;

            // Aggiorna riga USDT in Home
            if(document.getElementById('tt-balance')) {
                document.getElementById('tt-balance').innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('tt-usd-value').innerText = `$${ttUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // 4. CALCOLO WALLET ASSET (RETTANGOLO BLU)
            // Somma (TRX * 0.11) + (TT * 0.99)
            const totalWalletUsd = trxUsdValue + ttUsdValue;
            
            const totalDisplay = document.getElementById('total-wallet-value');
            if(totalDisplay) {
                totalDisplay.innerText = totalWalletUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                
                // SOTTO IL VALORE $: Mostra l'equivalente totale in TRX (Somma totale / prezzo TRX)
                const totalInTrxEq = totalWalletUsd / trxPrice;
                document.getElementById('total-trx-eq').innerText = `≈ ${totalInTrxEq.toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;
            }

        } catch (e) {
            console.error("Errore Sincronizzazione:", e);
        }
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
