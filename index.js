const express = require("express");
const app = express();
let port = 80;
let hostname = "127.0.0.1";
/*
const fs = require('fs');
let rawdata = fs.readFileSync('coinlist.json');
let coinlist = JSON.parse(rawdata);
*/
app.use('/assets', express.static('assets'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("", async (req, res) => {

  const renderglobal = require('./render/global.js');

  const contenthome = "<div id='path-home'></div>";

  const renderdashboard = require('./render/dashboard.js');
  const contentdashboard = "<div id='path-dashboard'>"+renderdashboard.wallet()+"</div>";


  const globalcontent = contenthome+contentdashboard;

  const footer = renderglobal.footer();
  const navbar = renderglobal.navbar();
  const header = renderglobal.header(navbar,globalcontent,footer,'Home');
  const head = renderglobal.head(header);

  res.send(head);

 /* app.post('/postdata', function(request, response){
    console.log(request.body);
    console.log(request.body.params.publicKey);
  });*/
})

app.get("/api/:request/:address?", async (req, res) => {

  const TokenList = require('@solana/spl-token-registry');
  var returnapi = "";

  if(req.params.request == "getTokenList"){
    await new TokenList.TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
      returnapi = JSON.stringify(tokenList);
    });
    
  }

  res.send(returnapi);

})


app.listen(port, hostname, () => {
  console.log(`http://${hostname}:${port}/`);
})