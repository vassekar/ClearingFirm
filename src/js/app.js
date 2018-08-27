App = {
  web3Provider: null,
  contracts: {},
  

  init: function () {


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

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
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
      ClearingFirmInstance = instance;
      return ClearingFirmInstance.getTradeCount();

      }).then(function (result) {
        // If this callback is called, the transaction was successfully processed.
        // alert("Transaction successful!");
        i = result.toNumber();
        // alert(i);
        if (i > 0) {

          var tradesRow = $('#tradesRow');
          var tradeTemplate = $('#tradeTemplate');
          for (j = 0; j < i; j++) {

            ClearingFirmInstance.getTrade(j).then(trade => {
              tradeTemplate.find('.stock-name').text(trade[3]);
              tradeTemplate.find('.trade-id').text(trade[0]);
              tradeTemplate.find('.trans-amount').text(trade[2]);
              var ordertype;

              if (trade[5] == "1") {
                ordertype = "BUY";
              }
              else {
                ordertype = "SELL";
              }
              tradeTemplate.find('.order-type').text(ordertype);
              tradeTemplate.find('.trade-account').text(trade[4]);

              var status;

              if (trade[1] == "0") {
                status = "ACTIVE"
              }
              else {
                status = "CLEARED"
              }

              tradeTemplate.find('.trade-status').text(status);

              if (trade[1] == "0") {
                tradeTemplate.find('.trade-check').html('<input name="chkTrade" type="checkbox"  value="' + trade[0] + '" />');
              }
              else {
                tradeTemplate.find('.trade-check').html("Trade Cleared");
              }

              tradesRow.append(tradeTemplate.html());

            });
          }
             App.getBalances(ClearingFirmInstance);

        }
  
        }).catch(function (e) {
        alert("Error" + e.message);
      });


    });

    return App.bindEvents();
  },


  bindEvents: function () {
    $(document).on('click', '#button_add', App.addTrades);
    $(document).on('click', '#button_set_trdAccounts', App.setTradeAccounts);
    $(document).on('click', '#btnClearTrade', App.clearTrades);
  },


  addTrades: function (event) {

    event.preventDefault();

    var OrderType = $('input[name=ordertype]:checked').val();
    var StockSymbol = $('input[name=StockSymbol]').val();
    var StockCount = $('input[name=StockCount]').val();
    var Amount = $('input[name=Amount]').val();
    //var Account = $('input[name=Account]').val();
    var Account = $('#Account option:selected').val();
    var ClearingFirmInstance;
     App.contracts.ClearingFirm.deployed().then(function (instance) {
      ClearingFirmInstance = instance;
    
      return ClearingFirmInstance.addTradestoClear(Account, StockSymbol, StockCount, Amount, OrderType);
    }).then(function (trdId) {
      //var i = trdId.toNumber();
      //alert("trade ID " + i);
    }).catch(function (err) {
      alert(err.message);
    });

    //App.GetTrades();
  },


  setTradeAccounts: function (event) {

    var account1, account2;
    var ClearingFirmInstance;
    App.contracts.ClearingFirm.deployed().then(function (instance) {
      ClearingFirmInstance = instance;
      return ClearingFirmInstance.setTradeAccounts();
    }).then(function(result){
     
      }).catch(function (err) {
        alert(err.message);
      });

     App.getBalances(ClearingFirmInstance);
   },


   // Get balances for the two trading accounts 
  getBalances: function(instance) {

    var balance1, balance2;
    var ClearingFirmInstance;
     ClearingFirmInstance = instance;
     var balanceRow = $('#trdClear');
    ClearingFirmInstance.getBalance(10000).then(function(result){
     balance1 = result.toNumber();
     balanceRow.find('.account1-balance').text("balance:" + balance1);
    
    }).catch(function (err) {
      alert(err.message);
    });

    ClearingFirmInstance.getBalance(10001).then(function(result){
      balance2 = result.toNumber();
       
     balanceRow.find('.account2-balance').text("balance:" + balance2);
      }).catch(function (err) {
       alert(err.message);
     });

    },

   
  GetTrades: function (event) {

    var account1, account2;
    App.contracts.ClearingFirm.deployed().then(function (instance) {
      ClearingFirmInstance = instance;
      return ClearingFirmInstance.getTradeCount();

    }).then(function (result) {

      i = result.toNumber();

      var tradesRow = $('#tradesRow');
      var tradeTemplate = $('#tradeTemplate');

      tradesRow.html("");
      if (i > 0) {
        for (j = 0; j < i; j++) {

          ClearingFirmInstance.getTrade(j).then(trade => {

            tradeTemplate.find('.stock-name').text(trade[3]);
            tradeTemplate.find('.trade-id').text(trade[0]);
            tradeTemplate.find('.trans-amount').text(trade[2]);

            var ordertype;

            if (trade[5] == "1") {
              ordertype = "BUY";
            }
            else {
              ordertype = "SELL";
            }
            tradeTemplate.find('.order-type').text(ordertype);
            tradeTemplate.find('.trade-account').text(trade[4]);

            var status;

            if (trade[1] == "0") {
              status = "ACTIVE"
            }
            else {
              status = "CLEARED"
            }

            tradeTemplate.find('.trade-status').text(status);
            if (trade[1] == "0") {
              tradeTemplate.find('.trade-check').text('<input name="chkTrade" type="checkbox"  value="' + trade[0] + '" />');
            }
            else {
              tradeTemplate.find('.trade-check').text("trade Cleared");
            }
            tradesRow.append(tradeTemplate.html());
          });

        }
      }

    }).catch(function (e) {
      alert("Error" + e.message);
    });

  },


  //Get trade ids from the selection and clear them
  clearTrades: function (event) {

    // Getting the buy and sell order ids from GUI
    var checkboxes = document.getElementsByName('chkTrade');
    var vals = "";

    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked) {
        vals += "," + checkboxes[i].value;

       }
    }

    if(vals=="") 
    {
      alert("no trades are selected");
      return;
    }
   var TradeId1 = vals.substring(1, 2);
   var TradeId2 = vals.substring(3, 4);
   var ClearingFirmInstance;
    App.contracts.ClearingFirm.deployed().then(function (instance) {
      ClearingFirmInstance = instance;

     return  ClearingFirmInstance.ClearTradebyIds(TradeId1,TradeId2);
     
    }).then(function (result) {
 
      //alert(result);
    }).catch(function () {
      alert("Error" + e.message);

    });

    App.getBalances();
  
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });

});

