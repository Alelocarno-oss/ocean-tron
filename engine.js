async function startApp() {
    // 1. Aspetta TronWeb con timeout di 5 secondi
    let attempts = 0;
    while (!window.tronWeb && attempts < 20) {
        await new Promise(res => setTimeout(res, 250));
        attempts++;
    }

    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        if(document.getElementById('userAddressDisplay')) {
            document.getElementById('userAddressDisplay').innerText = address.substring(0,6) + '...' + address.substring(address.length - 4);
        }

        try {
            const trxPrice = 0.1182;
            const usdtPrice = 0.9998;

            // 2. SALDO TRX
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxBalance = balanceSun / 1000000;
            const trxUsdValue = trxBalance * trxPrice;

            if(document.getElementById('trx-balance')) {
                document.getElementById('trx-balance').innerText = trxBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-usd-value').innerText = `$${trxUsdValue.toFixed(2)}`;
            }

            // 3. SALDO TT (1000 TT) - Lettura forzata dal contratto
            const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
            const ttContract = await window.tronWeb.contract().at(ttContractAddr);
            const ttBalanceRaw = await ttContract.balanceOf(address).call();
            
            // Gestione precisa del numero (anche se TrustWallet segna 0, noi leggiamo qui)
            const ttBalance = Number(ttBalanceRaw) / 1000000;
            const ttUsdValue = ttBalance * usdtPrice;

            if(document.getElementById('tt-balance')) {
                document.getElementById('tt-balance').innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('tt-usd-value').innerText = `$${ttUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // 4. TOTALE WALLET ASSET
            const totalUsd = trxUsdValue + ttUsdValue;
            if(document.getElementById('total-wallet-value')) {
                document.getElementById('total-wallet-value').innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                document.getElementById('total-trx-eq').innerText = `≈ ${(totalUsd / trxPrice).toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;
            }

        } catch (e) { console.error("Errore lettura:", e); }
    }
}

window.onload = startApp;

function copyGlobalAddr() {
    const addr = window.tronWeb.defaultAddress.base58;
    const el = document.createElement('textarea');
    el.value = addr; document.body.appendChild(el);
    el.select(); document.execCommand('copy');
    document.body.removeChild(el);
    alert("Address copied!");
}
