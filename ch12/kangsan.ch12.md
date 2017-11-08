# vue-router 를 이용한 라우팅
SPA 는 여러 화면을 하나의 페이지 안에서 제공하면서 화면을 별도로 로딩하지 않는다.

화면마다 고유의 식별자를 기반으로 화면을 렌더링 함.

고유 식별자로 URI를 사용함.

vue-router 라는 라이브러리를 활용하여서 만듦.

vue-router 의 기능
 - 중첩된 경로, 뷰를 매핑 가능
 - 컴포넌트 기반의 라우팅을 구현할 수 있음
 - Vue.js 의 Transition 사용 가능
 - history 모드와 hash 모드 사용 가능
 - QueryString, parameter, wildcard 를 사용하여 라우팅 구현 가능

## vue-router 기초
`kangsan.exec/01.routertest`
-  main.js
    - `import VueRouter from 'vue-router'`
    - ` Vue.use(VueRouter)`
- App.vue
    - `import VueRouter from 'vue-router'`
    - 사용 할 components import
    - Router instance 생성
        ```javascript
        const router = new VueRouter({
            routes : [
                // 사용 할 routes 지정. 브라우저 주소창에서 접속 가능한 경로.
                { path:'/', component: Home },
                { path:'/home', component: Home },
                { path:'/about', component: About }
            ]
        })
        ```
    - template 안에 components 가 들어갈 위치 지정
        ```html
        <div class="container">
            <router-view></router-view>
        </div>
        ```
    - `<a>` 태그는 template 내부에서 `<router-link to="/home">` 이렇게 구현 가능하다.
    - Vue instance 생성 시 생성 한 router 객체 정보 추가
        ```javascript
        export default {
            name : 'app',
            router
        }
        ```
## 동적 Route
일정한 패턴의 URI 경로를 하나의 컴포넌트에 연결하는 방법. URI 경로의 일부에 실행에 필요한 파라미터 값이 포함된 경우에 유용
- 동적으로 link 생성 : `v-bind` 를 이용하여 `to` Attribute 애 바인딩
    ```html
    <div>
      <h1>Contacts</h1>
      <div class="wrapper">
        <div class="box" v-for="c in contacts" :key="c.no">
          <!-- /contacts/:no 형태로 URI 경로를 요청 -->
          <router-link :to="'/contacts/'+c.no">{{c.name}}</router-link>
        </div>
      </div>
    </div>
    ```
