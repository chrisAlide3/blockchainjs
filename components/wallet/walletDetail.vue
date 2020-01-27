<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs1>
        <v-checkbox
          v-model="checkbox"
          color="red"
          class="shrink mr-2"
        >
        </v-checkbox>
      </v-flex>
      <v-flex xs9 pr-2>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'visibility' : 'visibility_off'"
          :type="show1 ? 'text' : 'password'"
          label="Private Key"
          readonly
          @click:append="show1 = !show1"
        >
        </v-text-field>
        <!-- Tooltip for Copy message -->
        <v-layout justify-end>
          <v-flex xs1>
            <v-tooltip v-model="showPrivateKeyCopyMessage" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>Private Key copied to clipboard</span>
              <v-icon small right @click="showPrivateKeyCopyMessage=false">close</v-icon>
            </v-tooltip>
          </v-flex>
        </v-layout>
        
      </v-flex>

      <v-flex xs1 pt-4 grow>
        <v-icon small @click="copyPrivateKey">mdi-content-copy</v-icon>
        <v-icon small @click="showQrcode('privateKey')">mdi-barcode</v-icon>
      </v-flex>

      <v-flex xs1>
        <v-text-field
          label="Balance"
          readonly
          reverse
          :value="privateKeyObj.balance"
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    
    <v-layout row wrap justify-center>
      <v-flex xs9 pr-4>
        <v-textarea
          label="Public Key"
          readonly
          rows=1
          auto-grow
          outline
          :background-color="privateKeyObj.privateKey === activePrivateKey ? 'green' : ''"
          :value="getPublicKey(privateKeyObj.privateKey)"
        ></v-textarea>

        <!-- Tooltip for Copy message -->
        <v-layout justify-end>
          <v-flex xs1>
            <v-tooltip v-model="showWalletCopyMessage" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>Wallet address copied to clipboard</span>
              <v-icon small right @click="showWalletCopyMessage=false">close</v-icon>
            </v-tooltip>
          </v-flex>
        </v-layout>

      </v-flex>

      <v-flex xs1 pt-4>
        <v-icon small @click="copyWalletAddress">mdi-content-copy</v-icon>
        <v-icon small @click="showQrcode('WalletAddress')">mdi-barcode</v-icon>
      </v-flex>

    </v-layout>

    <!-- QR-Code dialog -->
    <div class="text-xs-center">
      <v-dialog
        v-model="qrcodeDialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline orange justify-center"
            primary-title
          >
            {{ qrcodeTitle }}
          </v-card-title>

          <v-card-text class="text-xs-center" >
            <qrcode-vue :value="qrcodeValue" :size="300" level="H"></qrcode-vue>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="hidden-print-only">
            <v-spacer></v-spacer>
            <v-btn
              color="orange"
              flat
              @click="printQrcode"
            >
              Print
            </v-btn>
            <v-btn
              color="primary"
              flat
              @click="qrcodeDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue,
  },

  props: {
    privateKeyObj: { // privateKey, balance
      type: Object,
      required: true
    }
  },

  data () {
    return {
      checkbox: false,
      show1: false,
      password: this.privateKeyObj.privateKey,
      showPrivateKey: false,
      showPrivateKeyCopyMessage: false,
      showWalletCopyMessage: false,
      qrcodeDialog: false,
      qrcodeTitle: '',
      qrcodeValue: '',
    }
  },

  watch: {
    checkbox: function(val) {      
      const type = val === true ?'add' :'remove';
      const data = {
        privateKey: this.privateKeyObj.privateKey,
        type: type
      };

      this.$emit('changeSelection', data)
    }
  },

  computed: {
    activePrivateKey () {      
      return this.$store.getters.privateKey
    },
  },

  methods: {
    getPublicKey (privateKey) {
      const keys = ec.keyFromPrivate(privateKey);
      return keys.getPublic('hex');
    },

    copyPrivateKey () {
      try {
        this.$copyText(this.privateKeyObj.privateKey);
        this.showPrivateKeyCopyMessage = true;
        setTimeout(() => {
          this.showPrivateKeyCopyMessage = false
        }, 3000);
      } catch (error) {
        alert('Could not copy sender to clipboard');
      }
    },

    copyWalletAddress () {
      try {
        this.$copyText(this.getPublicKey(this.privateKeyObj.privateKey));
        this.showWalletCopyMessage = true;
        setTimeout(() => {
          this.showWalletCopyMessage = false
        }, 3000);
      } catch (error) {
        alert('Could not copy sender to clipboard');
      }
    },

    showQrcode (field) {
      if (field === 'privateKey') {
        this.qrcodeTitle = 'QR-Code for Private Key'
        this.qrcodeValue = this.privateKeyObj.privateKey;
        this.qrcodeDialog = true;
      }else {
        this.qrcodeTitle = 'QR-Code for Wallet Address'
        this.qrcodeValue = this.getPublicKey(this.privateKeyObj.privateKey);
        this.qrcodeDialog = true;
      }
    },

    printQrcode () {
      window.print();
    }
  }
}
</script>
