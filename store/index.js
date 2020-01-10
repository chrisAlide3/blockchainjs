export const state = () => ({
  chain: [],
  pendingTransactions: [],
  networkNodes: [],
  walletAddress: '',
  currentNodeUrl: '',
  balance: 0
})

export const mutations = {
  LOAD_BLOCKCHAIN (state, blockchain) {
    state.chain = blockchain.chain;
    state.pendingTransactions = blockchain.pendingTransactions,
    state.networkNodes = blockchain.networkNodes,
    state.walletAddress = blockchain.walletAddress,
    state.currentNodeUrl = blockchain.currentNodeUrl
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
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, {req}) {
    await dispatch('loadBlockchain');
    await dispatch('getBalance');
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

  async getBalance ({ commit }) {
    const address = this.getters.walletAddress;
    const res = await this.$axios.$get('/api/address/' + address)
    commit('writeBalance', res.balance);
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

  currentNodeUrl (state) {
    return state.currentNodeUrl;
  },

  balance (state) {
    return state.balance;
  }

}