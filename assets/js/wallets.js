var walletprovider = null;
var protocol = location.protocol;
protocol = protocol.substring(0,protocol.length-1);
const origin = protocol+'://'+window.location.host;

/**
	* Commande du bouton "Connect"/"Disconnect" pour : afficher les différents portefeuille/déconnecter un portefeuille
**/
function selectWallet(){
  if(document.getElementById('connectbut').innerHTML == 'Connect'){
    $('#modalwalletconnect').modal('show');
  }
  if(document.getElementById('connectbut').innerHTML == 'Disconnect'){
    disconnect();
    loadpage();
  }
}

/**
	* Sauvegarde les informations concernant le portefeuille dans le navigateur, modifie le bouton "Connect" en "Disconnect" et affiche l'addresse du portefeuille au survol du bouton "Disconnect"
	* @param { String } provider
  * @param { String } publicKey
  * @param { Boolean } autoApprove
  * @param { Boolean } [autoConnect=false]
**/
function displayproviderinfo(provider,publicKey,autoApprove,autoConnect=false){
  const data = {
    provider,
    params:{
      publicKey,
      autoApprove,
      autoConnect
    }
  }

  localStorage.setItem('walletinfo', JSON.stringify(data));
  document.getElementById('connectbut').innerHTML = 'Disconnect';
  document.getElementById('point').style.background = 'rgb(167, 248, 200)';

  notif('Wallet update','Connected to wallet '+publicKey,4000,'success');
  document.getElementById('tooltipaddr').innerHTML = 'Address: '+publicKey;

  $('#modalwalletconnect').modal('hide');
}

/**
	* Ouvre la page de connection correspondant puis établit la connection après que le client l'ait accepté, récupère les informations du portefeuille et utilise la fonction "displayproviderinfo" avec celles-ci
	* @param { String } provider
**/
function connect(provider){
  switch (provider) {
    case 'Sollet.io':
      window.name='parent';
      walletprovider = window.open('https://www.sollet.io/#origin='+encodeURIComponent(origin)+'&network='+encodeURIComponent(network), '_blank','location,resizable,width=460,height=675');

      window.addEventListener('message',function(event) {
        if(event.origin !== 'https://www.sollet.io') return;
        if(event.data.method == 'connected'){
            displayproviderinfo(provider,event.data.params.publicKey,event.data.params.autoApprove)
        }
      });
      break;

    case 'Sollet extension':
      walletprovider = window.sollet;
      if(!walletprovider){
        notif('Sollet extension Error','Please install solong wallet from Chrome',4000,'error');

      }else{
        walletprovider.postMessage({
          jsonrpc:'2.0',
          method:'connect', 
          params: {
            network
          }
        });

        window.addEventListener('message',function(event) {
          if(event.data.method == 'connected'){
            displayproviderinfo(provider,event.data.params.publicKey,event.data.params.autoApprove)
            window.removeEventListener('message',function(event){})
          }
        })
      }
      break;

    case 'Phantom':
      walletprovider = window.solana;
      if(!(window.solana && window.solana.isPhantom)){
        notif('Phantom Error','Please install Phantom wallet from Chrome',4000,'error');
        window.open("https://phantom.app/", "_blank");
      }else{
        if(walletprovider.isConnected == true){
          displayproviderinfo(provider,walletprovider.publicKey.toString(),false,true)
        }else{
            walletprovider.connect();

          window.solana.on("connect", function(event) {
            displayproviderinfo(provider,window.solana.publicKey.toString(),false,true)
          })
        }

      }
      break;
  }
}

/**
	* Récupère les informations liés à un portefeuille stocké dans le navigateur
	* @param { String } provider
  * @return { ( Object | String | Boolean ) }
**/
function getproviderinfo(element){
  var providerinfo = JSON.parse(localStorage.getItem('walletinfo'));
  switch (element) {
    case 'provider':
      return providerinfo.provider;

    case 'autoApprove':
      return providerinfo.params.autoApprove;
    
    case 'publicKey':
      return providerinfo.params.publicKey;
    
    case 'autoConnect':
      return providerinfo.params.autoConnect;

  }
}
/**
	* Déconnecte un portefeuille du navigateur
**/
function disconnect(){
  var provider = getproviderinfo('provider');

  switch (provider) {
    case 'Sollet.io':
      walletprovider.close();
      break;

    case 'Phantom':
      walletprovider.disconnect();
      break;
  }

  document.getElementById('point').style.background = 'rgb(200, 30, 30)';
  document.getElementById('connectbut').innerHTML = 'Connect';
  document.getElementById('tooltipaddr').innerHTML = 'Disconnected';
  notif('Wallet update','Disconnected from your wallet',4000,'info');

  if(getproviderinfo('autoConnect') == false){
    localStorage.removeItem('walletinfo');
  }
}

/**
	* Déconnecte automatiquement le portefeuille lorsque la page est actualisé
**/
window.addEventListener('beforeunload',function (e) {
  disconnect()
});

/**
	* Connecte un portefeuille automatiquement au chargement de la page
**/
window.addEventListener('load',function(event) {
  
  if(!getproviderinfo("autoConnect") == false){
    if(getproviderinfo('autoConnect') == true){

      switch (getproviderinfo('provider')) {
        case 'Phantom':
          walletprovider = window.solana;
          walletprovider.connect();
          displayproviderinfo(getproviderinfo("provider"),getproviderinfo("publicKey"),getproviderinfo("autoApprove"),getproviderinfo("autoConnect"))
    
      }

    }
  }

});


/*
async function signtransaction(transaction){
  var provider = getproviderinfo('provider');
  const messageserial = transaction.serializeMessage(); 
  const message = bs58.encode(messageserial);
  var id = Date.now();

  switch (provider) {
    case 'Sollet.io':
      walletprovider.postMessage({
          jsonrpc: '2.0',
          id,
          method: 'signTransaction',
          params: {
              message,
          }
      },"*");

      walletprovider.focus()

      const promiseSollet = new Promise((resolve, reject) => {

        window.addEventListener('message',function(event) {
          if(event.origin === 'https://www.sollet.io'){
              if(!event.data.error){
                notif('Wallet update','The transaction has been signed',4000,'success');
                resolve({signature:event.data.result.signature,publicKey:event.data.result.publicKey});
              }else{
                notif('Wallet update',event.data.error,6000,'error');
              }
          }
        });

      });

      window.removeEventListener('message',function(event){})

      return promiseSollet;

    case 'Sollet extension':

      walletprovider.postMessage({
        jsonrpc: '2.0',
        id,
        method: 'signTransaction',
        params: {
          message
        }
      });

      const promiseSolletExt = new Promise((resolve, reject) => {

        window.addEventListener('message',function(event) {
          console.log(event)
          if(event.data.id == id){
            if(!event.data.error){
              notif('Wallet update','The transaction has been signed',4000,'success');
              resolve({signature:event.data.result.signature,publicKey:event.data.result.publicKey});
            }else{
              notif('Wallet update',event.data.error,6000,'error');
            }
          }
        });

      });

      window.removeEventListener('message',function(event){})
      
      return promiseSolletExt;

    case 'Phantom':
      await walletprovider.signTransaction(transaction);
      notif('Wallet update','The transaction has been signed',4000,'success');
      return {signature:walletprovider.signature.sign,publicKey:walletprovider.signature.publicKey};
  }
}*/
