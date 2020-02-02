export const state = () => ({
  chain: [],
  pendingTransactions: [],
  networkNodes: [],
  walletAddress: '',
  walletAddresses: [],
  privateKey: '',
  currentNodeUrl: '',
  balance: 0,
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
      const response = await this.$axios.$post(this.getters.currentNodeUrl + '/transaction/broadcast', transaction);
      console.log("Response from addTransaction: ", response);
      // if (response.newTransaction === undefined) {
      //   throw new Error('Insufficient balance')
      // }
      commit('addTransactionToPendingTransactions', response.newTransaction);
      dispatch('calculateNewBalance', transaction);
      commit('setError', '');
    } catch (error) {
        if (error.response) {
          commit('setError', error.response.data);
        }else if (error.request) {
          console.log(error.request);
        }else {
          console.log('error', error.message);
        }
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
      const res = await this.$axios.$get(this.getters.currentNodeUrl + '/address/' + walletAddress);    
      if (walletAddress === this.getters.walletAddress) {
        commit('writeBalance', res.balance);  
      }
    } catch (error) {
      console.log("Error getting balance: " + error);
    }  
  },

  // async getBalanceOfActiveWallet ({ commit }, walletAddress) {
  //   try {
  //     // const address = this.getters.walletAddress;
  //     const res = await this.$axios.$get(this.getters.currentNodeUrl + '/address/' + walletAddress);
  //     commit('writeBalance', res.balance);  
  //   } catch (error) {
  //     console.log("Error getting balance: " + error);
  //   }
    
  // },

  async mineBlock ({ commit, dispatch }) {
    try {
      const res = await this.$axios.$get(this.getters.currentNodeUrl + '/mine');
      console.log("New block from mining: " + JSON.stringify(res.block));
      console.log("Reward transaction from mining: " + JSON.stringify(res.miningReward))
      commit('setError', '');
      commit('addBlockToChain', res.block);
      commit('clearPendingTransactions');
      if (res.miningReward !== null) {
        commit('addTransactionToPendingTransactions', res.miningReward)
        dispatch('calculateNewBalance', res.miningReward);  
      }

    } catch (error) {
        if (error.response) {
          commit('setError', error.response.data);
        }else if (error.request) {
          console.log(error.request);
        }else {
          console.log('Error', error.message);
        }
    }
    
  },

  async createWallet ({ commit }) {
    console.log('enter store createWallet');
    console.log("axiosBaseUrl in store: ", this.$axios.defaults.baseURL);    
    try {
      const res = await this.$axios.$get(this.getters.currentNodeUrl + '/create-wallet');
      commit('setPrivateKey', res.privateKey);
      commit('setWalletAddress', res.walletAddress);
      commit('setWalletAddresses', res.walletAddresses);
    } catch (error) {
      console.log('Error in action createWallet');
    }
  },

  async deleteWallet ({ commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$post(this.getters.currentNodeUrl + '/delete-wallet', payload);
      const index = this.getters.walletAddresses.indexOf(payload.privateKey);
      commit('removeAddressFromWalletAddresses', index);
      // Recalculate balance of active wallet if deleted wallet was the active one
      if (payload.privateKey === this.getters.privateKey) {
        console.log("Enter getBalanceOfActiveWallet");
        // dispatch('getBalanceOfActiveWallet', res.privateKey);
        dispatch('getBalancebyAddress', res.privateKey);

      }
      commit('setPrivateKey', res.privateKey);
      commit('setWalletAddress', res.walletAddress);
      commit('setError', '');
    } catch (error) {
      if (error.response) {
        commit('setError', error.response.data);
      }else if (error.request) {
        console.log(error.request);
      }else {
        console.log('Error', error.message);
      }
    }
  },

  async switchActiveWallet ({ commit, dispatch }, privateKey) {
    try {
      const res = await this.$axios.$post(this.getters.currentNodeUrl + '/switch-wallet', privateKey);
      commit('setPrivateKey', res.privateKey);
      commit('setWalletAddress', res.walletAddress);
      console.log("Balance of res switchWallet", res.balance);
      
      commit('writeBalance', res.balance);
      // dispatch('getBalancebyAddress', res.walletAddress);
      // dispatch('getBalanceOfActiveWallet', res.walletAddress);
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
      const res = await this.$axios.$get(this.getters.currentNodeUrl + '/network-nodes');
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

  error (state) {
    return state.error;
  },

}