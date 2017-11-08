<template>
    <div class="modal">
        <div class="form" @keyup.esc="cancelEvent">
            <h3 class="heading">:: {{headingText}}</h3>
            <div v-if="mode=='update'" class="form-group">
                <label>일련번호</label>
                <input type="text" name="no" class="long" v-model="contact.no" />
            </div>
            <div class="form-group">
                <label>이름</label>
                <input type="text" name="name" class="long" v-model="contact.name" ref="name" placeholder="이름이 뭐에요"/>
            </div>
            <div class="form-group">
                <label>전화번호</label>
                <input type="text" name="tel" class="long" v-model="contact.tel" placeholder="전화번호 뭐에요"/>
            </div>
            <div class="form-group">
                <label>주 소</label>
                <input type="text" name="address" class="long" v-model="contact.address" placeholder="주소가 뭐에요"/>
            </div>
            <div class="form-group">
                <label>&nbsp;</label>
                <input type="button" class="btn btn-primary" :value="btnText" @click="submitEvent()">
                <input type="button" class="btn btn-primary" value="취 소" @click="cancelEvent()">
            </div>
        </div>
    </div>
</template>

<script>

import Constant from '../constant';
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  name : "contactForm",
  data(){
      // 기본값은 add. mounted event hook 에서 route 보고 mode 설정
      return { mode:"add"}
  },
  // props 를 이용하여 param에 있는 no 를 전달받음. (main.js 에서 route 객체에 ropr:true 되어있음)
  props : [ 'no' ],
  computed : _.extend(
    {
      btnText() {
          if(this.mode != 'update') return '추 가';
          else return '수 정';
      },
      headingText() {
          if (this.mode != 'update') return '새로운 연락처 추가';
          else return '연락처 변경';
      }
    },
    mapState(['contact', 'contactlist'])
  ),
  mounted() {
      this.$refs.name.focus();
      const cr = this.$router.currentRoute;
      // '/add' 와 일치하는 문자열이 있는 경우
      if (cr.fullPath.indexOf('/add') > -1) {
          this.mode = "add";
          this.$store.dispatch(Constant.INITIALIZE_CONTACT_ONE);
      // '/update' 와 일치하는 문자열이 있는 경우
      } else if (cr.fullPath.indexOf('/update') > -1) {
          this.mode = 'update';
          this.$store.dispatch(Constant.FETCH_CONTACT_ONE, { no: this.no });
      }
  },
  methods : {
      // submit 이나 cancel 후에는 다시 contacts 가 있는 화면으로 돌아가기.
      submitEvent() {
          if(this.mode == "update") {
              this.$store.dispatch(Constant.UPDATE_CONTACT);
              this.$router.push({ name: 'contacts', query: { page: this.contactlist.pageno }});
          } else {
              // add mode 일 때
              this.$store.dispatch(Constant.ADD_CONTACT);
              this.$router.push({ name: 'contacts', query: { page: 1}});
          }
      },
      cancelEvent() {
          this.$router.push({ name: 'contacts', query: { page: this.contactlist.pageno }});
      }
  }
}
</script>

<style scoped>
.modal { display: block; position: fixed; z-index: 1; 
    left: 0; top: 0; width: 100%; height: 100%;
    overflow: auto; background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4); }
.form { background-color: white; margin:100px auto;
    max-width: 400px; min-width: 200px; font: 13px "verdana";
    padding: 10px 10px 10px 10px;  }
.form div { padding: 0;  display: block;  margin: 10px 0 0 0; }
.form label{ text-align: left; margin:0 0 3px 0;  padding:0px;
    display:block; font-weight: bold; }
.form input, textarea, select { box-sizing: border-box;
    border:1px solid #BEBEBE; padding: 7px; margin:0px;
    outline: none;  }
.form .long { width: 100%; }
.form .button{ background: #2B798D; padding: 8px 15px 8px 15px;
    border: none; color: #fff; }
.form .button:hover { background: #4691A4; }
.form .heading { background: #33A17F; font-weight: 300;
    text-align: left; padding : 20px; color: #fff;
    margin:5px 0 30px 0; padding: 10px; min-width:200px;
    max-width:400px; }
</style>
