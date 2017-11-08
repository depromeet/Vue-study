import Constant from '../constant';
// 상태를 변경하는 기능만 뽑음
export default {
    [Constant.FETCH_CONTACTS] : (state, payload) => {
        state.contactlist = payload.contactlist;
    },
    [Constant.FETCH_CONTACT_ONE] : (state, payload) => {
        state.contact = payload.contact;
    },
    // 연락처 추가 화면으로 이동했을 떄 입력 폼을 초기화하기 위해.
    [Constant.INITIALIZE_CONTACT_ONE] : (state) => {
        state.contact = { no: '', name: '', tel: '', address: '', photo: '' };
    },
    // isloading 상태 정보를 변이시키는 기능
    [Constant.CHANGE_ISLOADING] : (state, payload) => {
        state.isloading = payload.isloading;
    }
};

