# Vue instance
모든 Vue 앱은 Vue 함수로부터 새 Vue 인스턴스를 만드는 것부터 시작한다.

    var vm = new Vue({
        // options...
    })

data, template, mount, method, lifecycle callback 등의 option을 포함할 수 있다.

## el, data, computed 옵션
- data 
    - Vue instance 의 data 가 담기는 곳
    - instance 내부에 직접 data 를 넣지 않고, data 객체를 따로 만들어 놓은 후 proxy를 두어서 처리
    - ```javascript
        // 데이터 객체
        var data = { a: 1 }

        // Vue인스턴스에 데이터 객체를 추가.
        var vm = new Vue({
            data: data
        })

        // 같은 객체를 참조한다.
        vm.a === data.a // => true

        // 속성 설정은 원본 데이터에도 영향을 줌.
        vm.a = 2
        data.a // => 2

        // vue instance 에서 제공하는 method 로도 접근 가능.
        vm.$data.a // => 2
        ```
- el
    - Vue instance 에 연결 할 HTML DOM 요소를 지정
    - 단 한개의 요소만 지정 가능. 그래서 주로 HTML element의 id 값을 이용하여 지정
    - `vm.$mount()` 를 통해 동적으로 HTML 과 연결할 수 있지만, 권장하지 않음.

- computed
    - computed 옵션에서 작성한 함수는 Vue instance 가 proxy 처리하여 속성처럼 취급함.
    - 함수지만, 연산 결과 값을 속성 값 처럼 binding 할 수 있다.
    - ```html
        <div id="example">
            <input type="text" v-model="num" /><br />
            1부터 입력된 수까지의 합 : <span>{{sum}}</span>
        </div>
        ```
    - ```javascript
        var vm = new Vue({
            el : "#example",
            data : { num : 0 },
            computed : {
                sum : function() {
                    var n = Number(this.num);
                    if (Number.isNaN(n) || n < 1)  return 0;
                    return ((1+n) * n) / 2;
                }
            }
        });
        ```
    - computed 속성 내부에서 get, set 을 나누어 작성할 수 있다.

## Method
Vue instance 에서 사용할 메서드를 등록하는 옵션. 
- Vue instance를 이용해 직접 호출, 디렉티브 표현식(v-), Mustache 표현식 등애 사용 가능하다.
- Mustache 내부에 함수 호출 구문으로 작성한다.
- ```html
    <div id="example">
        <input type="text" v-model="num" /><br />
        1부터 입력된 수까지의 합 : <span>{{sum()}}</span>
    </div>
    ```
- ```javascript
    var vm = new Vue({
        el : "#example",
        data : { num : 0 },
        methods : {
            sum : function() {
                console.log(Date.now());
                var n = Number(this.num);
                if (Number.isNaN(n) || n < 1)  return 0;
                return ((1+n) * n) / 2;
            }
        }
    });
    ```
- Arrow function 을 이용하여 method 를 작성하면, arrow function 내부의 this 가 Vue instance 를 가리키지 않고, 전역 객체를 가리킨다. 주의하자. 일반 함수를 사용해서 context 가 바뀌도록 해야 함.

### ??? Method 와 Computed 속성의 차이?
결과는 비슷 하지만, 내부 작동방식이 차이남. => 캐싱의 유무
- computed 로 작성하면 종속된 값에 의해 결과값이 **캐싱**되고 계산된 속성은 종속성 중 일부가 변경 된 경우에만 다시 계산 됨.(data 변경시에만 다시 계산)
- method 로 작성하면 매번 메서드를 실행함.
- [참고](https://kr.vuejs.org/v2/guide/computed.html#계산된-캐싱-vs-메소드)


### 관찰 속성(Watched Property)
긴 처리 시간이 필요한 비동기 처리에 적합.
특정 속성이 변경되었을 때 호출 할 함수를 정의

비동기 처리의 가장 대표적인 예가 외부 서버와의 통신을 할 경우인데, computed 속성은 값을 직접 리턴해야 하기 때문에 동기적인 처리만 가능.
비동기 처리를 위해선 watch를 사용하거나 event 처리 해야함.

watch 옵션은 비동기 연산 수행, 연산 수행 제한, 중간 상태 설정 등등 비동기 처리의 많은 부분이 가능하다.
[참고](https://kr.vuejs.org/v2/guide/computed.html#감시자)

### v-cloak 디렉티브
렌더링 전 {{ }} 표현식의 템플릿 문자열이 나타나는 경우 안보이게 하기 위한 방법

## Vue instance Lifecycle Hooks

Vue instance는 객체로 생성되거나 업데이트 되고 DOM에 마운트 하면서 초기화 단계를 거치는데,
그 초기화 단계에 custom logic을 삽입하기 위한 방법

beforeCreate 에는 instance 가 생성되고 Vue instance의 property (data, watch ...) 가 설정되기 전에 호출되는 hook 이다.

created 는 Vue instance 의 property 가 set 된 후 호출되는 hook 이다. 그래서 data에 있는 객체에 접근하는 custom logic 을 만드는 경우 이곳에서 부터 할 수 있다.

create, mount, update, destroy 앞 뒤에 넣을 수 있다.

```javascript
new Vue({
    data: { a: 1 },
    created: function () {
        // `this` 는 vm 인스턴스를 가리킵니다.
        console.log('a is: ' + this.a)
    }
})
// => "a is: 1"
```

[백문이 불여일견](https://kr.vuejs.org/v2/guide/instance.html#라이프사이클-다이어그램)