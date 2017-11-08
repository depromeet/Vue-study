<template>
  <div>
      <hr class="divider">
      <div>
          <table class="detail table table-bordered">
              <tbody>
                  <tr class="active">
                      <td>일련번호</td>
                      <td>{{contact.no}}</td>
                  </tr>
                  <tr class="active">
                      <td>이름</td>
                      <td>{{contact.name}}</td>
                  </tr>
                  <tr class="active">
                      <td>전화</td>
                      <td>{{contact.tel}}</td>
                  </tr>
                  <tr class="active">
                      <td>주소</td>
                      <td>{{contact.address}}</td>
                  </tr>
              </tbody>
          </table>
      </div>
  </div>
</template>

<script>
import contactlist from '../ContactList';
export default {
  name : 'contactbyno',
  // route 의 params 를 props로 전달받음. (App.vue 에서 props:true 설정 해야 함)
  // props 로 받으면 data 에서 미리 초기화 하여 가지고 있을 필요도 없음. props 자체로 data
  props : ['no'],
  data() {
      return {
          contacts : contactlist.contacts
      }
  },
  computed : {
      contact() {
          // no 에 적힌 contact 찾아서 return
          // computed 는 created 후 0으로 생성되고 계산되어 update 됨
          var no = this.no;
          var arr = this.contacts.filter((item, index) => item.no == no);
          if (arr.length == 1) return arr[0];
          else return {};
      }
  }
}
</script>

<style>
table.detail {width: 400px;}
.divider { height: 3px; margin-left: auto; margin-right: auto; background-color: #FF0066; border: 0 none;}
</style>
