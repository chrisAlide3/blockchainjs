export const state = () => ({
  chain: [],
  pendingTransactions: [],
  networkNodes: [],
  walletAddress: '',
  walletAddresses: [],
  privateKey: '',
  currentNodeUrl: '',
  balance: 0,
  balanceOfAddresses: []
})

export const mutations = {
  LOAD_BLOCKCHAIN (state, blockchain) {
    state.chain = blockchain.chain;
    state.pendingTransactions = blockchain.pendingTransactions;
    state.networkNodes = blockchain.networkNodes;
    state.walletAddress = blockchain.walletAddress;
    state.walletAddresses = blockchain.walletAddresses;
    state.privateKey = blockchain.privateKey;
    state.currentNodeUrl = blockchain.currentNodeUrl;
  },

  addTransactionToPendingTransactions (state, transaction) {
    state.pendingTransactions.push(transaction);
  },

  overwritePendingTransactions (state, pendingTransactions) {
    state.pendingTransactions = pendingTransactions.map(transaction => {
      return transaction;
    })
  },

  writeBalance (state, balance) {
    state.balance = balance;
  },

  addBlockToChain (state, block) {
    state.chain.push(block);
  },

  clearPendingTransactions (state) {
    state.pendingTransactions = [];
  },

  setPrivateKey (state, privateKey) {
    state.privateKey = privateKey;
  },

  setWalletAddress (state, walletAddress) {
    state.walletAddress = walletAddress;
  },

  setWalletAddresses (state, walletAddresses) {
    state.walletAddresses = walletAddresses;
  },

  writeBalanceOfAdresses (state, balance) {
    state.balanceOfAddresses.push(balance);
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, {req}) {
    try {
      await dispatch('loadBlockchain');
    } catch (error) {
      console.log('Error dispatch loadBlockchain: ' + error);
    }
    if (this.getters.walletAddress !== '') {
      try {
        await dispatch('getBalancebyAddress', this.getters.walletAddress);
      } catch (error) {
        console.log('Error dispatch getBalancebyAddress: ' + error);
      }
    }
  },

  async loadBlockchain ({ commit }) {
    const blockchain = await this.$axios.$get('/api/blockchain');
    commit('LOAD_BLOCKCHAIN', blockchain);
  },

  async addTransaction ({ commit, dispatch }, transaction) {
    console.log("addTransaction in store: " + JSON.stringify(transaction));
    try {
      const response = await this.$axios.$post('/api/transaction/broadcast', transaction);
      commit('addTransactionToPendingTransactions', response.newTransaction);
      dispatch('calculateNewBalance', transaction);
    } catch (error) {
      console.log("Error in action addTransaction");
    }
    
  },

  calculateNewBalance ({ commit }, transaction) {
    let balance = this.getters.balance;
    if (this.getters.walletAddress === transaction.sender) {
      balance -= parseFloat(transaction.amount);
    }
    if (this.getters.walletAddress === transaction.recipient) {
      balance += parseFloat(transaction.amount);
    }
    commit('writeBalance', balance);
  },

  async getBalancebyAddress ({ commit }, walletAddress) {
    try {
      // const address = this.getters.walletAddress;
      const res = await this.$axios.$get('/api/address/' + walletAddress);
      commit('writeBalanceOfAdresses', res.balance);
      if (walletAddress === this.getters.walletAddress) {
        commit('writeBalance', res.balance);  
      }
    } catch (error) {
      console.log("Error getting balance: " + error);
    }
    
  },

  async mineBlock ({ commit, dispatch }) {
    try {
      const res = await this.$axios.$get('/api/mine');
      console.log("New block from mining: " + JSON.stringify(res.block));
      console.log("Reward transaction from mining: " + JSON.stringify(res.miningReward))
      //dispatch('loadBlockchain');
      commit('addBlockToChain', res.block);
      commit('clearPendingTransactions');
      if (res.miningReward !== null) {
        commit('addTransactionToPendingTransactions', res.miningReward)
        dispatch('calculateNewBalance', res.miningReward);  
      }
      //commit('overwritePendingTransactions', res.pendingTransactions);

    } catch (error) {
      console.log("Error in mineBlock action: " + error)   
    }
    
  },

  async createWallet ({ commit }) {
    console.log('enter store createWallet');
    
    try {
      const res = await this.$axios.$get('/api/create-wallet');
      console.log("Response from action create wallet: " + JSON.stringify(res));
      commit('setPrivateKey', res.privateKey);
      commit('setWalletAddress', res.walletAddress);
      commit('setWalletAddresses', res.walletAddresses);
    } catch (error) {
      console.log('Error in action createWallet');
    }
  },

  async deleteWallet ({ commit }, privateKey) {
    try {
      const res = await this.$axios.$post('/api/delete-wallet', privateKey);
      console.log("response from delete-wallet: " + JSON.stringify(res));
      
      commit('setWalletAddresses', res.walletAddresses);
      commit('setPrivateKey', res.privateKey);
      commit('setWalletAddress', res.walletAddress);
    } catch (error) {
      console.log('Error in action deleteWallet');
    }
  }
}

export const getters = {
  chain (state) {
    return state.chain;
  },

  pendingTransactions (state) {
    return state.pendingTransactions;
  },

  networkNodes (state) {
    return state.networkNodes;
  },

  walletAddress (state) {
    return state.walletAddress;
  },

  walletAddresses (state) {
    return state.walletAddresses;
  },

  privateKey (state) {
    return state.privateKey;
  },

  currentNodeUrl (state) {
    return state.currentNodeUrl;
  },

  balance (state) {
    return state.balance;
  },

  balanceOfAddresses (state) {
    return state.balanceOfAddresses;
  }

}