window.onload = async () => {
    if (window.tronWeb) {
        const address = window.tronWeb.defaultAddress.base58;
        
        // 1. Mostra Indirizzo ovunque ci sia l'ID
        const addrDisplay = document.getElementById('userAddressDisplay');
        if(addrDisplay) addrDisplay.innerText = address.substring(0,6) + '...' + address.substring(address.length - 4);

        try {
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 2. LEGGE SALDO TRX REALE
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxBalance = balanceSun / 1000000;
            const trxUsdValue = trxBalance * trxPrice;

            // Aggiorna Home e Pagina Send per TRX
            if(document.getElementById('trx-balance')) document.getElementById('trx-balance').innerText = trxBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
            if(document.getElementById('trx-usd-value')) document.getElementById('trx-usd-value').innerText = `$${trxUsdValue.toFixed(2)}`;
            
            if(document.getElementById('trx-balance-send')) document.getElementById('trx-balance-send').innerText = trxBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
            if(document.getElementById('trx-usd-send')) document.getElementById('trx-usd-send').innerText = `$${trxUsdValue.toFixed(2)}`;

            // 3. LEGGE SALDO TOKEN TT (USDT)
            const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
            const ttContract = await window.tronWeb.contract().at(ttContractAddr);
            const ttBalanceRaw = await ttContract.balanceOf(address).call();
            const ttBalance = Number(ttBalanceRaw) / 1000000;
            const ttUsdValue = ttBalance * usdtPrice;

            // Aggiorna Home e Pagina Send per USDT
            if(document.getElementById('tt-balance')) document.getElementById('tt-balance').innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
            if(document.getElementById('tt-usd-value')) document.getElementById('tt-usd-value').innerText = `$${ttUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

            if(document.getElementById('tt-balance-send')) document.getElementById('tt-balance-send').innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
            if(document.getElementById('tt-usd-send')) document.getElementById('tt-usd-send').innerText = `$${ttUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

            // 4. CALCOLO WALLET ASSET (HOME)
            const totalWalletUsd = trxUsdValue + ttUsdValue;
            const totalDisplay = document.getElementById('total-wallet-value');
            if(totalDisplay) {
                totalDisplay.innerText = totalWalletUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                const totalInTrxEq = totalWalletUsd / trxPrice;
                document.getElementById('total-trx-eq').innerText = `≈ ${totalInTrxEq.toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;
            }

        } catch (e) { console.error("Errore Sincronizzazione:", e); }
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
