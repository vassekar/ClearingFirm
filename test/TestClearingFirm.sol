pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ClearingFirm.sol";

contract TestClearingFirm {
  ClearingFirm clearingFirm = ClearingFirm(DeployedAddresses.ClearingFirm());


function testAddTtrades() public {

 uint returnedId = clearingFirm.addTradestoClear(1234,"NDAQ",100,10000,1);

 //uint returnedId = clearingFirm.getTradecount();

  uint expected = 0;

  Assert.equal(returnedId, expected, "Clearing trade id is 0.");
}


function testgetTrade() public {

 var (tradeID,status,Amount) = clearingFirm.getTrade(0);

Assert.equal(tradeID, 0, "Clearing trade id is 0."); 
Assert.equal(Amount, 10000, "Clearing trade Amount is 10000."); 
Assert.equal(status, 0, "Clearing trade status  is 0."); 
}
}