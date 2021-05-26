const express = require('express');
const Web3 = require('web3');
const WKND = require('./build/contracts/WKND.json');
const { config } = require('dotenv');
config();

const app = express();
var serverAddr;
const web3 = new Web3(Web3.givenProvider || process.env.blockchain);
const wknd = new web3.eth.Contract(WKND.abi, process.env.WKND_address);

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
            console.error(err);
            const txHash = Object.keys(err.data)[0];
            res.status(401).send(err.data[txHash].reason);
        });
});

app.get('/getCandidates', async (req, res) => {
    let list = await wknd.methods.getCandidates().call();
    res.json(list);
});

// TODO: cache data if connection is down
app.post('/vote', async (req, res) => {

    const MIN_GAS = 1000000;
    wknd.methods.approve(process.env.WKND_address, req.body.amount).send({
        from: req.body.voter,
        gas: MIN_GAS
    }).then(() => {
        wknd.methods.vote(req.body.cand, req.body.amount).send({
            from: req.body.voter,
            gas: MIN_GAS
        }).then(r => {
            res.sendStatus(200);
        }).catch(err => {
            console.error(err);
            const txHash = Object.keys(err.data)[0];
            res.status(401).send(err.data[txHash].reason);
        });
    }).catch(err => {
        console.error(err);
        const txHash = Object.keys(err.data)[0];
        res.status(401).send(err.data[txHash].reason);
    });
});

// TODO: cache data if connection is down
app.post('/register', async (req, res) => {
    wknd.methods.approve(process.env.WKND_address, 1).send({ from: serverAddr })
        .then(() => {
            wknd.methods.register(req.body.voter).send({ from: serverAddr })
                .then(r => {
                    // res.sendStatus(200);
                    res.sendStatus(200);
                }).catch(err => {
                    console.error(err);
                    const txHash = Object.keys(err.data)[0];
                    res.status(401).send(err.data[txHash].reason);
                });
        }).catch(err => {
            console.error(err);
            const txHash = Object.keys(err.data)[0];
            res.status(401).send(err.data[txHash].reason);
        });
});

app.get('/regPage', (req, res) => {
    res.sendFile(`${__dirname}/html/register.html`);
});

app.get('/votePage', (req, res) => {
    res.sendFile(`${__dirname}/html/vote.html`);
});

const serverListener = app.listen(port, async () => {
    let acc = await web3.eth.getAccounts();
    serverAddr = acc[0];

    console.log(`Server running on port ${port}`);
});

