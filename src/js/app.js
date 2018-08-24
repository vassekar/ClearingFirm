App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    // Load trades
    $.getJSON('../trades.json', function (data) {
      var tradesRow = $('#tradesRow');
      var tradeTemplate = $('#tradeTemplate');

      for (i = 0; i < data.length; i++) {
        tradeTemplate.find('.stock-name').text(data[i].StockSymbol);
        tradeTemplate.find('.shares-count').text(data[i].NoofStocks);
        tradeTemplate.find('.trans-amount').text(data[i].Amount);
        tradeTemplate.find('.order-type').text(data[i].OrderType);

        tradesRow.append(tradeTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache

      //var ganache = require("ganache-cli");
      // App.web3.setProvider(ganache.provider());

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('ClearingFirm.json', function (data) {

      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ClearingFirmArtifact = data;
      App.contracts.ClearingFirm = TruffleContract(ClearingFirmArtifact);

      // Set the provider for our contract
      App.contracts.ClearingFirm.setProvider(App.web3Provider);

      var i;

      App.contracts.ClearingFirm.deployed().then(function (instance) {

        console.log(instance);
        ClearingFirmInstance = instance;

        //return ClearingFirmInstance.addTradestoClear(1234,"NDAQ",100,1000,1);

        //Set couple of trading accounts

        
   
        //ClearingFirmInstance.setTradeAccounts();

        return ClearingFirmInstance.getTradeCount();

      }).then(function (result) {
        // If this callback is called, the transaction was successfully processed.
       // alert("Transaction successful!");
        i = result.toNumber();
       // alert(i);
        if (i > 0) {
          for (j = 0; j < i; j++) {

            ClearingFirmInstance.getTrade(j).then(trade => {
              alert(trade[2]);
              alert(trade[3]);

            });
          }
        }

      }).catch(function (e) {
        alert("Error" + e.message);
      });

     });

     return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '#button_add', App.addTrades);
    $(document).on('click','#button_set_trdAccounts',App.setTradeAccounts);
   },


addTrades: function (event) {
  alert("I am here");
 event.preventDefault();

 alert($('input[name=ordertype]:checked', '#formIndex').val());

  alert($('#StockSymbol').val());

   App.contracts.ClearingFirm.deployed().then(function (instance) {
      ClearingFirmInstance = instance;

      var ClearingFirmInstance;

      return  ClearingFirmInstance.addTradestoClear(1234,"NDAQ",100,1000,1);

       }).then(function (result) {
           var i = result.toNumber();
     alert(i);
    }).catch(function (err) {
      alert(err.message);
    });

},

setTradeAccounts: function (event) {
  
   App.contracts.ClearingFirm.deployed().then(function (instance) {
      ClearingFirmInstance = instance;

      alert("I am here");
      var ClearingFirmInstance;
      var tradeTemplate = $('#trdAccounts');

      ClearingFirmInstance.setTradeAccounts().then(result =>
        {

         tradeTemplate.find('.trade-account1').text(result.toNumber());
       });

       ClearingFirmInstance.setTradeAccounts().then(result =>
        {

         tradeTemplate.find('.trade-account2').text(result.toNumber());
       });


       
       }).then(function (result) {
  
    }).catch(function (err) {
      alert(err.message);
    });

}

};


  $(function () {
    $(window).load(function () {
      App.init();
    });
  
  });

