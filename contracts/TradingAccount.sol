pragma solidity ^0.4.17;


contract TradingAccount
{

    uint BrokerageID;
   
    mapping(address=>uint256) public balance;

    function  getbalance() public view returns(uint Amount)
    {
        return balance[msg.sender];
    }

    function deposit(uint256 amount) public payable returns(bool success) 
    {
        uint max = 2**256-1;
        require (balance[msg.sender]+amount < max);
        balance[msg.sender] += amount;
        return true;
    }
    
  
    function withdraw(uint amount) public payable returns(bool success)
     {
         
        require(amount < address(msg.sender).balance);
        balance[msg.sender] -= amount;
        msg.sender.transfer(amount);
        return true; 
         
    }
     
}



















