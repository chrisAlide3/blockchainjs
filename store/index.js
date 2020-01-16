export const state = () => ({
  chain: [],
  pendingTransactions: [],
  networkNodes: [],
  walletAddress: '',
  walletAddresses: [],
  privateKey: '',
  currentNodeUrl: '',
  balance: 0,
  balanceOfAddresses: [],
  error: '',
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

  removeAddressFromWalletAddresses (state, index) {
    if (index >= 0) {
      state.walletAddresses.splice(index, 1);
    }
  },

  writeBalanceOfAdresses (state, balance) {
    state.balanceOfAddresses.push(balance);
  },

  removeBalanceFromBalanceOfAddresses (state, index) {
    if (index >= 0) {
      state.balanceOfAddresses.splice(index, 1);
    }
  },

  setNetworNodes (state, networkNodes) {
    state.networkNodes = networkNodes;
  },

  setError (state, message) {
    state.error = message;
    console.log("Error in state: " + state.error);
  }
}

export const actions = {  
  async nuxtServerInit ({ commit, dispatch }, {req}) {
    console.log("axiosBaseUrl: ", this.$axios.defaults.baseURL);
    
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

  async getBalanceOfActiveWallet ({ commit }, walletAddress) {
    try {
      // const address = this.getters.walletAddress;
      const res = await this.$axios.$get('/api/address/' + walletAddress);
      commit('writeBalance', res.balance);  
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
    console.log("axiosBaseUrl in store: ", this.$axios.defaults.baseURL);    
    try {
      const res = await this.$axios.$get('/api/create-wallet');
      commit('setPrivateKey', res.privateKey);
      commit('setWalletAddress', res.walletAddress);
      commit('setWalletAddresses', res.walletAddresses);
    } catch (error) {
      console.log('Error in action createWallet');
    }
  },

  async deleteWallet ({ commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$post('/api/delete-wallet', payload);
      const index = this.getters.walletAddresses.indexOf(payload.privateKey);
      // Remove Address from walletAddresses and balance array
      commit('removeBalanceFromBalanceOfAddresses', index);
      commit('removeAddressFromWalletAddresses', index);
      // Recalculate balance of active wallet if deleted wallet was the active one
      if (payload.privateKey === this.getters.privateKey) {
        console.log("Enter getBalanceOfActiveWallet");
        dispatch('getBalanceOfActiveWallet', res.privateKey);
      }
      commit('setPrivateKey', res.privateKey);
      commit('setWalletAddress', res.walletAddress);
    } catch (error) {
      console.log('Error in action deleteWallet');
    }
  },

  async switchActiveWallet ({ commit, dispatch }, privateKey) {
    try {
      const res = await this.$axios.$post('/api/switch-wallet', privateKey);
      commit('setPrivateKey', res.privateKey);
      commit('setWalletAddress', res.walletAddress);
      dispatch('getBalanceOfActiveWallet', res.walletAddress);
    } catch (error) {
      
    }
  },

  async registerNodeToNetwork ({ commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$post(payload.registeringNode + '/api/register-and-broadcast-node', payload);
      commit('setError', '');
      dispatch('getNetworkNodes');
      console.log('Response from register-node action: ' + JSON.stringify(res));
    } catch (error) {
      console.log('Error in registerNode action: ' + JSON.stringify(error.message));
      commit('setError', 'Network Node is not responding. Try register with another node!');
    }
  },

  async getNetworkNodes ({ commit }) {
    try {
      const res = await this.$axios.$get('api/network-nodes');
      commit('setNetworNodes', res.networkNodes);
    } catch (error) {
      console.log("Error in getNetworkNodes action: " + error);
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
  },

  error (state) {
    return state.error;
  },

}