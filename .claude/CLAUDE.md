# AcolyteScheduler

## 프로젝트 개요

천곡동 성당 어린이 복사단의 월간 미사 일정표를 자동으로 생성·공유하는 React 기반 SPA.
복사단장이 수기로 관리하던 단원 배정 업무를 자동화하여 시간과 노력을 절감한다.

**제안자:** 2216 최선재 | **제안일:** 2026-04-04

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| UI 프레임워크 | React (SPA) |
| 언어 | JavaScript |
| 스타일링 | Tailwind CSS |
| 상태 관리 | React Context API |
| 라우팅 | React Router v6 |
| 이미지 저장 | html2canvas |
| 빌드 도구 | Vite |
| 버전 관리 | Git / GitHub |

---

## 폴더 구조

```
src/
├── main.jsx
├── App.jsx                  # 라우터 설정
├── context/
│   └── SchedulerContext.jsx # 전역 상태 관리
├── pages/
│   ├── CalendarPage.jsx     # / (메인 달력)
│   ├── MembersPage.jsx      # /members
│   └── SchedulePage.jsx     # /schedule
├── components/
│   ├── CalendarView.jsx
│   ├── MemberManager.jsx
│   ├── UnavailableDatePicker.jsx
│   ├── AutoScheduler.jsx
│   └── EditModal.jsx
├── utils/
│   └── scheduler.js         # 자동 배정 알고리즘 (순수 함수)
└── hooks/
    └── useScheduler.js      # Context 접근 커스텀 훅
```

---

## 라우팅 구조

```jsx
// App.jsx
<Routes>
  <Route path="/"          element={<CalendarPage />} />   // 달력 뷰 (기본)
  <Route path="/members"   element={<MembersPage />} />    // 단원 관리
  <Route path="/schedule"  element={<SchedulePage />} />   // 자동 배정
</Routes>
```

- 네비게이션은 상단 공통 헤더에 탭 형태로 제공
- 존재하지 않는 경로는 `/`로 리다이렉트

---

## 데이터 구조 (스키마)

```js
// 단원
Member = {
  id: string,            // uuid (crypto.randomUUID())
  name: string,          // 이름
  role: 'senior' | 'junior' | 'temp', // 대복사 | 소복사 | 임시복사
  prevCount: number,     // 전월 미사 참여 횟수
  unavailableDates: string[], // 참여 불가 날짜 ["2026-05-03", ...]
}

// 미사 배정 단위
Assignment = {
  date: string,          // "2026-05-04"
  massTime: string,      // "10:30" (기본값)
  senior: string | null, // Member.id
  junior: string | null, // Member.id
  temp: string | null,   // Member.id (Optional)
  isSpecial: boolean,    // 특별 미사 여부
  isAllAttend: boolean,  // 첫째 주 금요일 전체 참여 여부
  extraSenior: string | null, // 특별 미사 추가 대복사 id
  extraJunior: string | null, // 특별 미사 추가 소복사 id
}

// 전역 상태
SchedulerState = {
  members: Member[],
  assignments: Assignment[],  // 현재 월 배정 결과
  currentYear: number,
  currentMonth: number,       // 1~12
}
```

---

## 전역 상태 (Context)

```jsx
// context/SchedulerContext.jsx 가 제공하는 값
{
  // 상태
  state: SchedulerState,

  // 단원 액션
  addMember(member),
  updateMember(id, partial),
  deleteMember(id),

  // 불가 날짜 액션
  toggleUnavailableDate(memberId, dateStr),   // 있으면 제거, 없으면 추가

  // 배정 액션
  runAutoSchedule(),                           // 자동 배정 실행
  updateAssignment(date, partial),             // 수동 수정
  toggleSpecialMass(date),                     // 특별 미사 토글

  // 월 이동
  setMonth(year, month),
}
```

- 상태 초기값은 `localStorage`에 저장하여 새로고침해도 유지
- Context 접근은 반드시 `useScheduler()` 훅을 통해서만 (직접 useContext 사용 금지)

---

## 자동 배정 알고리즘 (`utils/scheduler.js`)

### 입력
```js
runSchedule(members, year, month)
// → Assignment[]
```

### 처리 순서

1. **해당 월의 미사 날짜 목록 생성**
   - 매주 일요일 (교중 미사)
   - 매주 금요일 (평일 미사)

2. **첫째 주 금요일 표시**
   - `isAllAttend: true` 로 설정, 배정 알고리즘 스킵 (전원 참여)

3. **일요일·금요일 각 날짜에 대해 배정 수행**
   - 가용 단원 필터: `unavailableDates`에 해당 날짜가 없는 단원만 사용
   - 대복사 후보: `role === 'senior'` 이고 가용한 단원, `prevCount` 오름차순 정렬
   - 소복사 후보: `role === 'junior'` 이고 가용한 단원, `prevCount` 오름차순 정렬
   - 각 후보 중 첫 번째를 배정하고, 배정된 단원의 **이번 달 배정 횟수**를 내부 카운터로 추적하여 다음 날짜에 반영

4. **임시복사 배정**
   - `role === 'temp'` 단원이 있을 경우, 가용한 날짜 중 배정 횟수가 가장 적은 날에 추가

5. **특별 미사 처리**
   - `isSpecial: true`인 날짜는 `extraSenior`, `extraJunior`에 추가 배정
   - 초기 자동 배정 시 특별 미사는 없음 (복사단장이 수동으로 토글)

### 엣지 케이스

