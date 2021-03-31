<template>
  <div>
  <div class="page-title">
    <h3>{{'Category' | localize}}</h3>
  </div>
  <section>
    <Loader v-if="isLoading"/>
    <div class="row" v-else>
      <CategoryCreate @created="addNewCategory" />
      <p class="center" v-if="!categories.length">{{'no categories yet' | localize}}</p>
      <CategoryEditing
        :categories="categories"
        :key="categories.length + updateCount"
        @updated="updateCategories"
        v-else
        
      />
      
    </div>
  </section>
</div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEditing from '@/components/CategoryEditing'

export default {
  name: 'categories',
  data: () => ({
    categories: [],
    isLoading: true,
    updateCount: 0
  }),
  components: {
    CategoryCreate,
    CategoryEditing
    
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.isLoading = false
    
  },
  methods: {
    addNewCategory(category){
      this.categories.push(category)
    },
    updateCategories(category){
      const idx = this.categories.findIndex(c => c.id === category.id)
      this.categories[idx].name = category.name
      this.categories[idx].limit = category.limit
      this.updateCount++
    }
  },
}
</script>