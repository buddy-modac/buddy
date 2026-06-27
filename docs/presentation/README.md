# Buddy 발표 자료 초안

내일 오후 발표를 위한 16:9 정적 발표 페이지입니다.

## GitHub Pages

main 브랜치에 push되면 GitHub Actions가 `docs/presentation` 폴더를 GitHub Pages로 배포합니다.

https://buddy-modac.github.io/buddy/

## 열기

```bash
open index.html
```

또는 로컬 서버로 확인합니다.

```bash
python3 -m http.server 4173
open http://localhost:4173
```

## PDF 저장

페이지 오른쪽 상단의 `PDF 저장` 버튼을 누른 뒤 브라우저 인쇄 창에서 다음처럼 저장합니다.

- Destination: Save as PDF
- Paper size: CSS page size, 16:9, 또는 Custom
- Margins: None
- Background graphics: On

`@page`가 `297mm x 167.0625mm`로 설정되어 있어 PDF 한 페이지에 슬라이드 한 장이 16:9 비율로 들어가도록 구성했습니다.
인쇄 창에서 A4/Letter를 강제로 선택하면 브라우저가 페이지를 다시 맞추며 비율이 달라질 수 있습니다.

## 발표 모드

상단의 `전체화면` 버튼을 누르면 현재 슬라이드만 보이는 발표 모드로 전환됩니다.
브라우저가 native fullscreen을 막는 경우에도 페이지 내부 발표 모드로 fallback됩니다.

## 시연 영상 연결

시연 영상이 준비되면 `assets/demo.mp4`를 추가한 뒤, `index.html`의 Demo Plan 슬라이드에서 placeholder를 `<video>` 태그로 바꾸면 됩니다.
