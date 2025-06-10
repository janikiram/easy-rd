# EasyRD.web

본 프로젝트는 EasyRD의 웹 서비스를 위한 프로젝트입니다.

해당 프로젝트는 cloudflare pages를 통해 배포되고 있습니다.
이에 d1과 그 외 cf의 기능을 사용하기 위해 로컬 개발 환경에서는 miniflare를 사용하고 있습니다.
반드시 시작 가이드를 참고해주세요.

## 환경 변수

.env 파일을 통해 환경 변수를 설정할 수 있습니다. [link](https://www.notion.so/goodgoodman/env-9d5017c1b2834e4cbbf8e73667689c58?pvs=4)

## 시작 가이드

```bash
npm ci
npm run migration:apply
npm run dev # 개발 서버 시작
npm run storybook # 스토리북 시작
```
