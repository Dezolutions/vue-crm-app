<template>

<div>
  <div class="page-title">
    <h3>{{'Record' | localize}}</h3>
  </div>
  <Loader  v-if="isLoading" />
  <p class="center" v-else-if="!categories.length">{{'no categories yet' | localize}} <router-link to="/categories">{{'add a category' | localize}}</router-link></p>
  <form class="form" v-else  @submit.prevent="submitHandler">
    <div class="input-field" >
      <select ref="select" v-model="category">
        <option
        v-for="c in categories"
        :key="c.id"
        :value="c.id"
        >{{c.name}}</option>
      </select>
      <label>{{'Select a category' | localize}}</label>
    </div>

    <p>
      <label>
        <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
        />
        <span>{{'Income' | localize}}</span>
      </label>
    </p>

    <p>
      <label>
        <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
        />
        <span>{{'Outcome' | localize}}</span>
      </label>
    </p>

    <div class="input-field">
      <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{invalid: ($v.amount.$dirty && !$v.amount.minValue)}"
      >
      <label for="amount">{{'Summ' | localize}}</label>
      <span class="helper-text invalid"
        v-if="$v.amount.$dirty && !$v.amount.minValue"
      >{{'Minimal value' | localize}} {{$v.amount.$params.minValue.min}}
      </span>     
    </div>

    <div class="input-field">
      <input
          id="description"
          type="text"
          v-model="description"
          :class="{invalid: ($v.description.$dirty && !$v.description.required)}"
          
      >
      <label for="description">{{'Description' | localize}}</label>
      <span class="helper-text invalid"
        v-if="$v.description.$dirty && !$v.description.required"
      >{{'Enter a description' | localize}}</span>
    </div>

    <button class="btn waves-effect waves-light" type="submit">
      {{'Create' | localize}}
      <i class="material-icons right">send</i>
    </button>
  </form>
</div>

</template>

<script>
import {required,minValue} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'
import localizeFilter from '@/filters/localizeFilter'
export default {
  name: 'record',
  data: () => ({
    isLoading: true,
    categories: [],
    select: null,
    type: 'outcome',
    amount: 1,
    description: '',
    category: null
  }),
  validations: {
    amount: {minValue: minValue(1)},
    description: {required}
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord(){
      if(this.type === 'income'){
        return true
      }
      return this.info.bill >= this.amount
    }
  },
  methods: {
    async submitHandler(){
      if(this.$v.$invalid){
        this.$v.$touch()
        return
      }

      if(this.canCreateRecord){
        try {
          await this.$store.dispatch('createRecord',{
            id: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          })
          const bill = this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount
          await this.$store.dispatch('updateInfo',{bill})  
          this.$message(localizeFilter('Record has been successfully created!'))
          this.$v.reset()
          this.amount = 1
          this.description = ''

        } catch (e) {}
        
      } else{
        this.$message(`Недостаточно средств на счете,нужно еще ${this.amount - this.info.bill}`)
      }
    }
  },
  
  async mounted() {
    
    this.categories = await this.$store.dispatch('fetchCategories')
    this.isLoading = false

    if(this.categories.length){
      this.category = this.categories[0].id
    }
    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select)
      window.M.updateTextFields()
    },0)
    
  }
}
</script>