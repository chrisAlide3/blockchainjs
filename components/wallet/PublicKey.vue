<template>
  <div>
    <v-layout row wrap justify-center>
      <v-flex xs11 pr-4>
        <v-textarea
          label="Public Key"
          readonly
          rows=1
          auto-grow
          outline
          :value="publicKey"
        ></v-textarea>

        <!-- Tooltip for Copy message -->
        <v-layout justify-end>
          <v-flex xs1>
            <v-tooltip v-model="showCopyMessage" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>Wallet address copied to clipboard</span>
              <v-icon small right @click="showCopyMessage=false">close</v-icon>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs1 pt-4>
        <v-icon small @click="copyPublicKey">mdi-content-copy</v-icon>
        <v-icon small @click="qrcodeDialog = true">mdi-barcode</v-icon>
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
            QR-Code for Public-Key
          </v-card-title>

          <v-card-text class="text-xs-center" >
            <qrcode-vue :value="publicKey" :size="300" level="H"></qrcode-vue>
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
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue,
  },

  props: {
    publicKey: {
      type: String,
      required: true
    },
  },

  data () {
    return {
      showCopyMessage: false,
      qrcodeDialog: false,
    }
  },

  methods: {
    copyPublicKey () {
      try {
        this.$copyText(this.publicKey);
        this.showCopyMessage = true;
        setTimeout(() => {
          this.showCopyMessage = false
        }, 3000);
      } catch (error) {
        alert('Could not copy key to clipboard');
      }
    },

    printQrcode () {
      window.print();
    }
  }
}
</script>
