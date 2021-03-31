import Vue from 'vue'
import Vuilidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Loader from '@/components/Loader'
import dateFilter from '@/filters/dateFilter'
import currFilter from '@/filters/currFilter'
import localizeFilter from '@/filters/localizeFilter'
import messagePlugin from '@/utils/message.plugin'
import firebase from 'firebase'
import 'materialize-css/dist/js/materialize.min'

Vue.use(messagePlugin)
Vue.use(Vuilidate)
Vue.config.productionTip = false
Vue.filter('date', dateFilter)
Vue.filter('currency', currFilter)
Vue.filter('localize', localizeFilter)
Vue.component('Loader',Loader)
// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyA-kDRm2vifmriSyPCMQ19Teq65-kOwvOE",
  authDomain: "crm-test-2f3d8.firebaseapp.com",
  projectId: "crm-test-2f3d8",
  storageBucket: "crm-test-2f3d8.appspot.com",
  messagingSenderId: "160741336341",
  appId: "1:160741336341:web:a701a488c065e157fdf51c",
  measurementId: "G-KQW5W7L6S9",
  databaseURL: 'https://crm-test-2f3d8-default-rtdb.europe-west1.firebasedatabase.app/'
});
let app;
firebase.auth().onAuthStateChanged(() => {
  if(!app){
    app = new Vue({
      store,
      router,
      render: h => h(App),
    }).$mount('#app')
  }
  
})


