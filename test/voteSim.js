const WKND = artifacts.require("WKND");
contract("WKND", accounts => {
    it("choose election candidates", async () => {
        let wknd = await WKND.deployed();

        await wknd.addCandidate(accounts[1]);
        await wknd.addCandidate(accounts[2]);
        await wknd.addCandidate(accounts[3]);

        let list = await wknd.getCandidates();
        assert.equal(list.length, 3, "Not all of candidates were added; list: " + list);
    });

    it("give tokens to users", async () => {
        let wknd = await WKND.deployed();

        for (let i = 4; i < 9; i++) {
            await wknd.transfer(accounts[i], i, { from: accounts[0] });
        }
        await wknd.transfer(accounts[9], 1, { from: accounts[0] });

        for (let i = 4; i < 9; i++) {
            let balance = await wknd.balanceOf(accounts[i]).then(v => { return v.toNumber() });
            assert.equal(balance, i, "transfer of tokens failed; accounts[" + i + "] = " + balance);
        }

        let balance_oldInst = await wknd.balanceOf(accounts[0]).then(v => { return v.toNumber() });

        wknd = await WKND.deployed();
        let balance_newInst = await wknd.balanceOf(accounts[0]).then(v => { return v.toNumber() });
        assert.equal(balance_oldInst, balance_newInst, "Instance numbers not same; " + balance_newInst + " | " + balance_oldInst);
    });

    it("vote", async () => {
        let wknd = await WKND.deployed();

        const contAddress = await wknd.getAddress();
        let newChalEv = [];
        for (let i = 4; i < 9; i++) {
            let balance = await wknd.balanceOf(accounts[i]).then(v => { return v.toNumber() });
            assert.ok(balance > 0, "acc[" + i + "] balance is " + balance);

            // assert.ok(false, "addr = " + contAddress);
            await wknd.approve(contAddress, i, { from: accounts[i] });
            let ev = await wknd.vote(accounts[i % 3 + 1], i, { from: accounts[i] });
            newChalEv.push(ev);
        }
        await wknd.approve(contAddress, 1, { from: accounts[9] });
        let ev = await wknd.vote(accounts[1], 1, { from: accounts[9] });
        newChalEv.push(ev);

        assert.equal(newChalEv.length, 6, "List updatet faild; events = " + newChalEv.length);

        let list = await wknd.getCandidates();
        // assert.ok(false, "******** | " + list);
    });

    it("get list", async () => {
        let wknd = await WKND.deployed();
        let list = await wknd.winningCandidates();

        // assert.ok(false, list);
    })
});