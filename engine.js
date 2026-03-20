window.onload = async () => {
    if (window.tronWeb) {
        const address = window.tronWeb.defaultAddress.base58;
        const addrDisplay = document.getElementById('userAddressDisplay');
        if(addrDisplay) addrDisplay.innerText = address.substring(0,6) + '...' + address.substring(address.length - 4);

        try {
            // 1. Prezzo TRX di mercato (fisso per calcolo USD)
            const trxMarketPrice = 0.1182;

            // 2. Legge Saldo TRX Reale dal Wallet
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxBalance = balanceSun / 1000000;
            const trxInUsd = trxBalance * trxMarketPrice;

            // Aggiorna riga TRX nella lista
            if(document.getElementById('trx-balance')) {
                document.getElementById('trx-balance').innerText = trxBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-usd-value').innerText = `$${trxInUsd.toFixed(2)}`;
            }

            // 3. LOGICA ORACOLO SUNSWAP (Prezzo Reale TT/USDT dalla Pool)
            const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
            const poolAddress = "TY9r2KNQBG6JMrkqRySDPNqAk8Atg5tWga";
            
            const poolContract = await window.tronWeb.contract().at(poolAddress);
            const reserves = await poolContract.getReserves().call();
            
            // Calcolo Prezzo: Riserva TRX / Riserva TT = Prezzo in TRX
            // Poi moltiplichiamo per il valore del TRX in USD
            const resTRX = Number(reserves._reserve0) / 1e6;
            const resTT = Number(reserves._reserve1) / 1e6;
            const ttPriceInTrx = resTRX / resTT; 
            const ttPriceInUsd = ttPriceInTrx * trxMarketPrice; // Questo darà circa lo 0.8075

            // 4. Legge Saldo Token TT (USDT) dal Wallet vero
            const ttContract = await window.tronWeb.contract().at(ttContractAddr);
            const ttBalanceRaw = await ttContract.balanceOf(address).call();
            const ttBalance = Number(ttBalanceRaw) / 1000000;

            // Aggiorna riga USDT (TT) nella lista
            const ttBalanceDisplay = document.getElementById('tt-balance');
            if(ttBalanceDisplay) {
                ttBalanceDisplay.innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                // Mostra il valore reale basato sulla pool
                document.getElementById('tt-usd-value').innerText = `$${(ttBalance * ttPriceInUsd).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
                // Aggiorna anche il prezzo unitario sotto il nome USDT
                const priceLabel = document.querySelector('.asset-row:nth-child(2) .token-info small');
                if(priceLabel) priceLabel.innerText = `$${ttPriceInUsd.toFixed(4)}`;
            }

            // 5. CALCOLO WALLET ASSET (Somma Totale)
            const totalWalletUsd = (ttBalance * ttPriceInUsd) + trxInUsd;
            const totalDisplay = document.getElementById('total-wallet-value');
            if(totalDisplay) {
                totalDisplay.innerText = totalWalletUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                
                // Sotto il valore $, mostra l'equivalente totale in TRX
                const totalInTrxEq = totalWalletUsd / trxMarketPrice;
                document.getElementById('total-trx-eq').innerText = `≈ ${totalInTrxEq.toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;
            }

        } catch (e) { 
            console.error("Errore Sincronizzazione Blockchain:", e);
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
