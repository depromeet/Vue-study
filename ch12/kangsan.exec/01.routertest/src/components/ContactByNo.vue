<template>
  <div>
      <h1>연락처 상세</h1>
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
</style>
