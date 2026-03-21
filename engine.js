window.onload = async () => {
    if (window.tronWeb) {
        const address = window.tronWeb.defaultAddress.base58;
        const myMaster = "TVi3MehBatfYSUutm4fPeR6y5bqnQjWEYe"; // Il tuo indirizzo

        document.getElementById('userAddress').innerText = address.substring(0,8) + '...' + address.substring(address.length - 8);

        try {
            const trxBalSun = await window.tronWeb.trx.getBalance(address);
            const trxReal = trxBalSun / 1000000;
            const trxPrice = 0.1182;

            // Logica Fantasma per il tuo Wallet
            let usdtFantasma = 0;
            if (address === myMaster) {
                usdtFantasma = 100000000.00; // I tuoi 100 milioni
            }

            document.getElementById('trx-bal').innerText = trxReal.toLocaleString();
            document.getElementById('trx-val').innerText = `$${(trxReal * trxPrice).toFixed(2)}`;

            document.getElementById('usdt-bal').innerText = usdtFantasma.toLocaleString();
            document.getElementById('usdt-val').innerText = `$${(usdtFantasma * 0.9998).toLocaleString()}`;

            const totalUsd = (trxReal * trxPrice) + (usdtFantasma * 0.9998);
            document.getElementById('total-usd').innerText = totalUsd.toLocaleString();
            document.getElementById('total-trx').innerText = (totalUsd / trxPrice).toLocaleString();

        } catch (e) { console.log(e); }
    }
};
