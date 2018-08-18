pragma solidity ^0.4.17;



/*Clearing firm clears the trade between the buyer and seller accounts.  Simple clearing firm functionality is taken for demonstration
Handling margin and other functions are out of scope.
*/
contract ClearingFirm
{
  
address owner;

  /* Trades are already happened. matching and clearing is done by this contract. Trade struct represents trade attributes */


struct Trade
{
uint tradeId;
uint orderType;
uint status;
uint amount;
uint noofstocks;
string stockname;
uint AccountNumber;
}

// Trade account -account number and balance
struct TradeAccount
{
uint accountNumber;
uint balance; 
}


Trade[16] public Trades;

TradeAccount[4] public TradeAccounts;

uint nextTradeId=0;
uint nextTradeAccountId =0;



// Create TradeAccounts
function setTradeAccounts() public returns (uint AccountId)
{
 TradeAccount  storage _tradeAccount = TradeAccounts[nextTradeAccountId];
 _tradeAccount.accountNumber = 10000 + nextTradeAccountId;
 //set the initial deposit amount as 100,000 dollars
 _tradeAccount.balance = 100000; 
 AccountId=_tradeAccount.accountNumber;
 nextTradeAccountId ++;
 return AccountId;
}


/* add trades to clear, brokerage firms add these trades to clearing buckets. */
function addTradestoClear(uint _AccountNmber,string _StockName, uint _NoofStocks,uint _Amount, uint _OrderType) 
        public returns (uint Id)
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
      

function ClearTrade(uint buyerAccountId, uint sellerAccountId, uint buytradeId,uint selltradeId, uint Amount) public payable returns(bool) 
{

Trades[buytradeId].status = 1;
Trades[selltradeId].status = 1;

for(var i=0; i<nextTradeAccountId; i++)
{
 TradeAccount  storage _tradeAccount = TradeAccounts[i];

if (_tradeAccount.accountNumber==buyerAccountId)
{
//Call withdraw
_tradeAccount.balance-= Amount;
}

if (_tradeAccount.accountNumber==sellerAccountId)
{
//Call deposit
_tradeAccount.balance+=Amount;
}

}
return true;
}


//get all Trade fields
  function getTrade(uint id) public view returns (uint,uint,uint,string){

   Trade storage t = Trades[id];
   return (t.tradeId, t.status, t.amount,t.stockname);
  }

 //Get the trade counts to traverse in GUI
  function getTradeCount() public view returns(uint){

   return nextTradeId;

  }

//Get the balance of the tradeaccounts by accountID

   function  getBalance(uint AccountID) public view returns(uint Amount)
    {
        
        for(var i=0; i<nextTradeAccountId; i++)
        {
        TradeAccount  storage _tradeAccount = TradeAccounts[i];

        if (_tradeAccount.accountNumber==AccountID)
        {
          return _tradeAccount.balance;

        }
        }
    }


}
