<template >
  

<div>
  <div class="page-title">
    <h3>{{'Bill' | localize}}</h3>

    <button 
    @click.prevent="refresh"
    class="btn waves-effect waves-light btn-small">
      <i class="material-icons">refresh</i>
    </button>
  </div>
  <Loader v-if="isLoading"/>
  <div class="row" v-else>
    <HomeBill
      :rates ="currency.rates"
    />
    <HomeCurrency
      :rates ="currency.rates"
      :date ="currency.date"
    />
  </div>
</div>
</template>
<script>

import HomeBill from '@/components/HomeBill'
import HomeCurrency from '@/components/HomeCurrency'
export default {
  name: 'home',
  data: () => ({
    isLoading: true,
    currency: null
  }),
  async mounted() {
    this.currency = await this.$store.dispatch('fetchCurrency')
    this.isLoading = false
  },
  components: {
    HomeBill,
    HomeCurrency
  },
  methods: {
    async refresh(){
      this.isLoading = true
      this.currency = await this.$store.dispatch('fetchCurrency')
      this.isLoading = false

    }
  },
}
</script>
