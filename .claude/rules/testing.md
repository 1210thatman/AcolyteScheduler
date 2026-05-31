# Testing

> 현재 프로젝트에 테스트 프레임워크가 설치되어 있지 않습니다.
> 테스트 도입 시 아래 가이드를 기준으로 세팅하세요.

## 권장 스택

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

`vite.config.js`에 추가:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
```

`src/test/setup.js`:
```js
import '@testing-library/jest-dom';
```

## 무엇을 테스트할까

**테스트 우선순위 (높음 → 낮음)**
1. 유틸 함수 — 순수 함수, 날짜 변환, 데이터 가공 로직
2. 커스텀 훅 — 상태 변화 로직
3. 핵심 UI 컴포넌트 — 렌더링 조건, 사용자 인터랙션
4. 페이지 컴포넌트 — 필요한 경우에만

**테스트하지 않아도 되는 것**
- 단순 스타일/레이아웃 컴포넌트
- 서드파티 라이브러리 내부 동작
- 스냅샷 테스트 (유지보수 비용 대비 효과 낮음)

## 테스트 파일 위치

```
src/
├── components/
│   ├── UserCard.jsx
│   └── UserCard.test.jsx   ← 컴포넌트와 같은 위치
├── utils/
│   ├── formatDate.js
│   └── formatDate.test.js
└── hooks/
    ├── useSchedule.js
    └── useSchedule.test.js
```

## 작성 패턴

### 유틸 함수 테스트

```js
import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 반환한다', () => {
    expect(formatDate(new Date('2024-01-15'))).toBe('2024-01-15');
  });

  it('잘못된 입력에는 빈 문자열을 반환한다', () => {
    expect(formatDate(null)).toBe('');
  });
});
```

### 컴포넌트 테스트

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('이름과 역할을 렌더링한다', () => {
    render(<UserCard name="홍길동" role="복사" />);
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('복사')).toBeInTheDocument();
  });

  it('버튼 클릭 시 �핸들러가 호출된다', async () => {
    const handleClick = vi.fn();
    render(<UserCard name="홍길동" role="복사" onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

## 테스트 실행

```bash
npm run test          # watch 모드
npm run test -- --run # 1회 실행
```
