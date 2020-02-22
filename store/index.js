export const state = () => ({
  chain: [],
  isChainValid: true,
  invalidBlockIndex: '',
  pendingTransactions: [],
  networkNodes: [],
  walletAddress: '',
  walletAddresses: [],
  privateKey: '',
  currentNodeUrl: '',
  balance: 0,
  error: '',
  loading: [],
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

  setChain (state, chain) {
    state.chain = chain;
  },

  setChainValidity (state, isValid) {
    state.isChainValid = isValid;    
  },

  setInvalidBlockIndex (state, index) {
    state.invalidBlockIndex = index;
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
  },

  setLoading (state, value) {
    state.loading = value;
  }
}

export const actions = {

  async nuxtServerInit ({ commit, dispatch }, {req}) {
    try {
      console.log("nuxtserverinit START dispatch loadBlockchain");
      await dispatch('loadBlockchain');
      console.log("nuxtserverinit DONE dispatch loadBlockchain");
    } catch (error) {
      console.log('Error dispatch loadBlockchain: ' + error);
    }

    try {
      await dispatch('checkChainValidity');
      
    } catch (error) {
      console.log("Error dispatch checkChainValidity");
    }

    try {
      if (this.getters.networkNodes.length > 0) {
        await dispatch('consensus');
        console.log("Consensus dispatched succesfully");
      }
      
    } catch (error) {
      console.log("Error in nuxtserverinit consensus action");
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

  async consensus ({ commit }) {
    try {
      const res = await this.$axios.$get(this.getters.currentNodeUrl + '/consensus');
      console.log('Consensus action succesfull');
      if (res.newChain !== null) {
        commit("setChain", res.newChain);
        commit("overwritePendingTransactions", res.newPendingTransactions);
      }

    } catch (error) {
      console.log("Error in consensus action");
      return error;
    }
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

  async checkChainValidity ({ commit }) {    
    try {
      const res = await this.$axios.$get(this.getters.currentNodeUrl + '/chain-valid');
      commit("setChainValidity", res.isChainValid);
      commit("setInvalidBlockIndex", res.invalidBlockIndex);
    } catch (error) {
      commit('setChainValidity', false);
      console.log("Error in /chain-valid");
    }
  },

  async createWallet ({ commit }) {
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
      // Set balance of active wallet if deleted wallet was the active one
      if (payload.privateKey === this.getters.privateKey) {
        console.log("Enter getBalanceOfActiveWallet");
        // dispatch('getBalanceOfActiveWallet', res.privateKey);
        commit('writeBalance', res.balance);

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
      commit('writeBalance', res.balance);
    } catch (error) {
      
    }
  },

  async registerNodeToNetwork ({ commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$post(payload.registeringNode + '/api/register-and-broadcast-node', payload);
      commit('setError', '');
      dispatch('getNetworkNodes');
      console.log('Response from register-node action: ', res);
      try {
        await dispatch('consensus');
        console.log('consensus action returned after register');
        
      } catch (error) {
        console.log("Error in dispatch consensus on registerNodeToNetwork");
        
      }

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
  },

  setLoading ({ commit }, value) {
    commit('setLoading', value);
  } 
}

export const getters = {
  chain (state) {
    return state.chain;
  },

  isChainValid (state) {
    return state.isChainValid;
  },

  invalidBlockIndex (state) {
    return state.invalidBlockIndex;
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

  loading (state) {
    return state.loading;
  }

}