# Design

## 핵심 원칙

이 앱의 사용자는 **스마트폰을 막 받은 초등학교 3학년부터 디지털 기기에 익숙하지 않은 어르신까지** 포함한다.
예쁜 것보다 **편한 것**을 최우선으로 한다. 이해하기 어려운 UI 요소는 무조건 제거한다.

---

## 색상 팔레트

아래 색상만 사용한다. 새로운 색을 임의로 추가하지 않는다.

| 용도 | Tailwind 클래스 | 설명 |
|------|----------------|------|
| 주요 액션 (버튼 등) | `bg-blue-600`, `text-white` | 확정, 저장, 배정 등 |
| 위험 액션 (삭제 등) | `bg-red-600`, `text-white` | 삭제, 초기화 |
| 보조 액션 | `bg-gray-200`, `text-gray-800` | 취소, 뒤로가기 |
| 강조 배지 (전체참여) | `bg-blue-100`, `text-blue-800` | 정보성 배지 |
| 경고 배지 (특별미사) | `bg-yellow-100`, `text-yellow-800` | 특별 표시 |
| 미배정 | `text-red-600` | 배정되지 않은 항목 |
| 페이지 배경 | `bg-gray-50` | 전체 배경 |
| 카드 / 모달 배경 | `bg-white` | 컨텐츠 영역 |
| 기본 텍스트 | `text-gray-900` | 본문 |
| 보조 텍스트 | `text-gray-500` | 설명, 힌트 |
| 테두리 | `border-gray-200` | 구분선, 카드 테두리 |

**그라데이션 사용 금지.** `bg-gradient-*`, `from-*`, `to-*` 클래스를 사용하지 않는다.

---

## 타이포그래피

| 용도 | Tailwind 클래스 |
|------|----------------|
| 페이지 제목 | `text-2xl font-bold text-gray-900` |
| 섹션 제목 | `text-lg font-semibold text-gray-900` |
| 본문 | `text-base text-gray-900` |
| 보조 설명 | `text-sm text-gray-500` |
| 버튼 레이블 | `text-base font-semibold` |

- 최소 폰트 크기: `text-sm` (14px). 그 이하 사용 금지.
- 줄간격은 기본값(`leading-normal`) 이상을 유지한다.

---

## 터치 영역 및 간격

- 버튼, 선택 항목 등 모든 클릭/탭 가능한 요소의 최소 높이: `min-h-[48px]`
- 버튼 패딩: 최소 `px-4 py-3`
- 카드 / 목록 항목 내부 패딩: 최소 `p-4`
- 입력 필드 패딩: 최소 `px-3 py-3`
- 인접한 클릭 요소 사이 간격: 최소 `gap-3`

---

## 버튼

- 버튼에는 반드시 **텍스트 레이블**을 포함한다. 아이콘 단독 버튼 금지.
- 아이콘을 함께 사용하는 경우 텍스트 레이블을 반드시 병기한다.
- 주요 액션 버튼은 화면 하단 또는 폼 끝에 전체 너비(`w-full`)로 배치하는 것을 기본으로 한다.
- 비활성 버튼은 `opacity-50 cursor-not-allowed`로 표시한다.

```jsx
// 기본 버튼 예시
<button className="w-full min-h-[48px] px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg">
  저장
</button>
```

---

## 입력 필드

- 모든 입력 필드에 레이블(`<label>`)을 표시한다. placeholder만으로 용도를 표현하지 않는다.
- 입력 필드 높이: 최소 `min-h-[48px]`
- 테두리: `border border-gray-300 rounded-lg`
- 포커스 링: `focus:outline-none focus:ring-2 focus:ring-blue-500`

```jsx
<div className="flex flex-col gap-1">
  <label className="text-sm font-semibold text-gray-700">이름</label>
  <input
    className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
```

---

## 모달

- 배경 오버레이: `fixed inset-0 bg-black/50`
- 모달 본문: 화면 하단 또는 중앙 정렬, 최대 너비 `max-w-lg`
- 닫기 버튼은 우측 상단에 항상 표시하고 `✕` 문자 또는 "닫기" 텍스트를 사용한다.
- 모달 내부 스크롤이 필요한 경우 `overflow-y-auto max-h-[80vh]`를 적용한다.

---

## 네비게이션

- 탭 또는 버튼은 현재 활성 상태를 명확히 구분한다 (`border-b-2 border-blue-600 text-blue-600` vs `text-gray-500`).
- 메뉴 항목에는 아이콘 없이 텍스트만 사용하거나, 아이콘과 텍스트를 반드시 함께 사용한다.
- �뒤로 가기, 취소 등 이탈 경로는 항상 눈에 띄게 배치한다.

---

## 피드백 및 상태 표시

- 로딩 중: 버튼을 비활성화하고 "처리 중..." 텍스트를 표시한다.
- 성공: 간단한 텍스트 메시지 또는 색상 변화로 전달한다 (`text-green-600`).
- 오류: 입력 필드 아래에 `text-red-600 text-sm`으로 오류 메시지를 표시한다.
- 빈 상태: "아직 등록된 단원이 없습니다" 같은 안내 문구를 화면 중앙에 표시한다.

---

## 레이아웃

- 모바일 우선 설계. 기본 레이아웃은 1열 세로 배치.
- 최대 콘텐츠 너비: `max-w-2xl mx-auto px-4`
- 섹션 간 간격: `space-y-6` 이상
- 달력 그리드 등 불가피한 경우 외에는 가로 스크롤이 발생하지 않도록 한다.

---

## 금지 사항

- 그라데이션 (`bg-gradient-*`)
- 아이콘 단독 버튼 (레이블 없는 아이콘)
- 14px 미만 폰트
- hover에서만 보이는 액션 버튼 (모바일에서 hover 없음)
- 자동으로 사라지는 토스트 메시지 단독 사용 (어르신이 놓칠 수 있음)
- 여러 단계를 거쳐야 하는 중첩 드롭다운 메뉴
