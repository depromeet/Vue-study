import contactAPI from '../api/ContactsAPI';
import Constant from '../constant';

// 해당 store 를 받아서 제어
export default {
    [Constant.ADD_CONTACT] : (store) => {
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
        contactAPI.fetchContact(pageno, pagesize)
        .then((res) => {
            store.commit(Constant.FETCH_CONTACTS, { contactlist: res.data });
        })
    },
    [Constant.DELETE_CONTACT] : (store, payload) => {
        const currentPageNo = store.state.contactlist.pageno;
        contactAPI.deleteContact(payload.no)
        .then((res)=>{
            store.dispatch(Constant.FETCH_CONTACTS, { pageno: currentPageNo });
        })
    },
    [Constant.FETCH_CONTACT_ONE] : (store, payload) => {
        contactAPI.fetchContactOne(payload.no)
        .then((res) => {
            store.commit(Constant.FETCH_CONTACT_ONE, { contact: res.data });
        })
    },
    [Constant.INITIALIZE_CONTACT_ONE] : (store) => {
        store.commit(Constant.INITIALIZE_CONTACT_ONE);
    }
};