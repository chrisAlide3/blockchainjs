const shajs = require('sha.js');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const fs = require('fs');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

// Using constructor method. Methods must be added as Blockchain.prototype.functionName = function() {}
function Blockchain(blockchainFileName, walletFileName, currentNodeUrl) {
  this.chain = [];
  this.pendingTransactions = [];

  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
  this.blockchainFileName = blockchainFileName;
  this.walletFileName = walletFileName;
  this.walletAddress = '';
  this.privateKey = '';
  this.walletAddresses = [];
}

Blockchain.prototype.loadWalletFromFile = function() {
  console.log("loadWalletFromFile");
  try {
    let parsedLine = null;
    // let index = 0;
    const lines = fs.readFileSync(this.walletFileName, 'utf8').split('\n');
    // Load wallets
    parsedLine = JSON.parse(lines[0]);
    parsedLine.forEach(privateKey => {
      this.walletAddresses.push(privateKey);
    });
    // Set first walletAddress as working address
    if (this.walletAddresses.length > 0) {
      this.setActiveWallet(this.walletAddresses[0]);
    }else {
      this.setActiveWallet(null);
    }

  } catch (error) {
    console.log("Error loading wallet: " + error);
  }
}

Blockchain.prototype.createWallet = function() {
  const keys = ec.genKeyPair();
  const privateKey = keys.getPrivate('hex');
  this.walletAddresses.push(privateKey);
  if (this.privateKey === '') {
    this.setActiveWallet(privateKey);
  }
  this.writeWalletFile();
}

Blockchain.prototype.setActiveWallet = function(privateKey) {
  if (privateKey !== null) {
    this.privateKey = privateKey;
    const keys = ec.keyFromPrivate(this.privateKey);
    this.walletAddress = keys.getPublic('hex');
  }else {
    this.privateKey = '';
    this.walletAddress = '';
  }
}

Blockchain.prototype.deleteWallet = function(privateKey) {
  const index = this.walletAddresses.indexOf(privateKey);
  // Remove Address from Wallet Addresses
  if (index >= 0) {
    this.walletAddresses.splice(index, 1);
    // Set 1st Address as active address if removed Address is active address
    if (privateKey === this.privateKey) {
      if (this.walletAddresses.length > 0) {
        this.setActiveWallet(this.walletAddresses[0]);
      }else {
        this.setActiveWallet(null);
      }
    }
    this.writeWalletFile();
  }
}

Blockchain.prototype.writeWalletFile = function() {
  try {
    // this.walletAddresses.push(privateKey);
    fs.writeFileSync(this.walletFileName, JSON.stringify(this.walletAddresses));
    // this.privateKey = this.walletAddresses[0];
    // const keys = ec.keyFromPrivate(this.privateKey);
    // this.walletAddress = keys.getPublic('hex');
  } catch (error) {
    console.log("Error writing wallet file: " + error);    
  }
}

Blockchain.prototype.loadBlockchainFromFile = function() {
  try {
    let parsedLine = null;
    const lines = fs.readFileSync(this.blockchainFileName, 'utf8').split('\n');
    // Load chain
    parsedLine = JSON.parse(lines[0]);
    parsedLine.forEach(block => {
      this.chain.push(block);
    });
    // Load pending transactions
    parsedLine = JSON.parse(lines[1]);
    parsedLine.forEach(transaction => {
      this.pendingTransactions.push(transaction);
    });
    // Load network nodes
    parsedLine = JSON.parse(lines[2]);
    parsedLine.forEach(networkNodeUrl => {
      this.networkNodes.push(networkNodeUrl);
    });
    console.log("Blockchain loaded from file");

  } catch (error) {
    console.log('Error loading blockchain file: ' + error);
  }
  
}

Blockchain.prototype.writeBlockchainFile = function(chain, pendingTransactions, networkNodes) {
  const data = JSON.stringify(chain) + '\n' + JSON.stringify(pendingTransactions) + '\n' + JSON.stringify(networkNodes);

  try {
    fs.writeFileSync(this.blockchainFileName, data);
    console.log('File ' + this.blockchainFileName + ' written succesfully');
  } catch (error) {
    console.log('Error writing file ' + this.blockchainFileName);
  }
}

Blockchain.prototype.createNewBlock = function(nonce, previousHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousHash: previousHash    
    }
    
    // Clearing the transaction array after the block is created
    this.pendingTransactions = [];
    // write newBlock to the chain
    this.chain.push(newBlock);
    this.writeBlockchainFile(this.chain, this.pendingTransactions, this.networkNodes);

    return newBlock;
}

Blockchain.prototype.getPreviousHash = function() {
  if (this.chain.length > 0) {
    return this.chain[this.chain.length -1].hash;
  }else {
    return "GENESIS";
  }
}
Blockchain.prototype.getLastBlock = function() {
  if (this.chain.length > 0) {
    return this.chain[this.chain.length -1];
  }else {
    return null;
  }
}

Blockchain.prototype.createTransaction = function(amount, sender, recipient) {
  const transaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid().split('-').join('')
  }

  return transaction;
}

