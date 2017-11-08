// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import About from './components/About.vue'
import ContactList from './components/ContactList.vue'
import ContactForm from './components/ContactForm.vue'
import UpdatePhoto from './components/UpdatePhoto.vue'

Vue.use(VueRouter);
Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes : [
    { path: '/', redirect: '/home' },
    // named route 사용. navigation 에서 활용
    { path: '/home', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
    { path: '/contacts', name: 'contacts', component: ContactList, children: [
      { path: 'add', name: 'addcontact', component: ContactForm },
      // url param 을 각 컴포넌트 안에서 props 로 사용가능.
      { path: 'update/:no', name: 'updatecontact', component: ContactForm, props: true },
      { path: 'photo/:no', name: 'updatephoto', component: UpdatePhoto, props: true },
    ]},
  ]
})

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})
