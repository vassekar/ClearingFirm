pragma solidity ^0.4.17;



/*Clearing firm clears the trade between the buyer and seller accounts.  Simple clearing firm functionality is taken for demonstration
Handling margin and other functions are out of scope.
*/
contract ClearingFirm
{
  
address owner;

  /* Trades are already happened. matching and clearing is done by this contract */
struct Trade
{
uint tradeId;
uint orderType;
uint status;
uint amount;
uint noofstocks;
string stockname;
}

struct TradeAccount
{
uint accountNumber;
uint balance; 
}


Trade[16] public Trades;

TradeAccount[4] public TradeAccounts;

uint nextTradeId=0;
uint nextTradeAccountId =0;

//Clearing firm creator is the only can execute deposit and withdraw from trading accounts
/*function Constructor () public {
    owner = msg.sender;
  }*/


function setTradeAccounts() public returns (uint AccountId)

{
 TradeAccount  storage _tradeAccount = TradeAccounts[nextTradeAccountId];
 _tradeAccount.accountNumber = 10000 + nextTradeAccountId;
 _tradeAccount.balance = 0; 
 AccountId=_tradeAccount.accountNumber;
 return AccountId;
}


/* add trades to clear, brokerage firms add these trades to clearing buckets. */
function addTradestoClear(uint _AccountNmber,string _StockName, uint _NoofStocks,uint _Amount, uint _OrderType) 
        public returns (uint Id)
{
 Trade storage _trade = Trades[nextTradeId];
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
      

function ClearTrade(uint buyerAccountId, uint sellerAccountId, uint8 buytradeId,uint8 selltradeId, uint Amount) public payable returns(bool) 
{


Trades[buytradeId].status = 1;
Trades[selltradeId].status = 1;

//b.withdraw(Amount);
//a.deposit(Amount); 

return true;

}


//get all Trade fields
  function getTrade(uint id) public view returns (uint,uint,uint){

   Trade storage t = Trades[id];
   return (t.tradeId, t.status, t.amount);
  }

 //Get the trade counts to traverse in GUI
  function getTradeCount() public view returns(uint){

   return nextTradeId;

  }

}
