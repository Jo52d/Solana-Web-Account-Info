var loadingbalance = 0;
async function getAccountBalances(){
    var table = document.getElementById("tablewallet");

    var row = table.insertRow(-1);
    row.id = 'loaderbalance';
    row.insertCell(0).innerHTML = '<img src="assets/img/spinner.gif" width="20" height="20"> Please wait during loading';
    row.insertCell(1).innerHTML = ''; row.insertCell(2).innerHTML = ''; row.insertCell(3).innerHTML = ''; row.insertCell(4).innerHTML = ''; row.insertCell(5).innerHTML = '';

    if(loadingbalance == 0){

        const accountlist = await getAllTokenFromAddress(walletaddressPublicKey)
        const balancelist = {};

        for (const [key, value] of Object.entries(accountlist)) {
            var thistokenName = 'Unknown';
            var thistokenSymbol = 'Unknown';
            var thistokenImg = 'assets/img/unknown.jpg';

            TokenArray = JSON.parse(sessionStorage.getItem('TokenList'));

            TokenArray.forEach((valuetoken) => {
                if (value.account.data.parsed.info.mint == valuetoken.address) {
                    thistokenName = valuetoken.name;
                    thistokenSymbol = valuetoken.symbol;
                    thistokenImg = valuetoken.logoURI;
                }
            });

            //var price = await getTokenPrice(value.account.data.parsed.info.mint);
            var price = 'Unknown';

            balancelist[key] = {
                mintToken: value.account.data.parsed.info.mint,
                addressToken: value.pubkey.toString(),
                tokenAmount: value.account.data.parsed.info.tokenAmount.uiAmount,
                tokenName: thistokenName,
                tokenSymbol: thistokenSymbol,
                tokenImg: thistokenImg,
                price
            }
            
        }

        var balancesol = await connection.getBalance(new solanaWeb3.PublicKey(walletaddress))

        var row = table.insertRow(-1);
        row.insertCell(0).innerHTML = '<img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" style="max-height: 40px;border-radius: 10px;" />';
        row.insertCell(1).innerHTML = 'Solana';
        row.insertCell(2).innerHTML = 'SOL';
        row.insertCell(3).innerHTML = balancesol/1000000000;

        for (const [key, value] of Object.entries(balancelist)) {
            var row = table.insertRow(-1);
            row.insertCell(0).innerHTML = '<img src="'+value.tokenImg+'" style="max-height: 40px;border-radius: 10px;" />';
            row.insertCell(1).innerHTML = value.tokenName;
            row.insertCell(2).innerHTML = value.tokenSymbol;
            row.insertCell(3).innerHTML = value.tokenAmount;
            row.insertCell(4).innerHTML = value.price;
        };

    }

    loadingbalance++;
    var row = document.getElementById('loaderbalance');
    row.parentNode.removeChild(row);

}

function resetbalance(){
    var table = document.getElementById("tablewallet");
    var len = table.rows.length-2;

    for (let i = 0; i < len; i++) {
        table.deleteRow(-1);
    }
}

async function refreshwallet(){
    resetbalance();
    var row = document.getElementById("tablewallet").insertRow(-1);
    row.id = 'loaderbalance';
    row.insertCell(0).innerHTML = '<img src="assets/img/spinner.gif" width="20" height="20"> Please wait during loading';
    row.insertCell(1).innerHTML = ''; row.insertCell(2).innerHTML = ''; row.insertCell(3).innerHTML = ''; row.insertCell(4).innerHTML = ''; row.insertCell(5).innerHTML = '';

    loadingbalance = 0;
    var row = document.getElementById('loaderbalance');
    row.parentNode.removeChild(row);
    getAccountBalances();
}

async function getRentInfo(){
    document.getElementById('rent').innerHTML = '<img src="assets/img/spinner.gif" width="20" height="20"> Please wait during loading';
    var rent = await getRentAddress(walletaddressPublicKey);
    document.getElementById('rent').innerHTML = rent+" Sol";
}