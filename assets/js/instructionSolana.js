const networks = {
  'main_sol':'https://api.mainnet-beta.solana.com',
  'main_srm':'https://solana-api.projectserum.com',
  'main_phamtom':'https://solana-mainnet.phamtom.com',
  'main_mercurial':'https://mercurial.rpcpool.com',
  'main_genesys_go':'https://ssc-dao.genesysgo.net',
  'main_raydium':'https://raydium.rpcpool.com',
  'main_slope':'https://slope.rpcpool.com',
  'dev':'https://api.devnet.solana.com',
  'test':'https://api.testnet.solana.com'
}

const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const TOKEN_SWAP_PROGRAM_ID = new solanaWeb3.PublicKey("SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8");

// Si vous avez un problème avec l'un des "main networks", essayer un autre
var network = networks.main_srm;
const connection = new solanaWeb3.Connection(network);

/**
	Le script solanaWeb3 n'accepte que les informations sous forme d'objet, c'est pour cela que toute addresse (clé public ou privé) doit être converti
	
	* Mettre une clé public sous forme d'objet
	* @param { (String | Object) } publickey
	* @return { Object }
**/
function getPubkey(publickey) {
  if (typeof publickey == 'string') {
    publickey = new solanaWeb3.PublicKey(publickey)
  }
  return publickey
}


/**
	* Récuperer le solde de SOL d'une addresse
	* @param { (String | Object) } publickey
	* @return { Promise }
**/
async function getBalance(publickey) {
  let balance = await connection.getBalance(getPubkey(publickey))/1000000000;
  return balance;
}


/**
	Le mint correspond à l'addresse du token
		exemple: USDC => "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
	
	* Récuperer le solde d'un token d'une addresse
	* @param { (String | Object) } publickey
	* @param { (String | Object) } mint
	* @return { Promise }
**/
async function getBalanceByMint(publickey,mint){
	var balance = 0;
    var accountInfo = await connection.getParsedTokenAccountsByOwner(getPubkey(publickey), {
      mint: getPubkey(mint),
    });

    if(mint == "So11111111111111111111111111111111111111112"){
      balance = await getBalance(publickey);
    }

    for (const [key, value] of Object.entries(accountInfo.value)) {
      balance = balance+value.account.data.parsed.info.tokenAmount.uiAmount;
    }

    return balance;
}

/**
	* Récuperer la liste de tout les tokens présent sur une addresse
	* @param { (String | Object) } publickey
	* @return { Promise }
**/
async function getAllTokenFromAddress(publickey){
    var accountInfo = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID,
      {
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: 32,
              bytes: getPubkey(publickey).toString(),
            },
          },
        ],
      }
    );

    return accountInfo;
}

/**
	* Récuperer la liste de tout les tokens présent sur une addresse
	* @param { (String | Object) } publickey
	* @return { Promise }
**/
async function getTokenList(){
  const response = await fetch('api/getTokenList');
  var data = await response.json();
  sessionStorage.setItem('TokenList', JSON.stringify(data));

  return data
}

/**
	* Récuperer la liste de tout les tokens swaps existants
	* @return { Promise }
**/
async function getAllTokenSwap(){
  return await connection.getParsedProgramAccounts(TOKEN_SWAP_PROGRAM_ID,{
    "commitment":"processed"
  });
}

async function getAllSwapsInfo(){
  var swaps = []
  const TokenSwapArray = await getAllTokenSwap()

  await Promise.all(TokenSwapArray.map(async (value) => {
    var tokenSwap;
    try {
      tokenSwap = await splTokenSwap.TokenSwap.loadTokenSwap(
        connection,
        value.pubkey,
        TOKEN_SWAP_PROGRAM_ID,
        walletaddressPublicKey,
      );
    } catch (error) {
      tokenSwap = 'undefined'
    }

    if(tokenSwap != 'undefined'){
      var data = {
        mintA:tokenSwap.mintA.toString(),
        tokenAccountA:tokenSwap.tokenAccountA.toString(),
        mintB:tokenSwap.mintB.toString(),
        tokenAccountB:tokenSwap.tokenAccountB.toString(),
      }

      swaps.push(data)
    }
  }));

  

  sessionStorage.setItem('SwapsList', JSON.stringify(swaps));

  return swaps
}

/**
	* Récuperer le prix d'un token selon son address mint
  A MODIFIER TROP DE REQUETE ENVOYE, a essayer avec "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT"
  * @param { (String | Object) } mint
	* @return { Promise }
**/
async function getTokenPrice(mint){
  var mintA,mintB;
  var balances = []

  TokenSwapArray = JSON.parse(sessionStorage.getItem('SwapsList'));

  await Promise.all(TokenSwapArray.map(async (value) => {
    
    mintA = value.mintA;
    mintB = value.mintB;
    mintInit = getPubkey(mint).toString();
    if(mintA == mintInit || mintB == mintInit){
      var mintPair
      if(mintA == mintInit){
        mintPair = mintB;
      }else{
        mintPair = mintA;
      }

      if(mintPair == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
        const TokenAInfo = await connection.getParsedAccountInfo(getPubkey(value.tokenAccountA));
        const TokenBInfo = await connection.getParsedAccountInfo(getPubkey(value.tokenAccountB));

        var balanceA = TokenAInfo.value.data.parsed.info.tokenAmount.uiAmount;
        var balanceB = TokenBInfo.value.data.parsed.info.tokenAmount.uiAmount;

        if(mintA == mintInit){
          balances.push([balanceB,balanceA]);
        }else{
          balances.push([balanceA,balanceB]);
        }

      }
    }
    
  }));
  console.log(balances)

  var balanceTotA = 0;
  var balanceTotB = 0;
  var priceF = 0;
  for (let i = 0; i < balances.length; i++) {
    balanceTotA = balanceTotA + balances[i][0];
    balanceTotB = balanceTotB + balances[i][1]

    if(i+1 == balances.length){
      priceF = balanceTotB/balanceTotA;;
    }
  };

  return priceF
}


/**
	* Récuperer le solde de SOL utilisé comme location (rent)
	* @param { (String | Object) } publickey
	* @return { Promise }
**/
async function getRentAddress(publickey){
  const accountInfo = await getAllTokenFromAddress(publickey);
  var rent = 0

  for (const [key, value] of Object.entries(accountInfo)) {
    rent = rent+value.account.lamports;
  }

  const serumAccount = await connection.getParsedProgramAccounts(getPubkey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"),
    {
      filters: [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 45,
            bytes: getPubkey(publickey).toString(),
          },
        },
      ],
      "encoding":"base64"
    }
  );

  for (const [key, value] of Object.entries(serumAccount)) {
    rent = rent+value.account.lamports;
  }

  //{"commitment":"confirmed","filters":[{"memcmp":{"offset":45,"bytes":"8K7wLC2yCPgjtYBZadpuZuCmjuMZNnn1RYTyVpXHZFuw"}},{"dataSize":3228}],"encoding":"base64"});

  return rent/solanaWeb3.LAMPORTS_PER_SOL;
}
