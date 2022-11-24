const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const crypto = require('crypto');
const fs = require('fs');
const { Blockchain, Block } = require('./blockchain');
const ipfs = new ipfsClient({ host: 'localhost', port: '5001', protocol: 'http'});

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/upload', (req, res) => {
    const file = req?.files?.file;
    const fileName = req.files?.file?.name;
    const filePath = 'files/' + fileName;

    if(!req.files)
    {
        res.send("File was not found");
        return;

    } else {
        file.mv(filePath, async(err) => {
            if(err) {
                console.log('Error: failed to download the file');
                return res.status(500).send(err);
            }
            const fileHash = await addFile(fileName, filePath);
            fs.unlink(filePath, (err) => {
                if(err) console.log(err);
            });
            res.render('upload', { fileName, fileHash });
        });
    }
});

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({path: fileName, content: file});
    const fileHash = fileAdded[0]?.hash
        || crypto.createHash('md5').update(fileName).digest('hex');;

    const massaChain = new Blockchain();
    console.log('************* Mining new blocks using the proof of work ***************');
    console.log('Mining block 1');
    massaChain.addBlock(new Block("10/07/2017", {amount: 4, hashData: '56899'}));
    console.log('Mining block 2');
    massaChain.addBlock(new Block("10/09/2017", {amount: 10}));

    console.log('********* Display the blockchain ************');
    console.log(JSON.stringify(massaChain, null, 4));

    console.log('Verify the integrity of the blockchain if we attempt to modify an existing block');
    console.log('Is blockchain valid ? ' + massaChain.isChainValid());
    massaChain.chain[1].transaction = { amount: 100, hashData: '21b3ed445e0fbba12b2dcbb15c94a39b' };
    console.log('Is blockchain valid ? ' + massaChain.isChainValid());

    return fileHash;
};

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});