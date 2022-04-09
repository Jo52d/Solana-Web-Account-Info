
function wallet(){
    return `
    <script src="assets/js/dashboard/script.js"></script>
    <div class="cardscy" style="background-color: #27293d;margin-top: 20px;border-radius: .50rem!important;padding: 25px;">
        <div class="row">
            <div class="col-sm-auto" style="width: 70%;">
                <h1 style="color: rgb(255,255,255);">Wallet  <span style="font-size:17px">(rent : <span id="rent">Unknown</span> )</span></h1>
                <button onClick="getRentInfo()" class="btn btn-secondary" type="button"><i class="fa fa-refresh"></i> Get rent info</button>
            </div>
            <div class="col-sm-auto" style="width: 30%;margin: auto;">
                <button onClick="refreshwallet()" class="btn btn-secondary" type="button" style="float:right;"><i class="fa fa-refresh"></i> Refresh</button>
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="table" id="tablewallet">
                <thead style="color: rgb(255,255,255);">
                    <tr>
                        <th>Logo</th>
                        <th>Name</th>
                        <th>Coin</th>
                        <th>Balance</th>
                        <th>Price</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody style="color: rgb(255,255,255);">
                </tbody>
            </table>
        </div>
        
    </div>`;
}



module.exports = { wallet };