var ERC20 = artifacts.require("ERC20");

module.exports = function (deployer) {
  deployer.deploy(ERC20);
};

// var WKND = artifacts.require("WKND");

// module.exports = function (deployer) {
//   deployer.deploy(WKND);
// };