| 상황 | 처리 방법 |
|------|-----------|
| 가용 대복사가 없는 날 | `senior: null` 로 배정, 달력에 "미배정" 표시 (빨간색) |
| 가용 소복사가 없는 날 | `junior: null` 로 배정, 달력에 "미배정" 표시 (빨간색) |
| prevCount 동점 | id 문자열 오름차순으로 tie-break (결정론적 결과 보장) |
| 단원이 0명 | 빈 Assignment 배열 반환, UI에서 안내 메시지 표시 |
| 특별 미사인데 추가 가용 인원 없음 | `extraSenior / extraJunior: null`, "미배정" 표시 |

---

## 컴포넌트 명세

### `CalendarView`
- 7열 그리드로 해당 월 달력 렌더링
- 각 날짜 셀: 미사 시간, 대복사 이름, 소복사 이름, 임시복사 이름(있을 때)
- `isAllAttend` → 셀 상단에 "전체참여" 배지 (파란색)
- `isSpecial` → 셀 배경색 변경 (노란색)
- 미배정(`null`) → 이름 자리에 "미배정" 텍스트 (빨간색)
- 날짜 셀 클릭 → `EditModal` 오픈

### `MemberManager`
- 단원 목록을 카드 형태로 렌더링
- 카드 정보: 이름, 역할 배지, 전월 참여 횟수
- "단원 추가" 버튼 → 입력 폼 모달
- 카드 내 수정·삭제 버튼
- 역할: 드롭다운 (`senior` / `junior` / `temp`)
- 참여 횟수: 숫자 입력 (0 이상 정수, 음수 입력 불가)

### `UnavailableDatePicker`
- 상단 드롭다운으로 단원 선택
- 선택된 단원의 해당 월 달력 표시
- 날짜 클릭 → `toggleUnavailableDate` 호출
- 불가 날짜: 빨간 배경으로 강조
- 모바일 터치 이벤트 별도 처리 (`onTouchEnd` 사용, `onClick`과 중복 방지)

### `AutoScheduler`
- "자동 배정 시작" 버튼 클릭 → `runAutoSchedule()` 호출
- 배정 결과를 목록 형태로 미리보기 (날짜 / 대복사 / 소복사)
- "확정" 버튼 → Context에 반영 후 `/`로 이동
- "다시 배정" 버튼 → `runAutoSchedule()` 재실행
- 미배정 항목은 빨간 텍스트로 표시

### `EditModal`
- `CalendarView`에서 날짜 클릭 시 오픈
- 수정 가능 항목: 미사 시간, 대복사, 소복사, 임시복사, 특별 미사 여부
- 단원 선택: 드롭다운 (전체 단원 목록 표시, "없음" 옵션 포함)
- 특별 미사 토글 ON → `extraSenior`, `extraJunior` 드롭다운 추가 렌더링
- "저장" 버튼 → `updateAssignment()` 호출 후 모달 닫힘
- 배경 클릭 또는 ESC 키 → 저장 없이 닫힘

---

## 공유 기능

### 링크 공유
```js
// 현재 년/월을 쿼리 파라미터로 전달
const url = `${window.location.origin}/?year=${year}&month=${month}`
navigator.clipboard.writeText(url)
```
- 링크 접속 시 해당 월 달력을 바로 표시 (쿼리 파라미터 파싱)

### 이미지 저장
```js
import html2canvas from 'html2canvas'

html2canvas(document.getElementById('calendar-view'), {
  scale: 2,        // 고해상도
  useCORS: true,
}).then(canvas => {
  const link = document.createElement('a')
  link.download = `복사단일정표_${year}_${month}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
})
```

---

## 코딩 컨벤션

- 컴포넌트: **PascalCase** (`CalendarView.jsx`)
- 유틸 함수: **camelCase** (`scheduler.js`)
- 날짜 문자열 포맷: 항상 `"YYYY-MM-DD"` (ISO 8601)
- Context 직접 접근 금지 → `useScheduler()` 훅만 사용
- 순수 함수는 `utils/`에, 사이드이펙트가 있는 로직은 `hooks/`에
- CSS 클래스는 Tailwind 유틸리티만 사용 (별도 CSS 파일 작성 금지)
- `console.log` 커밋 금지

> 세부 규칙은 아래 파일을 **반드시** 참고할 것:
> - [`rules/code-style.md`](./rules/code-style.md) — 코드 스타일 상세 규칙
> - [`rules/security.md`](./rules/security.md) — 보안 관련 주의사항
> - [`rules/testing.md`](./rules/testing.md) — 테스트 작성 기준
> - [`rules/design.md`](./rules/design.md) — UI/UX 디자인 규칙

---

## 개발 일정

| 주차 | 기간 | 작업 |
|------|------|------|
| 1주 | ~4/11 | 기획 확정, 와이어프레임, 환경 세팅 |
| 2주 | ~4/18 | 프로젝트 구조 설계, Router·Context 세팅 |
| 3주 | ~4/25 | `MemberManager` 개발 |
| 4주 | ~5/2 | `UnavailableDatePicker` 개발 |
| 5주 | ~5/9 | `AutoScheduler` + 자동 배정 알고리즘 |
| 6주 | ~5/16 | `CalendarView` 개발 |
| 7주 | ~5/23 | `EditModal` 개발 및 컴포넌트 연동 |
| 8주 | ~5/30 | 이미지 저장·링크 공유, 반응형 점검 |
| 9주 | ~6/6 | 전체 기능 테스트 및 버그 수정 |
| 10주 | ~6/13 | 코드 정리, 최종 제출 준비 |