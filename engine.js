window.onload = async () => {
    // Funzione per forzare l'attesa del wallet
    const connectWallet = async () => {
        let count = 0;
        while (!window.tronWeb && count < 20) {
            await new Promise(r => setTimeout(r, 300));
            count++;
        }
    };

    await connectWallet();

    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        if(document.getElementById('userAddressDisplay')) {
            document.getElementById('userAddressDisplay').innerText = address.substring(0,6) + '...' + address.substring(address.length - 4);
        }

        try {
            // 1. Saldo TRX
            const balanceSun = await window.tronWeb.trx.getBalance(address);
            const trxBalance = balanceSun / 1_000_000;
            const trxPrice = 0.1182;

            if(document.getElementById('trx-balance')) {
                document.getElementById('trx-balance').innerText = trxBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('trx-usd-value').innerText = `$${(trxBalance * trxPrice).toFixed(2)}`;
            }

            // 2. Lettura Token TT (I tuoi 1000 TT)
            const ttContractAddr = "TJ2YrqZpUaTpgirM5chX6S2VhA1imMfrMR";
            
            // Proviamo a chiamare il contratto
            const contract = await window.tronWeb.contract().at(ttContractAddr);
            const result = await contract.balanceOf(address).call();
            
            // Trasformiamo il risultato in numero (gestisce diversi formati di risposta)
            const ttBalance = (result.toNumber ? result.toNumber() : Number(result)) / 1_000_000;
            const ttUsdValue = ttBalance * 0.9998;

            if(document.getElementById('tt-balance')) {
                document.getElementById('tt-balance').innerText = ttBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
                document.getElementById('tt-usd-value').innerText = `$${ttUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            }

            // 3. Totale Rettangolo Blu
            const totalUsd = (trxBalance * trxPrice) + ttUsdValue;
            if(document.getElementById('total-wallet-value')) {
                document.getElementById('total-wallet-value').innerText = totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                document.getElementById('total-trx-eq').innerText = `≈ ${(totalUsd / trxPrice).toLocaleString('en-US', {maximumFractionDigits: 2})} TRX`;
            }

        } catch (err) {
            console.error("Errore Sincronizzazione:", err);
            // Se fallisce la lettura, forziamo uno zero pulito invece del nulla
            if(document.getElementById('tt-balance')) document.getElementById('tt-balance').innerText = "0.00";
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
