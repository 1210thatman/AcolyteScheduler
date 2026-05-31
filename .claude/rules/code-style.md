11# Code Style

## 기본 원칙

- 읽기 쉬운 코드를 우선한다. 짧고 영리한 코드보다 명확하고 이해하기 쉬운 코드를 선택한다.
- 추상적이거나 고난이도의 JS 문법은 지양한다. 널리 사용되고 익숙한 문법을 사용한다.
- 복잡한 표현식보다 단계를 나눠 변수로 분리하는 것을 선호한다.

## JavaScript 문법

**사용하는 문법**
- `const`, `let` (var 금지)
- 화살표 함수 `() => {}`
- 템플릿 리터럴 `` `Hello ${name}` ``
- 배열/객체 구조분해 할당 (단순한 경우에 한해)
- 스프레드 연산자 `...` (얕은 복사, props 전달 등)
- `Array.map`, `Array.filter`, `Array.find` 등 기본 배열 메서드
- 옵셔널 체이닝 `?.` (중첩 없이 단순하게)
- `async/await` (비동기 처리)

**지양하는 문법**
- 중첩 삼항 연산자 (`a ? b ? c : d : e` 형태 금지)
- 복잡한 `Array.reduce` — 단순 합산 외에는 `map/filter`로 대체
- 제너레이터, 이터레이터, `Symbol`, `Proxy`, `Reflect`
- 복잡한 구조분해 중첩 (`const { a: { b: { c } } } = obj` 형태)
- 커링, 고차함수 조합 등 함수형 프로그래밍 고급 패턴
- 비트 연산자 (`|`, `&`, `^`, `~`, `<<`, `>>`)

**나쁜 예 / 좋은 예**
```js
// 나쁜 예: 중첩 삼항
const label = isAdmin ? isActive ? '관리자(활성)' : '관리자(비활성)' : '일반';

// 좋은 예: if/else로 분리
let label;
if (isAdmin && isActive) {
  label = '관리자(활성)';
} else if (isAdmin) {
  label = '관리자(비활성)';
} else {
  label = '일반';
}
```

```js
// 나쁜 예: reduce 남용
const total = items.reduce((acc, item) => acc + item.price, 0);
// → 단순 합산은 허용. 복잡한 변환 로직을 reduce에 담는 것은 금지.

// 좋은 예: 단계 분리
const prices = items.map(item => item.price);
const total = prices.reduce((acc, price) => acc + price, 0);
```

## React 컴포넌트

- 함수형 컴포넌트만 사용한다. 클래스형 컴포넌트 금지.
- 컴포넌트는 named export를 사용한다. (`export default`는 라우팅 최상위 페이지에서만 허용)
- 하나의 파일에 하나의 컴포넌트를 원칙으로 한다.
- 컴포넌트 내부 로직이 길어지면 커스텀 훅으로 분리한다.

```jsx
// 좋은 예
export function UserCard({ name, role }) {
  return (
    <div className="user-card">
      <span>{name}</span>
      <span>{role}</span>
    </div>
  );
}
```

## 네이밍

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | `UserCard.jsx` |
| 커스텀 훅 파일 | camelCase, `use` 접두사 | `useSchedule.js` |
| 일반 유틸 파일 | camelCase | `formatDate.js` |
| CSS 파일 | 컴포넌트와 동일 이름 | `UserCard.css` |
| 변수/함수 | camelCase | `const userName` |
| 상수 | UPPER_SNAKE_CASE | `const MAX_COUNT = 10` |
| 이벤트 핸들러 | `handle` 접두사 | `handleSubmit`, `handleClick` |

## 파일 구조 (컴포넌트 내부 순서)

```jsx
// 1. import
import { useState } from 'react';

// 2. 컴포넌트 외부 상수
const DEFAULT_NAME = '이름 없음';

// 3. 컴포넌트 본문
export function MyComponent({ value }) {
  // 3-1. 훅
  const [count, setCount] = useState(0);

  // 3-2. 파생 변수 (복잡한 계산)
  const displayValue = value ?? DEFAULT_NAME;

  // 3-3. 이벤트 핸들러
  function handleClick() {
    setCount(count + 1);
  }

  // 3-4. JSX 반환
  return <div onClick={handleClick}>{displayValue}</div>;
}
```

## Import 순서

```js
// 1. React 및 외부 라이브러리
import { useState, useEffect } from 'react';
import { someLib } from 'some-library';

// 2. 내부 컴포넌트
import { UserCard } from '../components/UserCard';

// 3. 훅 / 유틸
import { useSchedule } from '../hooks/useSchedule';
import { formatDate } from '../utils/formatDate';

// 4. 스타일
import './MyComponent.css';
```
