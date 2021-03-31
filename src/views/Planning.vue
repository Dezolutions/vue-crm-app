<template>

<div>
  <div class="page-title">
    <h3>{{'Plan' | localize}}</h3>
    <h4>{{info.bill | currency('UAH')}}</h4>
  </div>
  <Loader v-if="isLoading"/>
  <p class="center" v-else-if="!categories.length">{{'no categories yet' | localize}} <router-link to="/categories">{{'add a category' | localize}}</router-link></p>
  <section v-else>
    <div v-for="cat in categories" :key="cat.id">
      <p>
        <strong>{{cat.name}}:</strong>
        {{cat.spend | currency}} из {{cat.limit | currency}}
      </p>
      <div class="progress" >
        <div
            class="determinate"
            :class="cat.progressColor"
            :style="{width: cat.progressPercent + '%'}"
        ></div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'planning',
  data: () => ({
    isLoading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')
    this.isLoading = false

    this.categories = categories.map(cat => {
      const spend = records
        .filter(r => r.id === cat.id)
        .filter(r => r.type === "outcome")
        .reduce((total,record) => {
          return total += +record.amount
        },0)

      const percent = 100 * spend / cat.limit
      const progressPercent = percent > 100 ? 100: percent
      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red'
      return {
        ...cat,
        progressPercent,
        progressColor,
        spend
      }
    })
    
    
  },
}
</script>