- `/contacts/:no` 형태로 요청 할 때 처리할 컴포넌트 추가
    - route 객체 활용 [참고](https://router.vuejs.org/kr/api/route-object.html)
    - route 객체를 통해 얻는 정보 (param 등)는 lifecycle 의 created() 에 넣는다. route 객체의 param 은 lifecycle 어디서든 참조할 수 있지만 createBefore 에는 data가 set 되지 않기 때문에 param을 넣어줄 수 없다. [참고](https://codingexplained.com/coding/front-end/vue-js/vue-instance-lifecycle-hooks)
    - Detail view 컴포넌트 추가
        ```javascript
        import contactlist from './somewhere/'
        export default {
            name : 'contactbyno',
            data() {
                return{ no : 0, contacts : contactlist.contacts }
            },
            created() {
                // route 객체($route)를 활용한다.
                this.no = this.$route.params.no;
            },
            computed() {
                // no 가 0에서 바뀌면 (uri의 param을 가져오면(created가 실행되면)) 
                // 해당되는 연락처를 가져오도록 하는 코드
            }
        }
        ```
- 생성 한 component(detail view)를 App.vue 의 router 객체에 등록

## 중첩 라우트 (Nested Routes)

하나의 컴포넌트 안에서 또 하위 컴포넌트들을 가지는 경우 라우팅도 중첩이 가능해야 함. 이를 Nested Routes 라고 한다.

- 하위에 들어갈 components 를 router 객체의 해당 component 의 **children** 속성으로 추가
    ```javascript
    // App.vue
    const router = new VueRouter({
        routes : [
            // ...
            // /contacts 접근 시 Contacts.vue 만 렌더링
            { path:'/contacts', component: Contacts,
            children : [
                // /contaccts:no 접근 시 Contacts.vue 와 ContactByNo.vue 를 함께 렌더링
                { path : ":no", component: ContactByNo }
            ] },
        ]
    })
    ```
- children component 가 함께 렌더링 될 부분을 지정. `<router-view></router-view>` 삽입
    ```html
    <!-- Contact.vue -->
    <!-- ContactByNo.vue 가 연결될 부분 설정-->
    <template>
        <div>
            <!-- ... -->
            <router-view></router-view>
        </div>
    </template>
    ```
- children component 가 바뀔 떄 새 params로 data를 업데이트 할 수 있도록 **watch** 속성 추가
    ```javascript
    // ContactByNo.vue
    // ...
    created() {
        this.no = this.$route.params.no;
    },
    watch() {
        '$route' : function(to, from) {
            // to는 현재의 route 객체, from 은 이전의 route 객체
            this.no = to.params.no;
        }
    }
    ```

## 명명된 라우트 (Named Routes)
`kangsan.exec/02.nested-route-named-route`

라우트 정보에 고유한 이름을 부여하는 것.
URI 경로가 아닌 Route의 이름으로 네비게이션 하도록 할 수 있음.

URI 경로가 복잡하면, 전체 path를 입력해야 하지만 named route를 사용하면 좀더 간단하게 입력 가능.

URI 경로가 바뀔 때도 이름은 같으므로 편리함.

- router 객체 안에 라우팅 되는 components 들에 name 옵션을 추가하여 이름 지정 (name 은 unique)
    ```javascript
    const router = new VueRouter({
        routes : [
            // ...
            { path : '/home', name:'home', component: Home },
            { path : '/about', name:'about', component: About },
            { path : '/contacts', name:'contacts', component: Contacts },
            // ...
        ]
    })
    ```

- router 객체에 지정한 이름을 `<router-link :to="{ name:'xxx'}"></router-link>` 로 바인딩
    ```html
    <template>
        <!-- ... -->
        <ul>
            <li>
                <router-link :to="{ name:'home' }">Home</router-link>
            </li>
            <li>
                <router-link :to="{ name:'about' }">About</router-link>
            </li>
            <li>
                <router-link :to="{ name:'contacts' }">Contacts</router-link>
            </li>
        </ul>
    </template>
    ```
- name 과 함께 query, params 객체를 전달할 수 있음.
    - param 전달하는 예
    
    `<router-link :to="{ name:'contacts', params:{ no : 1003 } }"></router-link>`

    => /contacts/1003
    - query 전달하는 예

    `<router-link :to="{ name: 'contacts', query: { pageno : 2 }}"></router-link>`

    => /contacts?pageno=2


# 프로그래밍 방식의 라우팅 제어
`kangsan.exec/03.programming-route`

`<router-link>` 를 이용해 선언적으로 네비게이션용 `<a>` 태그를 만드는 것 이외에도 router의 instance method 를 사용하여 프로그래밍으로 네비게이션 할 수 있다.

링크를 클릭했을 때 바로 이동하지 않고, 사용자의 확인을 받고 이동하거나, 이벤트 처리를 이용해 이동하기 전에 다른 작업을 함께 수행하는 경우 사용한다.

## router 객체의 push method

`router.push(location [, completeCallback] [, abortCallback])`

location 은 이동하고자 하는 경로 정보, 필수 항목. 성공시 콜백/ 실패 시 콜백

선언적방식 | 프로그래밍 방식
--- | ---
`<router-link :to="...">` | router.push( ... )

- 예시
    - 문자열 직접 전달

        `this.$router.push('/home')`
    - 객체 정보로 전달

        `this.$router.push({ path : '/about' })`
    - 명명된 라우트 사용

        `this.$router.push({ name : 'contacts', params: { no: 1002 }})`
    - 쿼리 문자열 전달

        `this.$router.push({ path: '/contacts', query: { pageno: 1, pagesize:5 }})`

    ```html
    <template>
        <div class="wrapper">
        <div class="box" v-for="c in contacts" :key="c.no">
          <span @click="navigate(c.no)" style='cursor:pointer'>[ {{c.name}} ]</span>
        </div>
      </div>
    </template>
    ```
    ```javascript
    export default {
        methods : {
            navigate(no) {
                if (confirm("상세 정보를 보시겠습니까?")) {
                    this.$router.push(
                    // location
                    { name: 'contactbyno', params: { no }},
                    // resolve callback
                    () => { console.log("/contacts/"+no+" 로 이동 완료!")})
                }
            }
        }
    }
    ```
## 네비게이션 보호 (Navigation Guards)

vue-router 가 제공하는 네비게이션 가드는 주로 리디렉션하거나 취소하여 네비게이션을 보호하는 데 사용된다.

전역 수준, 라우트 정보 수준, 컴포넌트 수준에서 사용할 수 있다.

해당 컴포넌트로 이동(렌더링)할지 말지 각각 전역/라우트 정보(주소)/ 컴포넌트 수준에서 제어하는 것

- 전역 수준에서의 네비게이션 보호
    ```javascript
    const router = new VueRouter({ ... })

    router.beforeEach((to, from, next) => {
        // ...
    })
    router.afterEach((to, from) => {
        // ...
    })
    ```
  routing 이 일어나기 전 실행되는 beforeEach 와 라우팅이 끝난 후 실행되는 afterEach method 로 나눌 수 있다.

  parameter 로 들어가는 to 는 이동하려는 대상 Route 객체이고, from 은 이동하기 전의 Route 객체, next는 함수형으로 작성하여 네비게이션의 중단, 진행, 리다이렉트 등을 할 수 있다.
    - next 가 하는 작업 : `before-` 이 있는 곳에선 **반드시** 사용한다.
        - next() : 다음 이벤트 훅으로 이동시킴. 호출하지 않으면 이동하지 않는다. 정상적으로 작동하기 위해 반드시 적어줘야 함.
        - next(false) : 현제 네비게이션을 중단시킴. from 라우트 객체의 URL로 재설정
        - next(경로) : 지정된 경로로 redirection
        - next(Error) : next에 Error 객체를 전달하면 네비게이션이 중단되고 router.onError()를 이용해 등록된 콜백에 에러가 전달 됨.
- Route 수준에서의 네비게이션 보호

    VueRouter 객체 안의 라우트 정보에 beforeEnter 메서드를 작성함. to, from, next 인자들을 사용하고, 전역 수준의 beforeEach 에서와 동일.

    ```javascript
    const router = new VueRouter({
        routes: [
            {
                path: '/contacts/:no',
                component: ContactByNo,
                beforeEnter: (to, from, next) => {
                    // Do Something
                } 
            }
        ]
    })
    ```

- Component 수준에서의 네비게이션 보호

    Vue instance Lifecycle 에서 보았던 Lifecycle hooks(event hooks) 와 동일한 방법으로 네비게이션 보호 기능을 사용할 수 있다.

    ```javascript
    const Foo = {
        template: '...',
        beforeRouteEnter (to, from, next) {

        },
        beforeRouteLeave (to, from, next) {

        },
        beforeRouteUpdate (to, from, next) {

        }
    }
    ```
    - beforeRouteEnter: 렌더링 하는 라우트 이전에 호출되는 hook. Vue instance 가 생성되지 않은 시점이기 떄문에 this를 이용할 수 없음. Vue instance 를 이용하고 싶은 경우 next 함수를 이용하여 비동기 처리.

    - beforeRouteLeave: 현재 경로에서 다른 경로로 빠져나갈 때 호출되는 훅

    - beforeRouteUpdate : 이미 렌더링 된 컴포넌트의 경로가 변경될 떄 호출되는 훅. 이미 Vue instance 가 만들어져 있고 재사용 할 경우에 호출. (이 경우 beforeRouteEnter는 호출되지 않는다.) 관찰 속성(watched property)과 같은 역할을 함.

위 기능들은 애플리케이션의 인증 처리에 네비게이션 보호 기능을 사용할 수 있음.

전역 네비게이션 보호 메서드인 beforeEach()에서 사용자의 인증 여부를 확인하고 접근 권한이 없으면 로그인 화면으로 전환시키도록 next() 메서드 활용 가능.

## Routing Mode
VueRouter 객체의 기본 모드는 hash mode.

 **URL에서 hash(#) 다음의 경로는 경로가 페이지 내부의 이름으로 여겨지기 떄문에 해시 이후의 경로가 바뀌더라도 페이지가 다시 로드되지 않는 것.**

 hash를 제거하기 위해서는 VueRouter 객체에서 mode 옵션을 'history' 로 지정하여 히스토리 모드를 사용하면 된다.

```javascript
// App.vue
// ...

const router = new VueRouter({
    mode : 'history',
    routes : [
        //...
    ]
})
```
history 모드 사용 시 URL 변경 시 서버로 새로운 요청이 들어간다.

잘못된 경로로 요청 되었을 때(404) 오류 메시지를 나타내려면 route 마지막 부분에 catch-all (*) 라우트와 오류메세지를 보여줄 컴포넌트를 추가하면 된다.
```javascript
//...
import NotFound from './components/NotFound.vue'

//...
const router = new VueRouter({
    mode: 'history',
    routes[
        {path: '/' , component: Home},
        //...
        //... 사용 될 route 들
        //다 돌고도 잡히지 않는 경로들은 NotFound로 보냄
        {path: '*' , component: NotFound }
    ]
})
```
server 측에서의 route 로 404 handling 해줘도 된다.

# Route 정보를 속성으로 연결하기
`kangsan.exec/04.route-params-to-props`

Component 를 route 객체에 의존적으로 사용하는 것은 재사용성 측면에서 좋지 않다.

이전 까지 예제에서는 컴포넌트에서 주소에 있는 정보를 `this.$route` 객체 를 활용하여 얻어와서 data에 있는 정보에 넣어주었다. data() 에 미리 사용 할 데이터를 초기화 해 놓고 created(), watch() 같은 이벤트 훅이나, beforeRouteUpdate()와 같은 navigation guards 의 event hook 을 이용하여 컴포넌트 내부의 data를 업데이트 해 주었다.

하지만, 라우팅을 사용하지 않는 애플리케이션에서 사용하기에 적합하지 않다. 그래서 route.params 정보를 props 형태로 전달하는 방법을 이용한다.

- route 경로의 params 정보를 props 속성에 연결
    ```javascript
    // App.vue
    const router = new VueRouter({
        //...
        routes : [
            //...
            { path:'/contacts', name:'contacts', component: Contacts,
            children : [
                {path : ':no', name:'contactbyno', component: ContactByNo, props: true}
            ]
            }
        ]
    })
    ```
    `props: true` 를 통해 URI 경로상의 :no 로 전달되는 param 을 동일한 이름의 속성(props) 에 연결함.

- 해당 컴포넌트는 props 로 받으면 된다. data() 에서 초기화 해서 가지고 있을 필요도 없고 그냥 data 처럼 활용하면 된다.
    ```javascript
    // ContactByNo.vue
    export default {
        name : 'contactbyno',
        props : ['no'],
        data() {
            return { contacts : contactlist.contacts }
        },
        // remove create event hook
        // remove beforeRouteUpdate navigation guard
        // ...
    }
    ```
- 만일 query 정보를 props 로 주고 싶으면, 함수를 따로 만들어서 props 에 넣어준다.

    ```javascript
    // App.vue
    function connectQueryToProp(route) {
        return { no : route.query.no , path: route.path };
    }

    const router = new VueRouter({
        routes: [
            //...
            { path: '/contactbyno', component: ContactByNo, props : connectQueryToProp }
        ]
    })
    ```
# API 서버랑 연동 한 예제
`kangsan.exec/05.route-contact-app`

Dynamic Component + Vuex + VueRouter + Axios

기존 Vuex 예제에서 확장

## 같은 Component 사용하면서 구분지어야 할 경우
입력 form, 수정 form 과 같이 같은 form 형식이면서 약간의 차이가 있는 경우 
URI 경로로 구분

## vue-router 를 사용하므로 Component를 보여주기 위한 state 가 없어도 된다.
EDIT FORM, ADD FORM, CANCEL FORM, CHANGE MODE 같은 애들
화면 전환을 위해 상태를 이용하지 않음.

Dynamic Component 를 보여주기 위해 CurrentView를 사용하지 않아도 된다.
mutation와 action 들에도 component를 보여주기 위한 핸들러들이 없어도 됨.

mutation 에는 state 의 data를 변경하는 작업만 등록함.
수정과 삭제는 mutation에 등록하지 않음. 외부 API 를 요청한 후 수신한 데이터를 FETCH_CONTACTS mutation을 이용해 업데이트 하기 떄문.

App.vue 에서`<currentView>` 를 이용했던 동적 컴포넌트들은 vue-router를 이용하면서 `<router-view>` 로 대체

main.js 에 라우팅 기능 추가

# 지연시간 처리
`kangsan.exec/06.spinner-contact-app`

외부 API 의 data를 가져오다 보면 비동기적인 처리를 할때 지연 시간이 생길 수 있다.

spinner 를 이용해서 UI 적으로 처리하자

- spinner.vue 생성
- state 에 isloading 추가
- mutation 에 isloading 변경하는 메소드 추가
- action 에서 isloading 변경하는 mutation 실행하도록(Commit) 하는 메소드 추가 (change_isloading)
- spinner가 필요한 action 들에 change_isloading action 실행하는 dispatch 추가 
    
    (payload 예 : {isloading : true })
- App.vue `<router-view></router-view>` 하위에 spinner 추가

    `<loading v-show="isloading"></loading>` 물론 spinner component import 해야 함.


