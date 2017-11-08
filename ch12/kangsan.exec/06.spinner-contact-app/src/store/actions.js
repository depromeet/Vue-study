import contactAPI from '../api/ContactsAPI';
import Constant from '../constant';

// 해당 store 를 받아서 제어
export default {
    [Constant.CHANGE_ISLOADING] : (store, payload) => {
        // CHANGE_ISLOADING Mutation 을 payload 를 줘서 변화시킴
        store.commit(Constant.CHANGE_ISLOADING, payload)
    },
    [Constant.ADD_CONTACT] : (store) => {
        // spinner 실행
        store.dispatch(Constant.CHANGE_ISLOADING, { isloading: true });
        contactAPI.addContact(store.state.contact)
        .then((res) => {
            if(res.data.status === "success") {
                store.dispatch(Constant.FETCH_CONTACTS, { pageno: 1});
            } else {
                console.log('연락처 추가 실패 : ', res.data);
            }
        })
    },
    [Constant.UPDATE_CONTACT] : (store) => {
        // spinner 실행
        store.dispatch(Constant.CHANGE_ISLOADING, { isloading: true });
        const currentPageNo = store.state.contactlist.pageno;
        contactAPI.updateContact(store.state.contact)
        .then((res) => {
            if (res.data.status === 'success'){
                store.dispatch(Constant.FETCH_CONTACTS, { pageno: currentPageNo });
            } else {
                console.log("연락처 변경 실패 : ", res.data)
            }
        })
    },
    [Constant.UPDATE_PHOTO] : (store, payload) => {
        // spinner 실행
        store.dispatch(Constant.CHANGE_ISLOADING, { isloading: true });
        const currentPageNo = store.state.contactlist.pageno;
        contactAPI.updatePhoto(payload.no, payload.file)
        .then((res) => {
            store.dispatch(Constant.FETCH_CONTACTS, { pageno: currentPageNo })
        })
    },
    [Constant.FETCH_CONTACTS] : (store, payload) => {
        let pageno;
        if(typeof payload ==="undefined" || typeof payload.pageno ==="undefined")
            pageno = 1;
        else
            pageno = payload.pageno;
        const pagesize = store.state.contactlist.pagesize;
        // FETCH_CONTACTS (주소록 페이지 불러오기) 동안 
        // { isloading:true} 로 store에 CHANGE_ISLOCADING 액션을 줌. (spinner를 돌림)
        store.dispatch(Constant.CHANGE_ISLOADING, { isloading:true });
        contactAPI.fetchContact(pageno, pagesize)
        .then((res) => {
            // 비동기 처리 완료 (성공)
            store.commit(Constant.FETCH_CONTACTS, { contactlist: res.data });
            // spinner 종료
            store.dispatch(Constant.CHANGE_ISLOADING, { isloading:false });
        })
    },
    [Constant.DELETE_CONTACT] : (store, payload) => {
        // spinner 실행
        store.dispatch(Constant.CHANGE_ISLOADING, { isloading: true });
        const currentPageNo = store.state.contactlist.pageno;
        contactAPI.deleteContact(payload.no)
        .then((res)=>{
            store.dispatch(Constant.FETCH_CONTACTS, { pageno: currentPageNo });
        })
    },
    [Constant.FETCH_CONTACT_ONE] : (store, payload) => {
        // spinner 실행
        store.dispatch(Constant.CHANGE_ISLOADING, { isloading: true });
        contactAPI.fetchContactOne(payload.no)
        .then((res) => {
            store.commit(Constant.FETCH_CONTACT_ONE, { contact: res.data });
            // spinner 종료
            store.dispatch(Constant.CHANGE_ISLOADING, { isloading: false });
        })
    },
    [Constant.INITIALIZE_CONTACT_ONE] : (store) => {
        store.commit(Constant.INITIALIZE_CONTACT_ONE);
    }
};