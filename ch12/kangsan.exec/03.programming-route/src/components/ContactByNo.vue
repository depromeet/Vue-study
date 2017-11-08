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
  data() {
      return {
          no : 0,
          contacts : contactlist.contacts
      }
  },
  created() {
      // this.$route 로 접근하여 parameter를 참조 할 수 있다.
      // created 이후부터 data() 에 접근 가능.
      this.no = this.$route.params.no;
  },
//   watch : {
//     '$route' : function(to, from) {
//         this.no = to.params.no;
//     }
//   },
  beforeRouteUpdate(to, from, next) {
      // watch 와 동일한 기능. 반드시 next() 를 호출해서 다음 event hook으로 넘겨줘야 함
      console.log('## beforeRouteUpdate');
      this.no = to.params.no;
      next();
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
