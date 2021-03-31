<template>
  <div class="col s12 m6">
    
    
        <div>
          
          <div class="page-subtitle">
            <h4>{{'Edit' | localize}}</h4>
          </div>
          
          <form  @submit.prevent="submitHandler">
            <div class="input-field" >
              <select ref="select" v-model="current">
                <option 
                v-for="category in categories" 
                :key="category.id"
                :value="category.id"
                >{{category.name}}</option>
              </select>
              <label>{{'Select a category' | localize}}</label>
            </div>

            <div class="input-field">
              <input
                  id="name"
                  type="text"
                  v-model="name"
                  :class="{invalid: $v.name.$dirty && !$v.name.required}"
              >
              <label for="name">{{'Title' | localize}}</label>
              <span class="helper-text invalid"
              v-if="$v.name.$dirty && !$v.name.required"
              >{{'Enter a title' | localize}}</span>
            </div>

            <div class="input-field">
              <input
                  id="limit"
                  type="number"
                  v-model="limit"
                  :class="{invalid: ($v.limit.$dirty && !$v.limit.minValue)}"
              >
              <label for="limit">{{'Limit' | localize}}</label>
              <span class="helper-text invalid"
              v-if="$v.limit.$dirty && !$v.limit.minValue"
              >{{'Minimal value' | localize}} {{$v.limit.$params.minValue.min}}</span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
              {{'Update' | localize}}
              <i class="material-icons right">send</i>
            </button>
          </form>
        </div>
      </div>
</template>

<script>
import {required,minValue} from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localizeFilter'
export default {
  props: ['categories'],
  data: () => ({
    select: null,
    name: '',
    limit: 1,
    current: null,
    isLoading: true
  }),
  validations: {
    name: {required},
    limit: { minValue: minValue(1)},
  },
  methods: {
    async submitHandler(){
      if(this.$v.$invalid){
        this.$v.$touch()
        return
      }
      try {
        const updateData = {
          id: this.current,
          name: this.name,
          limit: this.limit
        }
        await this.$store.dispatch('updateCategory',updateData)
        this.$message(localizeFilter('Category has been successfully updated!'))
        this.$emit('updated', updateData)
        
      } catch (error) {}
    }
  },
  watch: {
    current(catId){
      const {name,limit } = this.categories.find(c => c.id === catId)
      this.name = name
      this.limit = limit
    }
  },
  created() {
    const {id,name,limit} = this.categories[0]
    console.log(id)
    this.current = id
    this.name = name
    this.limit = limit
  },
  mounted() {
    window.M.updateTextFields()
    this.select = window.M.FormSelect.init(this.$refs.select)
  },
  destroyed() {
    if(this.select && this.select.destroy){
      this.select.destroy()
    }
  },
}
</script>