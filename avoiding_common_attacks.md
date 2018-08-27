# Common attacks

##  Integer overflow/underflow 

uint max =  2**256-1;
require (_tradeAccount.balance+Amount < max);


## Security 

//Clearing firm creator is the only can execute deposit and withdraw from trading accounts

function  Constructor () public {
owner =  msg.sender;
}

## Data Integrity check
require(Trades[buytradeId].status ==  0);
require(Trades[selltradeId].status ==  0);

