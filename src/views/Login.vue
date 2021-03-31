<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
  <div class="card-content">
    <span class="card-title">{{'Home bookkeeping' | localize}}</span>
    <div class="input-field">
      <input
          id="email"
          type="text"
          
          v-model.trim="email"
          :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
      >
      <label for="email">Email</label>
      <small class="helper-text invalid"
      v-if="$v.email.$dirty && !$v.email.required">{{'The email field must not be empty' | localize}}</small>
      <small class="helper-text invalid"
      v-else-if="$v.email.$dirty && !$v.email.email">{{'Enter a correct email' | localize}}</small>
    </div>
    <div class="input-field">
      <input
          id="password"
          type="password"
          v-model.trim="password"
          :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
      >
      <label for="password">{{'Password' | localize}}</label>
      <small class="helper-text invalid"
      v-if="$v.password.$dirty && !$v.password.required">{{'Enter a password' | localize}}</small>
      <small class="helper-text invalid"
      v-else-if="$v.password.$dirty && !$v.password.minLength">{{'Too short a password' | localize}}</small>
    </div>
  </div>
  <div class="card-action">
    <div>
      <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
      >
        {{'Come in' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </div>

    <p class="center">
      {{'dont have an account?' | localize}}
      <router-link to="/register">{{'Register' | localize}}</router-link>
    </p>
  </div>
</form>
</template>

<script>
import {email,required, minLength} from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localizeFilter'
export default {
  name: 'login',
  data: () => ({
    email: '',
    password: ''
  }),
  validations: {
    email: {email,required},
    password: {required,minLength: minLength(5)}

  },
  mounted() {
    if(this.$route.query.message)
    this.$message(localizeFilter('You are logged out'))
  },
  methods: {
    async submitHandler(){
      if(this.$v.$invalid){
        this.$v.$touch()
        return
      }
      const formData = {
          email: this.email,
          password: this.password,
        }

      try {
        await this.$store.dispatch('login',formData)
        this.$router.push('/')

      }
      catch(e){
        throw e
      }
      
    }
  },
}
</script>