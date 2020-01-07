export const state = () => ({
  chain: [],
  pendingTransactions: [],
  networkNodes: [],
  walletAddress: ''
})

export const mutations = {
  LOAD_BLOCKCHAIN (state, blockchain) {
    state.chain = blockchain.chain;
    state.pendingTransactions = blockchain.pendingTransactions,
    state.networkNodes = blockchain.networkNodes,
    state.walletAddress = blockchain.walletAddress
  },

  addTransactionToPendingTransactions (state, transaction) {
    state.pendingTransactions.push(transaction);
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, {req}) {
    await dispatch('loadBlockchain');
  },

  async loadBlockchain ({ commit }) {
    const blockchain = await this.$axios.$get('/api/blockchain');
    commit('LOAD_BLOCKCHAIN', blockchain);
  },

  async addTransaction ({ commit }, transaction) {
    const response = await this.$axios.$post('/api/transaction/broadcast', transaction);
    console.log("addtransaction response: " + JSON.stringify(response));
    commit('addTransactionToPendingTransactions', response.newTransaction);
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

}