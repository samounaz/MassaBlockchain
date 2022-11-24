const crypto = require('crypto');

class Block {

    constructor(timestamp, transaction, previousHash = '') {
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transaction) +
                this.nonce
            )
            .digest('hex');
    }

    // Proof of work
    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
            ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block mined: ${this.hash}`);
    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    // Creation of the first block
    createGenesisBlock() {
        return new Block(Date.parse('2017-01-01'), "Genesis block", '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }


    addBlock(newBlock) {
        newBlock.previousHash =this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    // Check if the blockchain is still valid
    isChainValid() {
        const realGenesis = JSON.stringify(this.createGenesisBlock());
        if (realGenesis !== JSON.stringify(this.chain[0])) return false;

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (previousBlock.hash !== currentBlock.previousHash)  return false;
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
        }

        return true;
    }

}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;