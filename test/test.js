const WKND = artifacts.require("WKND");

contract("WKND", accounts => {
    it("balanceOf acc[0]", async () => {
        const wknd = await WKND.deployed();
        
        let n = await wknd.balanceOf(accounts[0]).then( v => {
            return v.toNumber()
        });

        assert.equal(n, 6000000, 'incorrect amount of funds on account[0]');
    });
    
    it("transfer 1 token from acc[0] to acc[1]", async () => {
        const wknd = await WKND.deployed();
        
        await wknd.transfer(accounts[1], 1, {from: accounts[0]});

        let n = await wknd.balanceOf(accounts[1]).then( v => {
            return v.toNumber()
        });

        assert.equal(n, 1, 'incorrect amount of funds on account[1]');
    });

    it("transfer 1 token from acc[1] to acc[0]", async () => {
        const wknd = await WKND.deployed();
        
        await wknd.transfer(accounts[0], 1, {from: accounts[1]});

        let n = await wknd.balanceOf(accounts[1]).then( v => {
            return v.toNumber()
        });

        assert.equal(n, 1, 'incorrect amount of funds on account[1]');
    });
    
});