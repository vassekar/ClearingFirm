# Clearing Firm Solidity Contract

An  agency  or  [corporation](https://financial-dictionary.thefreedictionary.com/corporation)  on  an  [exchange](https://financial-dictionary.thefreedictionary.com/exchange)  that  settles  transactions  for  a  [fee](https://financial-dictionary.thefreedictionary.com/Fee).  Most  exchanges  have  one  or  moreclearing  corporations  that  are  charged  with  matching  orders  together,  ensuring  that  [delivery](https://financial-dictionary.thefreedictionary.com/delivery)  is  made  to  the  correctparty,  and  collecting  margin  money.  Because  so  many  trades  take  place  on  an  exchange  in  a  given  day,  clearingcorporations  exist  to  process  what  each  party  owes  or  is  owed  in  a  central  location  so  that  the  fewest  [securities](https://financial-dictionary.thefreedictionary.com/Securities)  andthe  least  amount  of  [money](https://financial-dictionary.thefreedictionary.com/money)  actually  change  hands

If this concept is implemented in Etherum block chain , there is no need for this third party agent to clear the trades. This project demonstrates some of the clearing firm functions.


# User Stories
## Set up Broker Dealer accounts
 Broker dealer accounts are the customers of the clearing firm.  Broker dealer number is unique identifier in the system. 

Clearing Firm contact has a method to create a broker dealer account. 

       // Trade account -account number and balance
        struct  TradeAccount
        {
        uint accountNumber;
        uint balance;
        }

    // Create TradeAccounts
        
        function  setTradeAccounts() public  returns (uint AccountId)
        
        {
       TradeAccount storage _tradeAccount = TradeAccounts[nextTradeAccountId];
        _tradeAccount.accountNumber =  10000  + nextTradeAccountId;
        //set the initial deposit amount as 100,000 dollars
        _tradeAccount.balance =  100000;
        AccountId=_tradeAccount.accountNumber;
        nextTradeAccountId ++;
        return AccountId;
        }


## Add trades to Clear

Each brokerage firm add sell orders and buy orders.  Each trade has following attributes. Stock Name, Order Type, Number of Shares, Amount, Broker Dealer account. Trade Id is assigned once the trade details are added.
```java
/* add trades to clear, brokerage firms add these trades to clearing buckets. */
      function  addTradestoClear(uint _AccountNmber,string _StockName, uint _NoofStocks,uint _Amount, uint _OrderType)
      public  returns (uint Id)
        {
        Trade storage _trade = Trades[nextTradeId];
        _trade.AccountNumber=_AccountNmber;
        _trade.tradeId=nextTradeId;
        _trade.stockname=_StockName;
        _trade.noofstocks=_NoofStocks;
        _trade.orderType=_OrderType;
        _trade.status=0 ;
        _trade.amount= _Amount;
         Id = nextTradeId;
         nextTradeId ++;
         return Id;
        } 
 ```    

## Clear Trades
Clear trades will match and clear the trades between the buyer and seller. The amount is added to the seller and subtracted from the buyer, the status of the trade is changed to "Cleared".
 ``` sql 
//require(msg.sender==owner);
//The stocks status has to be active not cleared or cancelled.
require(Trades[buytradeId].status ==  0);
require(Trades[selltradeId].status ==  0);
for(uint i=0; i<nextTradeAccountId; i++)
{
TradeAccount storage _tradeAccount = TradeAccounts[i];
if (_tradeAccount.accountNumber==buyerAccountId)
{
//Call withdraw
require (_tradeAccount.balance-Amount >0);
_tradeAccount.balance-= Amount;
}
if (_tradeAccount.accountNumber==sellerAccountId)
{
//Call deposit
//check for overflow
uint max =  2**256-1;
require (_tradeAccount.balance+Amount < max);
_tradeAccount.balance+=Amount;
}
}
Trades[buytradeId].status =  1;
Trades[selltradeId].status =  1;
return  true;
}
 ```  

## Get Trade Details

Trade details can be retrieved by TradeId. 
  ```sql

//get all Trade fields
function  getTrade(uint id) public  view  returns (uint,uint,uint,string){
Trade storage t = Trades[id];
return (t.tradeId, t.status, t.amount,t.stockname);
}

```  
## Solidity Test 
```sql  
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

 var (tradeID,status,amount,stockName) = clearingFirm.getTrade(0);

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

  Assert.equal(buyerBalance, 90000, "buyer balance is 90,000.");
  Assert.equal(sellerBalance, 110000, "buyer balance is 110,000.");
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


}






```  
## Design Patterns

Few common design pattern is used in this project. 
1. overflow/underflow (clear trade method)
2. reentrancy
3. revert pattern
4. view methods versus payable


## Set up Project

DApp can be set up similar to PET Shop tutorials
1. Local Dev Server ( http://127.0.0.1:7545)
2. Ganache cli
3. Truffle
4. Node JS
5. MetaMask for browser interaction

step 1: Download from the following GIT location 
step 2: truffle compile
step 3 : start the Ganache CLI
step 4 : truffle migrate
step 5 : truffle test
step :  npm run dev




