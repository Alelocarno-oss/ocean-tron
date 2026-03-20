window.onload = async () => {
    if (window.tronWeb) {
        const address = window.tronWeb.defaultAddress.base58;
        const displayAddr = address.substring(0,6) + '...' + address.substring(address.length - 4);
        
        const addrElement = document.getElementById('userAddressDisplay');
        if(addrElement) addrElement.innerText = displayAddr;

        // 1. Dati Blockchain Reali
        try {
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trx = balanceSun / 1000000;
            const trxPrice = 0.1182;

            if(document.getElementById('trx-balance')) {
                document.getElementById('trx-balance').innerText = trx.toFixed(2);
                document.getElementById('trx-usd-value').innerText = `$${(trx * trxPrice).toFixed(2)}`;
            }

            // 2. Oracolo SunSwap V2 (TT Price)
            const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
            const poolAddress = "TY9r2KNQBG6JMrkqRySDPNqAk8Atg5tWga";
            
            const poolContract = await window.tronWeb.contract().at(poolAddress);
            const reserves = await poolContract.getReserves().call();
            const priceInTRX = (Number(reserves._reserve0) / 1e6) / (Number(reserves._reserve1) / 1e6);
            const ttPriceUsd = priceInTRX * trxPrice;

            // 3. Saldo Token TT
            const ttContract = await window.tronWeb.contract().at(ttContractAddr);
            const ttBalanceRaw = await ttContract.balanceOf(address).call();
            const ttBalance = Number(ttBalanceRaw) / 1000000;

            // AGGIORNAMENTO SPECCHIO (Index e Send)
            const ttBalanceDisplay = document.getElementById('tt-balance');
            if(ttBalanceDisplay) {
                ttBalanceDisplay.innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('tt-usd-value').innerText = `$${(ttBalance * ttPriceUsd).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // Se siamo nella pagina SEND, aggiorna il "Available"
            const sendAvailable = document.getElementById('send-available-balance');
            if(sendAvailable) {
                sendAvailable.innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
            }

            // 4. Totale Wallet Asset
            const totalUsd = (ttBalance * ttPriceUsd) + (trx * trxPrice);
            const totalDisplay = document.getElementById('total-wallet-value');
            if(totalDisplay) {
                totalDisplay.innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                document.getElementById('total-trx-eq').innerText = `≈ ${(totalUsd / trxPrice).toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;
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
