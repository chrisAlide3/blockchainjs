<template>
  <v-layout wrap>
    <v-flex xs12 text-truncate pr-auto>
      <v-card>
        <v-card-title primary-title>
          <div>
            <!-- <span
              class="d-inline-block text-truncate"
              style="max-width: 600px;"
            > -->
              <h3 class="headline mb-0">ID: {{ transaction.transactionId }}</h3>
              <v-card-text>
                <p>Signature: {{ transaction.signature }}</p>
                
                <p>Sender: {{ transaction.sender }}...</p>
                <p>Recipient: {{ transaction.recipient }}</p>
                <p>Amount: {{ transaction.amount }}</p>
                <p>Signature: {{ transaction.signature }}</p>
              </v-card-text>
            <!-- </span> -->
          </div>
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

  methods: {
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
