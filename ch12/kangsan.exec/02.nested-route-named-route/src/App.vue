<template>
<div>
  <div class="header">
    <h1 class="headerText">(주)OpenSG</h1>
    <nav>
      <ul>
        <li>
          <!-- 메뉴로 이동할 수 있는 hyperlink 생성 -->
          <router-link :to="{ name:'home'}">Home</router-link>
        </li>
        <li>
          <router-link :to="{ name:'about'}">About</router-link>
        </li>
        <li>
          <router-link :to="{ name:'contacts'}">Contacts</router-link>
        </li>
      </ul>
    </nav>
  </div>

  <div class="container">
    <router-view></router-view>
  </div>
</div>
</template>
<script>
import Home from './components/Home.vue';
import About from './components/About.vue';
import Contacts from './components/Contacts.vue';
import ContactByNo from './components/ContactByNo.vue'
import VueRouter from 'vue-router';

// router 객체 생성
const router = new VueRouter({
  routes : [
    { path:'/', component: Home },
    { path:'/home', name:'home' ,component: Home },
    { path:'/about', name:'about' ,component: About },
    { path:'/contacts', name:'contacts' ,component: Contacts, 
    children : [
      { path : ":no", name:'contactbyno' ,component: ContactByNo }
    ] },
  ]
})
export default {
  name : 'app',
  router
}
</script>
<style>
@import url("https://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.css");
.header { background-color:aqua; padding: 10px 0px 0px 0px; }
.headerText { padding: 0px 20px 0px 20px; } 
ul { list-style-type: none; margin: 0; padding: 0;
    overflow: hidden; background-color: purple;  }
li { float: left; }
li a { display: block; color: yellow; text-align: center;
    padding: 14px 16px; text-decoration: none;  }
li a:hover { background-color: aqua; color:black; }
</style>