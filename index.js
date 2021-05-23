const express = require('express');
const Web3 = require('web3');
const WKND = require('./build/contracts/WKND.json');

const app = express();
var serverAddr;
const blockchain = 'ws://localhost:7545';
const WKND_address = '0x9996F23545979bC3959B818926a56A541FdD71C5';
const web3 = new Web3(Web3.givenProvider || blockchain);
var wknd = new web3.eth.Contract(WKND.abi, WKND_address);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8081;

app.get('/winningCandidates', async (req, res) => {
    let list = await wknd.methods.winningCandidates().call();
    res.json(list);
});

app.post('/addCandidate', async (req, res) => {
    wknd.methods.addCandidate(req.body.cand).send({ from: serverAddr })
        .then(r => {
            res.sendStatus(200);
        }).catch(err => {
            console.debug(err);
            const txHash = Object.keys(err.data)[0];
            res.status(401).send(err.data[txHash].reason);
        });
});

app.get('/getCandidates', async (req, res) => {
    let list = await wknd.methods.getCandidates().call();
    res.json(list);
});

// app.get('/getAddress', async (req, res) => {
//     let addr = await wknd.methods.getAddress().call();
//     res.json(addr);
// });

// TODO: cache data if connection is down
app.post('/vote', async (req, res) => {
    const MIN_GAS = 1000000;
    wknd.methods.approve(WKND_address, req.body.amount).send({
        from: req.body.voter,
        gas: MIN_GAS
    }).then(() => {
        wknd.methods.vote(req.body.cand, req.body.amount).send({
            from: req.body.voter,
            gas: MIN_GAS
        }).then(r => {
            res.sendStatus(200);
        }).catch(err => {
            console.debug(err);
            const txHash = Object.keys(err.data)[0];
            res.status(401).send(err.data[txHash].reason);
        });
    }).catch(err => {
        console.debug(err);
        const txHash = Object.keys(err.data)[0];
        res.status(401).send(err.data[txHash].reason);
    });
});

// TODO: cache data if connection is down
app.post('/register', async (req, res) => {
    wknd.methods.approve(WKND_address, 1).send({ from: serverAddr })
        .then(() => {
            wknd.methods.register(req.body.voter).send({ from: serverAddr })
                .then(r => {
                    res.sendStatus(200);
                }).catch(err => {
                    console.debug(err);
                    const txHash = Object.keys(err.data)[0];
                    res.status(401).send(err.data[txHash].reason);
                });
        }).catch(err => {
            console.debug(err);
            const txHash = Object.keys(err.data)[0];
            res.status(401).send(err.data[txHash].reason);
        });
});

app.get('/regPage', (req, res) => {

});

app.get('/votePage', (req, res) => {

});

const serverListener = app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    let acc = await web3.eth.getAccounts();
    serverAddr = acc[0];
});

