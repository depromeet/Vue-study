<template>
  <div>
    <p class="addnew">
        <router-link class="btn btn-primary" :to="{name: 'addcontact'}">새로운 연락처 추가하기</router-link>
    </p>
    <div id="example">
        <table id="list" class="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th>이름</th><th>전화번호</th><th>주소</th><th>사진</th><th>편집/삭제</th>
                </tr>
            </thead>
            <tbody id="contacts">
                <tr v-for="contact in contactlist.contacts" :key="contact.id">
                    <td>{{contact.name}}</td>
                    <td>{{contact.tel}}</td>
                    <td>{{contact.address}}</td>
                    <td><img class="thumbnail" :src="contact.photo" @click="editPhoto(contact.no)" /></td>
                    <td>
                        <button class="btn btn-primary" @click="editContact(contact.no)">편집</button>
                        <button class="btn btn-primary" @click="deleteContact(contact.no)">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <paginate ref="pagebuttons"
        :page-count="totalpage"
        :page-range="7"
        :margin-pages="3"
        :click-handler="pageChanged"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'">
        </paginate>
        <router-view></router-view>
  </div>
</template>

<script>
import Constant from '../constant';
import { mapState } from 'vuex';
import Paginate from 'vuejs-paginate';
import _ from 'lodash';

export default {
    name : 'contactList',
    components : { Paginate },
    computed : _.extend(
        {
            totalpage() {
                const totalcount = this.contactlist.totalcount;
                const pagesize = this.contactlist.pagesize;
                return Math.floor((totalcount - 1) / pagesize) + 1;
            }
        },
        mapState([ 'contactlist' ])
    ),
    mounted() {
        let page = 1;
        if (this.$route.query && this.$route.query.page) {
            page = parseInt(this.$route.query.page);
        }
        this.$store.dispatch(Constant.FETCH_CONTACTS, { pageno: page });
        this.$refs.pagebuttons.selected = page-1;
    },
    watch : {
        // contact lisg 컴포넌트가 한번 만들어진 후 route 경로가 바뀌었을 떄 
        //컴포넌트를 새로 마운트 하지 않으므로 가존 컴포넌트의 값에서 변경할 수 있게 watch 속성 필요
        // navigation guard 사용해도 된다 (beforeRouteUpdate)
        '$route' : function(to, from) {
            if (to.query.page && to.query.page != this.contactlist.pageno) {
                const page = to.query.page;
                this.$store.dispatch(Constant.FETCH_CONTACTS, { pageno: page });
                this.$refs.pagebuttons.selected = page-1;
            }
        }
    },
    methods : {
        pageChanged(page) {
            this.$router.push({ name: 'contacts', query: { page }})
        },
        editContact(no) {
            this.$router.push({ name: 'updatecontact', params : { no }})
        },
        deleteContact(no) {
            if (confirm('정말로 삭제하시겠습니까?') == true) {
                this.$store.dispatch(Constant.DELETE_CONTACT, { no });
                this.$router.push({ name: 'contacts' })
            }
        },
        editPhoto(no) {
            this.$router.push({ name: 'updatephoto', params: { no } })
        }
    }
}
</script>

<style scoped>
.addnew { margin:10px auto; max-width: 820px;  min-width: 820px;
    padding:40px 0px 0px 0px; text-align: left; }
#example { margin:10px auto; max-width: 820px; min-width: 820px;
    padding:0px; position:relative; font: 13px "verdana"; }
#example .long{ width: 100%; }
#example .short{ width: 50%; }
#example input, textarea, select{ box-sizing: border-box;
    border:1px solid #BEBEBE; padding: 7px; margin:0px;
    outline: none;  }
#list  { width: 800px; font: 13px "verdana";  }
#list thead tr { color:yellow; background-color: purple; }
#list th:nth-child(5n+1), #list td:nth-child(5n+1) { width:200px; }
#list th:nth-child(5n+2), #list td:nth-child(5n+2) { width:150px; }
#list th:nth-child(5n+3), #list td:nth-child(5n+3) { width:250px; }
#list th:nth-child(5n+4), #list td:nth-child(5n+4) { width:60px; }
#list th:nth-child(5n), #list td:nth-child(5n) { width:150px; }
#list th { padding:10px 5px 10px 5px; }
#list tr { border-bottom: solid 1px black; }
#list td, #list th {  text-align:center; vertical-align:middle; }
img.thumbnail { width:48px; height: 48px; margin-top: auto; 
    margin-bottom: auto; display: block; cursor:pointer; }
</style>

