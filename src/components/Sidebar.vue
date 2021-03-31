<template>
  <ul class="sidenav app-sidenav" :class="{open: value}">
      <router-link 
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      exact>
        <a href="#" class="waves-effect waves-orange pointer">{{link.title}}</a>
      </router-link>
      
    </ul>
</template>

<script>
import localizeFilter from '@/filters/localizeFilter'
export default {
  props: ['value'],
  data: () => ({
    links: [
      {title: localizeFilter('Bill'), url: '/',},
      {title: localizeFilter('History'), url: '/history',},
      {title: localizeFilter('Plan'), url: '/planning',},
      {title: localizeFilter('Record'), url: '/record',},
      {title: localizeFilter('Category'), url: '/categories',},
    ]
  })
}
</script>