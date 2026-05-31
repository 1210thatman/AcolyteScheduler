# Security

## XSS (크로스 사이트 스크립팅) 방지

- `dangerouslySetInnerHTML` **절대 사용 금지**. 외부 입력값을 HTML로 직접 삽입하지 않는다.
- 사용자 입력을 그대로 화면에 노출할 때는 React의 JSX 자동 이스케이프를 신뢰하고, 별도 HTML 파싱 없이 텍스트로 렌더링한다.

```jsx
// 금지
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// 허용
<div>{userInput}</div>
```

## 환경 변수

- API URL, 클라이언트 키 등 설정값은 `.env` 파일로 관리한다.
- Vite에서 브라우저에 노출되는 변수는 `VITE_` 접두사를 붙인다.
- **시크릿 키, 비밀번호, 토큰은 절대 프론트엔드 코드나 환경 변수에 포함하지 않는다.** 이 값들은 반드시 백엔드에서만 관리해야 한다.
- `.env` 파일은 `.gitignore`에 포함되어 있는지 항상 확인한다.

```
# .env 예시
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=AcolyteScheduler
```

```js
// 사용 예
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 입력값 검증

- 폼 입력은 제출 전 반드시 클라이언트 측 유효성 검사를 수행한다.
- 단, 클라이언트 검증은 UX 목적이며 보안의 최종 방어선이 아님을 인지한다. 백엔드 연동 시 서버 측 검증을 반드시 병행해야 한다.
- 숫자 필드에 문자 입력 차단, 길이 제한, 허용 문자 범위 등을 명시적으로 처리한다.

```jsx
function handleSubmit(e) {
  e.preventDefault();
  if (!name.trim()) return;
  if (name.length > 50) return;
  // 제출 처리
}
```

## URL 및 외부 링크

- 외부로 이동하는 링크에는 `target="_blank"` 사용 시 반드시 `rel="noopener noreferrer"`를 함께 명시한다.
- 사용자 입력으로부터 동적으로 URL을 생성하는 경우 `javascript:` 프로토콜이 포함되지 않도록 검증한다.

```jsx
// 올바른 외부 링크
<a href={url} target="_blank" rel="noopener noreferrer">링크</a>
```

## 향후 백엔드 연동 시 고려 사항

- API 호출 시 인증 토큰(JWT 등)은 `localStorage`보다 `httpOnly` 쿠키 방식을 권장한다. (`localStorage`는 XSS에 취약)
- 민감한 데이터를 포함한 API 요청은 HTTPS를 사용한다.
- 에러 메시지에 서버 내부 정보(스택 트레이스, DB 구조 등)가 노출되지 않도록 처리한다.
- CORS 설정은 백엔드 담당이지만, 허용 출처를 와일드카드(`*`)로 열지 않도록 협의한다.
