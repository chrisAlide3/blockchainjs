<template>
  <v-layout wrap>
    <v-flex xs12 text-truncate>
      <v-card>
        <v-card-title primary-title>
          <h3 class="headline mb-0">ID: {{ transaction.transactionId }}</h3>
          <v-card-text>
            <p @click="showSender=!showSender">Sender: <span :style="{cursor: 'pointer'}">{{ transaction.sender }}</span></p>
            <p @click="showRecipient=!showRecipient">Recipient: <span :style="{cursor: 'pointer'}">{{ transaction.recipient }}</span></p>
            <p>Amount: {{ transaction.amount }}</p>
            <p @click="showSignature=!showSignature">Signature: <span :style="{cursor: 'pointer'}">{{ transaction.signature }}</span></p>
            <!-- Tooltip sender -->
            <v-tooltip v-model="showSender" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>{{ transaction.sender }}</span>
              <v-icon small right @click="copyAction('sender')">file_copy</v-icon>
              <v-icon small right @click="showSender=false">close</v-icon>
            </v-tooltip>
            <!-- Tooltip recipient -->
            <v-tooltip v-model="showRecipient" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>{{ transaction.recipient }}</span>
              <v-icon small right @click="copyAction('recipient')">file_copy</v-icon>
              <v-icon small right @click="showRecipient=false">close</v-icon>
            </v-tooltip>
            <!-- Tooltip signature -->
            <v-tooltip v-model="showSignature" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>{{ transaction.signature }}</span>
              <v-icon small right @click="copyAction('signature')">file_copy</v-icon>
              <v-icon small right @click="showSignature=false">close</v-icon>
            </v-tooltip>
            <!-- Confirm copy -->
            <v-tooltip v-model="showCopy" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>{{ copyField }} address copied to clipboard</span>
              <v-icon small right @click="showCopy=false">close</v-icon>
            </v-tooltip>
            
          </v-card-text>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="orange" @click="copySender" >Copy sender to clipboard</v-btn>
          <v-btn flat color="orange" @click="copyRecipient">Copy recipient to clipboard</v-btn>
        </v-card-actions>
      </v-card>
      <br>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["transaction"],

  data () {
    return {
      // TOOLTIP
      showSender: false,
      showRecipient: false,
      showSignature: false,
      showCopy: false,
      copyField: ''
    }
  },

  methods: {
    copyAction (field) {
      if (field === 'sender') {
        this.$copyText(this.transaction.sender);
        this.showSender = false;
        this.copyField = 'Sender'
        this.showCopy = true;
      }else if (field === 'recipient') {
        this.$copyText(this.transaction.recipient);
        this.showRecipient = false;
        this.copyField = 'Recipient';
        this.showCopy = true;
      }else if (field === 'signature') {
        this.$copyText(this.transaction.signature);
        this.showSignature = false;
        this.copyField = 'Signature';
        this.showCopy = true;
      }
    },
    
    copySender () {
      try {
        this.$copyText(this.transaction.sender);
        alert('Sender copied to clipboard');
      } catch (error) {
        alert('Could not copy sender to clipboard');
      }
    },

    copyRecipient () {
      try {
        this.$copyText(this.transaction.recipient)
        alert('Recipient copied to clipboard');
      } catch (error) {
        alert('Could not copy recipient to clipboard');
      }
    }
  }
}
</script>