Blockchain.prototype.hashTransaction = function(amount, sender, recipient) {
  return shajs('sha256').update(amount + sender + recipient).digest('hex');
}

Blockchain.prototype.signTransaction = function(transaction, privateKey) {
  const signingKey = ec.keyFromPrivate(privateKey);
  // Don't sign mining reward
  if (transaction.sender === '00') {
    return null;
  }
  if (signingKey.getPublic('hex') !== transaction.sender) {
    throw new Error('You cannot sign transactions from other wallets');
  }

  const hashTx = this.hashTransaction(transaction.amount, transaction.sender, transaction.recipient);
  const sig = signingKey.sign(hashTx, 'base64');
  return sig.toDER('hex');
}

Blockchain.prototype.transactionIsValid = function(transaction) {
  // Mining rewards are not signed. So return valid for them
  if (transaction.sender === '00') return true;

  if (!transaction.signature || transaction.signature.length === 0) {
    throw new Error('Transaction is not signed')
  }

  const publicKey = ec.keyFromPublic(transaction.sender, 'hex');
  return publicKey.verify(this.hashTransaction(transaction.amount, transaction.sender, transaction.recipient), transaction.signature);

}

Blockchain.prototype.addTransactionToPendingTransaction = function(transactionObj) {
  if (!transactionObj.sender || !transactionObj.recipient) {
    throw new Error('Transaction must include sender and recipient Address!');
  }
  if (!this.transactionIsValid(transactionObj)) {
    throw new Error('Cannot add invalid transaction to the chain!')
  }
  this.pendingTransactions.push(transactionObj);
  this.writeBlockchainFile(this.chain, this.pendingTransactions, this.networkNodes);

  // Returns the block index number this transaction will be recorded in the blockchain
  return this.getLastBlock()["index"] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = shajs('sha256').update(dataAsString).digest('hex');
  return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

  while (hash.substring(0, 4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce;
}

Blockchain.prototype.blockHasValidTransactions = function(block) {
  for (const transaction of block.transactions) {
    if (!this.transactionIsValid(transaction)) return false;

    return true;
  }
}

Blockchain.prototype.chainIsValid = function(chain) {
  let isValid = true;
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i -1];

    // Check if previousHash equals hash of previous block
    if (previousBlock.hash !== currentBlock.previousHash && (previousBlock.index + 1) == currentBlock.index) {
      isValid = false;
      break;
    }

    // Check if current block hash is valid by rehashing it
    const currentBlockData = {
      transactions: currentBlock.transactions,
      index: currentBlock.index
    };
    const calculatedHash = this.hashBlock(previousBlock.hash, currentBlockData, currentBlock.nonce);

    if (currentBlock.hash !== calculatedHash || calculatedHash.substring(0, 4) !== '0000') {
      isValid = false;
      break;
    }

    // Check if transactions in block are valid
    if (!this.blockHasValidTransactions(currentBlock)) {
      isValid = false;
      break;
    }
  }

  // Check genesis block
  const genesisBlock = chain[0];
  if (genesisBlock.nonce !== 100 || genesisBlock.previousHash !== '0' || genesisBlock.hash !== '0' || genesisBlock.transactions.length > 0) {
    isValid = false;
  }
  return isValid;
}

Blockchain.prototype.getBlock = function(hash) {
  let correctBlock = null;
  for (let block of this.chain) {
    if (block.hash === hash) {
      correctBlock = block;
      break;
    }
  }
  return correctBlock;
}

Blockchain.prototype.getTransactionById = function(transactionId) {
  let transactions = null;
  let transaction = null;

  for (let ic = 0; ic < this.chain.length; ic++) {
    transactions = this.chain[ic].transactions;
    console.log(this.chain[ic].index);

    for (let it = 0; it < transactions.length; it++) {
      if (transactions[it].transactionId === transactionId) {
        transaction = transactions[it];
        break;
      }
    }

    if (transaction !== null) {
      break;
    }
  }
  
  return transaction;
}

Blockchain.prototype.getTransactionsByAddress = function(address) {
  let blockTransactions = [];
  let addressTransactions = [];

  for (let ic = 0; ic < this.chain.length; ic++) {
    blockTransactions = this.chain[ic].transactions;

    for (let it = 0; it < blockTransactions.length; it++) {
      if (blockTransactions[it].sender === address || blockTransactions[it].recipient === address) {
        addressTransactions.push(blockTransactions[it]);
      }
    }

  }
  return addressTransactions;
}

Blockchain.prototype.getBalanceByAddress = function(address) {
  let balance = 0;
  // Balance from block
  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.sender === address) {
        balance -= transaction.amount
      }
      if (transaction.recipient === address) {
        balance += transaction.amount
      }
    })
  })

  // Balance from pending transactions
  this.pendingTransactions.forEach(transaction => {
    if (transaction.sender === address) {
      balance -= transaction.amount;
    }
    if (transaction.recipient === address) {
      balance += transaction.amount;
    }
  })

  return balance;
  
}

module.exports = Blockchain;