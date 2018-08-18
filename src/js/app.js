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

        return ClearingFirmInstance.getTradeCount();

      }).then(function (result) {
        // If this callback is called, the transaction was successfully processed.
       // alert("Transaction successful!");
        i = result.toNumber();
       // alert(i);
        if (i > 0) {
          for (j = 0; j < i; j++) {

            ClearingFirmInstance.getTrade(j).then(trade => {
             // alert(trade[0]);
              //alert(trade[1]);

            });
          }
        }

      }).catch(function (e) {
        alert("Error" + e.message);
      });

     });

    return;
  },

};

  $(function () {
    $(window).load(function () {
      App.init();
    });
  
  });



  $(document).ready(function()
  {
  $("button_add").click(function() {
    
   var OrderType =document.getElementById('OrderType').value;
       
    });
  });
