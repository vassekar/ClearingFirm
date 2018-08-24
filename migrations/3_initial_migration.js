var TradingAccount = artifacts.require("./TradingAccount");

module.exports = function(deployer) {
  deployer.deploy(TradingAccount);
};