var stepper1 = null;
var walletaddress = null;
var walletaddressPublicKey = null;

function secondtoDate(date) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    //var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    var d = new Date(0,0,0,0,0,0,date);

    //var dayName = days[d.getUTCDay()];
    var monthName = months[d.getUTCMonth()];
    var day = d.getUTCDate();
    var hours = d.getUTCHours();
    var minutes = d.getUTCMinutes();
    var seconds = d.getUTCSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';

    var timestamp = monthName+" "+day+", "+hours+":"+minutes+":"+seconds+" "+ampm;

    return timestamp
}

function secondsToDhm(seconds) {
    seconds = Number(seconds/1000);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    return dDisplay + hDisplay + mDisplay;
}

function showContent(){
    document.querySelector('.loader-container').classList.add('hidden');
}

function hideContent(){
    document.querySelector('.loader-container').classList.remove('hidden');
}

function notif(title,text,time,themenotif){
        window.createNotification({ 
        closeOnClick: true,
        displayCloseButton: false,
        positionClass: 'nfc-bottom-left',
        onclick: false,
        showDuration: time,
        theme: themenotif
        })({
        title: title,
        message: text,
        });
}

function addLinkToNotif(link,name){
    var notifs = document.getElementsByClassName('nfc-message');

    for (const [key, value] of Object.entries(notifs)) {
        if(value.innerHTML == name){
            value.innerHTML = '';
            var a = document.createElement('a');
            var linkText = document.createTextNode("See on explorer");
            a.appendChild(linkText);
            a.href = link;
            a.target = "_blank";
            value.appendChild(a);
        }
    }
}

window.addEventListener('DOMContentLoaded',function(event) {
    if(document.location.hash == ""){
        changepath('');
    }
    loadpage();
    getTokenList();
    getAllSwapsInfo();
});

window.addEventListener('hashchange', function(event){
    loadpage();
})

function changepath(newpath){
    document.location.href = '#/'+newpath;
}

function unlockedwallet(){
    if(localStorage.getItem('walletinfo')){
        walletaddress = getproviderinfo('publicKey');
        walletaddressPublicKey = new solanaWeb3.PublicKey(walletaddress);

        document.getElementById('unlock').style.cursor = 'default';
        document.getElementById('unlock').style.opacity = 1;
        document.getElementById('lock').style.display = 'none';
    }
}

async function loadpage(){
    hideContent()
    document.getElementById('path-home').style.display = 'none';
    document.getElementById('path-dashboard').style.display = 'none';
    document.getElementById('unlock').style.cursor = 'not-allowed';
    document.getElementById('unlock').style.opacity = 0.3;
    document.getElementById('lock').style.display = 'block';
    unlockedwallet()
    setTimeout(showContent, 100);

    switch (document.location.hash) {
        case '#/':
            document.getElementById('pathpage').innerHTML = 'Home';
            document.getElementById('unlock').style.cursor = 'default';
            document.getElementById('unlock').style.opacity = 1;
            document.getElementById('lock').style.display = 'none';
            document.getElementById('path-home').style.display = 'block';
            break;

        case '#/dashboard':
            document.getElementById('pathpage').innerHTML = 'Dashboard';
            document.getElementById('path-dashboard').style.display = 'block';
            if(localStorage.getItem('walletinfo')){
                refreshwallet()
            }
            break;
    }
}