pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ClearingFirm.sol";
import "../contracts/TradingAccount.sol";

contract TestClearingFirm {
  ClearingFirm clearingFirm = ClearingFirm(DeployedAddresses.ClearingFirm());
  //TradingAccount tradingAccount = TradeAccount(DeployedAddresses.TradeAccount());

address[] public trdAccounts;

function testAddTtrades() public {

 uint returnedId = clearingFirm.addTradestoClear(1234,"NDAQ",100,10000,1);

 uint expected = 0;

  Assert.equal(returnedId, expected, "Clearing trade id is 0.");
}


function testgetTrade() public {

 var (tradeID,status,amount,stockName,Amount,OrderType) = clearingFirm.getTrade(0);

Assert.equal(tradeID, 0, "Clearing trade id is 0."); 
Assert.equal(amount, 10000, "Clearing trade Amount is 10000."); 
Assert.equal(status, 0, "Clearing trade status  is 0."); 
Assert.equal(stockName, "NDAQ", "Clearing trade stock is  NDAQ."); 
}


//test Clear trade functionality
function  testClearTrade() public {

//Add two Trading accounts and get the account ids

uint buyerAccountId = clearingFirm.setTradeAccounts();
uint sellerAccountId = clearingFirm.setTradeAccounts();

//Add two trades one for sell and one for buy

 uint buyTradeId = clearingFirm.addTradestoClear(buyerAccountId,"MSFT",100,10000,1);
 uint sellTradeId = clearingFirm.addTradestoClear(sellerAccountId,"MSFT",100,10000,2);

clearingFirm.ClearTrade(buyerAccountId, sellerAccountId, buyTradeId,sellTradeId, 10000);

//check the balance for both buyer and seller

uint buyerBalance = clearingFirm.getBalance(buyerAccountId);
uint sellerBalance = clearingFirm.getBalance(sellerAccountId);
Assert.equal(buyerAccountId,10000, "buyer id is 10000");
Assert.equal(sellerAccountId,10001, "buyer id is 10001");
  Assert.equal(buyerBalance, 90000, "buyer balance is 90,000.");
  Assert.equal(sellerBalance, 110000, "seller balance is 110,000.");
}





//Test Balance method.

function testGetTradingAccountBalance() public {

uint tradeAccountID = clearingFirm.setTradeAccounts();
uint tradeAccountBalance = clearingFirm.getBalance(tradeAccountID);

Assert.equal(tradeAccountBalance, 100000, "Initial balance is 100,000");

}

//Test TradeCount method.
function testGetTradeCount() public
{

uint tradeCount = clearingFirm.getTradeCount();
Assert.equal(tradeCount, 3, "Trade count is 3");

}

function testclearTradebyIds() public
{

uint buyerAccountId = clearingFirm.setTradeAccounts();
uint sellerAccountId = clearingFirm.setTradeAccounts();
uint buyTradeId = clearingFirm.addTradestoClear(buyerAccountId,"NDAQ",10,1000,1);
uint sellTradeId = clearingFirm.addTradestoClear(sellerAccountId,"NDAQ",10,1000,2);

clearingFirm.ClearTradebyIds(buyTradeId,sellTradeId);

uint buyerBalance = clearingFirm.getBalance(buyerAccountId);

  Assert.equal(buyerBalance, 99000, "buyer balance is 99,000.");
  
}


}

