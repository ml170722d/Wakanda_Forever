const WKND = artifacts.require("WKND");

contract("WKND", accounts => {
    it("vote", async () => {
        const amount = 1;
        let wknd = await WKND.deployed();
        let balance;

        for (let i = 4; i <= 6; i++) {
            await wknd.transfer(accounts[i], amount, { from: accounts[0] });
        }

        balance = await wknd.balanceOf(accounts[0]).then(v => { return v.toNumber() });
        assert.equal(balance, 6000000 - 3, "*75* -> balance = " + balance);

        for (let i = 4; i <= 6; i++) {
            let r = Math.round(Math.random() * 10) % 3 + 1;
            await wknd.transfer(accounts[r], amount, { from: accounts[i] });
        }

        balance = 0;
        let arr = [];
        for (let i = 1; i <= 3; i++) {
            let n = await wknd.balanceOf(accounts[i]).then(v => { return v.toNumber() });
            balance += n;
            arr.push(n);
        }
        assert.equal(balance, 3, "*86* -> balance = " + balance);
        // assert.ok(false, arr);
    })
})