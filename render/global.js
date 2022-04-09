function head(body){
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
        <title>SolanaWebInfo</title>
        <link rel="icon" type="image/png" href="assets/icon.png">
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Audiowide">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins">
        <link rel="stylesheet" href="assets/fonts/fontawesome-all.min.css">
        <link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
        <link rel="stylesheet" href="assets/fonts/ionicons.min.css">
        <link rel="stylesheet" href="assets/fonts/material-icons.min.css">
        <link rel="stylesheet" href="assets/fonts/fontawesome5-overrides.min.css">
        <link rel="stylesheet" href="assets/css/Footer-Dark.css">
        <link rel="stylesheet" href="assets/css/Navigation-Clean.css">
        <link rel="stylesheet" href="assets/css/styleadd.css">
        <link rel="stylesheet" href="assets/css/styles.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bs-stepper/dist/css/bs-stepper.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css">
    </head>
        ${body}
    </html>
    `;
}

function Wallet(name,img){
    return `
    <hr style="background-color: #d1e8ff;">
    <div class="row">
    <div class="col-sm-auto" style="width: 15%;">
        <img src="${img}" style="max-height: 40px;" />
    </div>
    <div class="col-sm-auto" style="width: 45%;">
        <h3 style="color: rgb(255,255,255);margin: auto;">${name}</h3>
    </div>
    <div class="col-sm-auto" style="width: 40%;margin: auto;"><button onClick="connect('${name}')" class="btn btn-primary" type="button" style="background-color: rgb(29,137,248);">Connect</button></div>
</div>`
}

function header(nav,content,footer,path){

    SolanaWallets = "";

    const Wallets = [
        {
            'name':'Phantom',
            'img':'https://raydium.io/_nuxt/img/phantom.d9e3c61.png'
        },
        {
            'name':'Sollet.io',
            'img':'https://www.sollet.io/logo192.png'
        },
        {
            'name':'Sollet extension',
            'img':'https://www.sollet.io/logo192.png'
        }
    ]

    for (const element of Wallets) {
        SolanaWallets = SolanaWallets + Wallet(element.name,element.img)
    }

    return `<body style="background-color: #1e1e2f;font-family: &quot;Poppins&quot;,sans-serif;">
    <div class="loader-container">
        <div class="loader">
        </div>
    </div>
    <div style="width: 100%;padding: 15px;background-color: rgba(0,0,0,0.21);">
        <button class="btn btn-primary" id="sidebarCollapse" type="button" style="font-size: 24px;border:none;background: transparent;box-shadow:none;">
            <div class="row">
                <div class="col-sm-auto" style="width: 10%;">
                    <i class="fa fa-navicon" style="padding-right: 13px;"></i>
                </div>
                <div class="col-sm-auto" style="width: 80%;margin: auto;">
                    <div id="pathpage">${path}</div>
                </div>
            </div>
        
        </button>
        <button class="btn btn-primary text-center float-right d-xl-flex justify-content-xl-end align-items-xl-center tooltipcustom" type="button" style="background-color: rgb(29,137,248);font-size: 18px;" onclick="selectWallet()">
        <span class="tooltiptextcustom" id="tooltipaddr">Disconnected</span>
        <div class="row">
            <div class="col-md-auto d-xl-flex justify-content-xl-center align-items-xl-center">
                <div id="point" style="border-radius: 10px; background: rgb(200, 30, 30); height: 8px; width: 8px;"></div>
            </div>
            <div class="col-md-6" style="padding-left:0;">
                <div id="connectbut">Connect</div>
            </div>
        </div>
        </button>
    </div>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/chartjs.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bs-stepper/dist/js/bs-stepper.min.js"></script>
    <script src="assets/js/notif.js"></script>
    <script src="assets/js/jsfile.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@solana/web3.js@1.5.0/lib/index.iife.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@solana/spl-token@0.1.8/lib/index.iife.min.js"></script>
    <script src="assets/js/wallets.js"></script>
    <script src="assets/js/spl-token-swap.js"></script>
    <script src="assets/js/serum.js"></script>
    <script src="assets/js/buffer.js"></script>
    <script src="assets/js/instructionSolana.js"></script>
    <script src="assets/js/global.js"></script>

    <div class="row" style="width: 100%;">
        ${nav}
        <div id="contentbody" class="col" style="padding-left:40px;">
            <div id="lock" style="background-color: #27293d;margin-top: 20px;border-radius: .50rem!important;padding: 25px;">
                <h1 style="color: rgb(255,255,255);">Please unlock you wallet</h1>
            </div>
            <div id="unlock" style="opacity:0.3;cursor:not-allowed">
                ${content}
            </div>
        </div>
    </div>
    <div class="modal fade" style="color: rgb(255,255,255);" id="modalwalletconnect" tabindex="-1" role="dialog" aria-labelledby="modalwalletconnectLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content" style="background-color: #27293d;">
            <div class="modal-header" style="background-color: #27293d;">
            <h4 class="modal-title" id="modalwalletconnectLabel">Select your wallet</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: white;">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body" style="background-color: #27293d;">
                <div style="background-color: #27293d;margin: 20px;margin-top: 20px;border-radius: .50rem!important;padding: 25px;">
                    
                    ${SolanaWallets}

                </div>
            </div>
                <div class="modal-footer" style="background-color: #27293d;">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    ${footer}
    </div>
    
</body>
    `;
}

function navbar(){
    return `<div class="col-md-3" id="sidebar" style="min-height: 640px;height: 670px;">
                <div class="col-md-3" style="background: linear-gradient(#1d8bf8, #3359f4);border-radius: .50rem!important;margin: 20px;max-width: 320px;max-height: auto;height: 640px;">
                    <div style="color: rgb(255,255,255);margin-top: 15px;">
                        <h3 class="text-center" style="font-family: Audiowide, cursive;font-size: 100px!important;">S</h3>
                        <hr style="background-color: #d1e8ff;" />
                        <ul style="list-style: none;padding: 0;">
                            <li class="text-lowercase" style="font-size: 22px!important;color: rgb(255,255,255);padding-top: 5%;padding-bottom: 5%;padding-left: 10%;"><a href="#/" style="  color: #d1e8ff;text-decoration: none;"><i class="fa fa-home"></i>  Home</a></li>
                            <li class="text-lowercase" style="font-size: 22px!important;color: rgb(255,255,255);padding-top: 5%;padding-bottom: 5%;padding-left: 10%;"><a href="#/dashboard" style="  color: #d1e8ff;text-decoration: none;"><i class="fa fa-dashboard"></i>  Dashboard</a></li>
                        </ul>
                    </div>
                </div>
            </div>`;
}

function footer(){
    return `<div class="footer-dark" style="background-color: rgba(0,0,0,0.21);margin-top: 100px;">
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-sm-6 col-md-3 item">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="#">Web design (soon)</a></li>
                            <li><a href="#">Development (soon)</a></li>
                            <li><a href="#">Hosting (soon)</a></li>
                        </ul>
                    </div>
                    <div class="col-sm-6 col-md-3 item">
                        <h3>About</h3>
                        <ul>
                            <li><a href="#">(soon)</a></li>
                        </ul>
                    </div>
                    <div class="col-md-6 item text">
                        <h3>SolanaWebInfo</h3>
                        <p>Build on Solana.</p>
                    </div>
                    <div class="col item social">
                        <a href="https://t.me/" target="_blank"><i class="fab fa-telegram-plane"></i></a>
                        <a href="https://t.me/" target="_blank"><i class="fab fa-telegram"></i></a>
                        <a href="https://twitter.com/" target="_blank"><i class="icon ion-social-twitter"></i></a>
                        <a href="https://github.com/" target="_blank"><i class="fab fa-github"></i></a>
                        <a href="https://discord.gg/" target="_blank"><i class="fab fa-discord"></i></a>
                    </div>
                </div>
                <p class="copyright">SolanaWebInfo © 2022</p>
            </div>
        </footer>
    </div>`;
}

module.exports = { head , header , navbar , footer };
