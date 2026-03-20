window.onload = async () => {
    if (window.tronWeb) {
        const address = window.tronWeb.defaultAddress.base58;
        document.getElementById('userAddressDisplay').innerText = address.substring(0,6) + '...' + address.substring(address.length - 4);

        // 1. Legge Saldo TRX Reale
        const balanceSun = await window.tronWeb.trx.getBalance(address);
        const trx = balanceSun / 1000000;
        document.getElementById('trx-balance').innerText = trx.toFixed(2);
        const trxUsdValue = trx * 0.1182;
        document.getElementById('trx-usd-value').innerText = `$${trxUsdValue.toFixed(2)}`;

        // 2. Legge Saldo TT Reale (Il tuo contratto)
        const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
        try {
            const contract = await window.tronWeb.contract().at(ttContractAddr);
            const ttBalanceRaw = await contract.balanceOf(address).call();
            
            // Convertiamo il valore BigNumber della blockchain in numero leggibile
            // Usiamo Number() per assicurarci che non sia una stringa o un oggetto
            const ttBalance = Number(ttBalanceRaw) / 1000000; 
            
            // AGGIORNAMENTO DINAMICO: Mostra il numero di token (es. 9.999.900)
            document.getElementById('tt-balance').innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
            
            // CALCOLO VALORE: Moltiplica i token per il prezzo di mercato ($0.9998)
            const ttUsdValue = ttBalance * 0.9998;
            document.getElementById('tt-usd-value').innerText = `$${ttUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

            // 3. SOMMA TOTALE WALLET ASSET (Sopra nel rettangolo blu)
            const totalUsd = ttUsdValue + trxUsdValue;
            document.getElementById('total-wallet-value').innerText = totalUsd.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Equivalente in TRX (quello che vedi sotto il dollaro nel rettangolo blu)
            const trxEq = totalUsd / 0.1182;
            document.getElementById('total-trx-eq').innerText = `≈ ${trxEq.toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;

        } catch (e) { 
            console.error("Errore lettura saldo TT:", e);
            // Se c'è un errore, mostriamo almeno il TRX
            document.getElementById('total-wallet-value').innerText = trxUsdValue.toFixed(2);
        }
    }
};
