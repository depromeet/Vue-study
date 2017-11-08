<template>
  <div id="container">
    <div class="page-header">
      <h1 class="text-center">연락처 관리 Application</h1>
      <p>(vue-router + Vuex + Axios)</p>
      <div class="btn-group">
        <router-link to="/home" class="btn btn-info menu">Home</router-link>
        <router-link to="/about" class="btn btn-info menu">About</router-link>
        <router-link to="/contacts" class="btn btn-info menu">Contacts</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
// import ContactList from './components/ContactList';
// import ContactForm from './components/ContactForm';
// import UpdatePhoto from './components/UpdatePhoto';

// import CONF from './config';
// import Constant from './constant';
// import Paginate from 'vuejs-paginate';
// import _ from 'lodash';
// import { mapState } from 'vuex';

// export default {
//   name: 'app',
//   components : { ContactList, ContactForm, UpdatePhoto, Paginate },
//   computed : _.extend({
//     totalpage() {
//       const totalcount = this.contactlist.totalcount;
//       const pagesize = this.contactlist.pagesize;
//       return Math.floor((totalcount -1) / pagesize) + 1;
//     }
//   },
//    mapState([ 'contactlist', 'currentView' ])
//   ),
//   mounted() {
//     this.$store.dispatch(Constant.FETCH_CONTACTS);
//   },
//   methods : {
//     pageChanged(page) {
//       this.$store.dispatch(Constant.FETCH_CONTACTS, { pageno: page})
//     }
//   }
// }
export default {
  name : 'app'
};
</script>

<style scoped>
@import url("https://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.css");

#container {
  font-family: 'Avenir', Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.menu {
  width: 100px;
}
</style>
