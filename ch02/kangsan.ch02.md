## 간단한 Vue model 분석

```javascript
import Vue from 'vue'

const model = {
    message : "첫 번째 Vue.js app"
}

const vm = new Vue({
    el : "#simple",
    data : model
})
```

```html
<body>
    <div id="simple">
        <h2>{{ message }}</h2>
    </div>
</body>
```

- Vue object(Vue Model)
    - el : HTML Element
    - data : model(data) 객체 참조
- HTML
    - Interpolation : {{ }} (Mustache Expression)

# Directive
`v-` prefix 가 있는 특수 속성으로. 디렉티브 속성 값은 단일 JS 표현식이 됨. (v-for 는 예외)

표현식의 값이 변경될 때 반응적으로 DOM 에 적용.

## Basic Directives

### v-text, v-html
HTML Element 내부(Content)에 text를 바인딩
- v-text, {{ }} : innerText 속성에 연결. 텍스트 그대로 나옴
- v-html : innerHTML 속성에 연결. 태그 문자열 파싱, XSS 위험

### v-bind
HTML Element의 속성(Attribute)을 바인딩
- `<input type='text' v-bind:value="message">`
    - input 태그의 속성 value의 값으로 Vue model의 message라는 이름의 data가 들어간다.
- `<input type='text' :value="message">` 와 같이 줄여 쓴다.

### v-model
양 방향 data binding. 입력 form 필드에 사용하여 value와 값을 연결함

[예제](https://github.com/kangsanChang/vuejs_book/blob/master/ch02/02-05.html)
- `<input type="text">` : 단일 값과 연결
- `한 개의<input type="checkbox">` : 단일 boolean 값 (T/F)
- `여러 개의 <input type="checkbox">`, `<select multiple>` : 배열 객체와 연결
- `<input type="radio">`, `<select>` : 단일 값과 연결

### v-show, v-if, v-else, v-else-if
Vue 객체의 data 속성 값에 따라 조건을 정하여 렌더링 여부를 결정 함.

`<p v-if="cond > 0"> See me </p>` 와 같이 js expression 과 함께 적어 줌.

- v-show 와 v-if 의 차이
    - v-if : 조건에 맞지 않으면 렌더링 하지 않음. 초기 렌더링 비용이 낮으나 toggle 되는 경우 불필요
    - v-show : 조건과 맞지 않아도 렌더링 한 후 dispalay:none 으로 둠. 초기 렌더링 비용은 높으나 toggle 되는 경우 유용

## 반복 렌더링 Directive
`v-for` 디렉티브를 사용하여 반복적인 데이터를 렌더링. 배열 혹은 객체 데이터를 이용하여 반복 단순히 숫자를 넣어서도 반복 가능.

반복해야 할 요소의 속성에 넣어줌.

- 배열인 경우 `<tr v-for="(element, index) in contacts">` 와 같이 사용 가능
    - iterator를 하나만 써주는 경우는 각 배열 요소의 값만 들어감. 필요에 따라 사용.
    - [배열 반복 예제](https://github.com/kangsanChang/vuejs_book/blob/master/ch02/02-08.html)

- 객체인 경우 `<option v-for="(val, key, index) in reions">` 와 같이 사용 가능
    - iterator를 하나만 써주면 객체의 value 만 들어감. 필요에 따라 사용.
    - [객체 반복 예제](https://github.com/kangsanChang/vuejs_book/blob/master/ch02/02-09.html)

- v-if 디렉티브와 혼용 가능
    - `<tr v-for="(contact, index) in contacts" v-if="contact.address.indexOf('seoul')>-1">`
        - contact.address 가 seoul 인 애들만 출력.
        - 반복문이 먼저 수행되고 매번 if 검사
- Nested loop 가능
- v-for 사용 시 각 render 되는 element에 key 특성을 바인딩 할 것을 권장함. ([참고](https://kr.vuejs.org/v2/guide/list.html#key))
    - Vue 가 Virtual DOM 에서 각 노드의 ID 를 추적하고 재정렬 할 수 있도록 힌트를 주는 것.
    - key 값으로는 고유한 값을 줘야 함. (no, index ... DB 에서 가져온 data 의경우 PK(id) 값 등등)
    - `<tr :key="contact.no">` 와 같이 사용.
    - 엄청나게 복잡한 loop가 아니라면 key 를 사용하는 것을 권장.

### 기타 디렉티브

- v-pre : 문자열을 컴파일 하지 않고 문자 그대로 출력
- v-once : HTML 요소를 단 한번만 렌더링 한 후 변경되도 수정하지 않음.
- v-cloak : 화면 초기에 컴파일되지 않은 템플릿은 나타나지 않도록 함. (복잡한 UI 인 경우 렌더링이 덜 된게 노출 될 경우 사용)

## 계산형 속성(Computed property)
입력받은 값 (주로 양방향 바인딩을 통한)에 따라 달라지는 연산 결과를 바인딩 할 때 사용한다. 처리할 로직을 담은 함수를 만들고 그 함수명을 바인딩 하면, 로직을 처리한 리턴값이 바인딩 된다.

computed 안에 만든 함수 내부에서 data 에 대한 접근은 `this` (Vue 객체 자신을 가리킴) 를 이용하여 한다.

```html
<input type="text" v-model="num" />
1부터 입력된 수의 합 : <span>{{ sum }}</span>
```

```javascript
// 자연수를 입력받으면 1부터의 합을 반환
const vm = new Vue({
    el : "#test",
    data : { num : 0 },
    computed : {
        sum() {
            const n = Number(this.num);
            if (Number.isNan(n) || n <1 ) return 0;
            return (n*(n+1))/2;
        }
    }
})
```
#### 주의
콜백함수 내부에서 this는 다를 수 있으므로, 콜백함수 사용 시 전에 미리 값을 저장해 두었다 사용한다 => [예제](https://github.com/kangsanChang/vuejs_book/blob/master/ch02/02-16.html) 62,64 라인
