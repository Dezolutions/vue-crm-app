<template>
<div>
  <div class="page-title">
    <h3>{{'History of records' | localize}}</h3>
  </div>

  <div class="history-chart">
    <canvas ref="canvas"></canvas>
  </div>
  <Loader v-if="isLoading"/>
  <p class="center" v-else-if="!records.length">{{'no records yet' | localize}} <router-link to="/record" >{{'add a record' | localize}}</router-link> </p>
  <section v-else>
    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>{{'Summ' | localize}}</th>
        <th>{{'Date' | localize}}</th>
        <th>{{'Category' | localize}}</th>
        <th>{{'Type' | localize}}</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(rec,idx) in records" :key="rec.date">
        <td>{{idx +1}}</td>
        <td>{{rec.amount | currency('UAH')}}</td>
        <td>{{rec.date | date('datetime')}}</td>
        <td>{{rec.categoryName}}</td>
        <td>
          <span 
            class="white-text badge"
            :class="rec.typeClass"
          >{{rec.typeText}}</span>
        </td>
      </tr>
      </tbody>
    </table>
    
  </section>
</div>
</template>

<script>
import {Pie} from 'vue-chartjs'
import localizeFilter from '@/filters/localizeFilter'
export default {
  name: 'history',
  extends: Pie,
  data: () => ({
    records: [],
    isLoading: true
  }),
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')
    
    this.records = records.map(record => {
      return {
        ...record,
        categoryName: categories.find(c => c.id === record.id).name,
        typeClass: record.type === 'income'? 'green': 'red',
        typeText: record.type === 'income'? localizeFilter('Income'): localizeFilter('Outcome'),
      }
    })

    this.renderChart({
        labels: categories.map(c => c.name),
        datasets: [{
            label: '# of Votes',
            data: categories.map(c => {
              return this.records.reduce((total,record) => {
                if(record.id === c.id){
                  total += +record.amount
                }
                return total
              },0)
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
      })
    this.isLoading = false
  }
}
</script>