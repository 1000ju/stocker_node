# Stocker Node Backend

주식 학습·투자 습관 형성 앱의 백엔드입니다. Express + Sequelize 기반 REST API로 회원 인증부터 출석 퀴즈, 이론/퀴즈 학습, 오답노트, 투자 성향 진단까지 제공하며 Swagger(OpenAPI) 문서를 포함합니다.

## 프로젝트 개요
- **역할**: 학습형 모바일/웹 클라이언트를 위한 API 게이트웨이. JWT 기반 인증과 MySQL 8.0 영속 계층을 담당합니다.
- **주요 도메인**: 사용자/세션, 데일리 출석, 투자 성향 검사, 챕터·이론·퀴즈 학습, 메모, 오답노트.
- **문서화**: 루트 `openapi.yml`을 Swagger UI(`/api-docs`)로 노출하며 Basic Auth 로 잠글 수 있습니다.
- **배포 시나리오**: Dockerfile + `docker-compose.yml`로 앱과 MySQL 컨테이너를 동시에 올리거나, Node 20 런타임에서 직접 실행할 수 있습니다.

## 기술 스택
| 영역 | 사용 기술 |
| --- | --- |
| 런타임 | Node.js 20, Express 4 |
| 인증 | JWT(access/refresh), express-session(추후 확장 대비) |
| ORM/DB | Sequelize 6, MySQL 8.0 |
| 문서화 | Swagger UI, OpenAPI 3.0 (`openapi.yml`) |
| 인프라 | Docker, docker-compose, nodemon(dev) |

## 주요 기능
### 1. 인증 및 사용자 관리 (`src/user`)
- 이메일 기반 회원가입/로그인, bcrypt 해시 저장.
- Access/Refresh 토큰 발급, `Authorization: Bearer` + `x-refresh-token` 재발급 흐름.
- 내 프로필 정보 수정(`nickname`, `profile_image_url`, `age`, `occupation`, `provider`).

### 2. 데일리 출석 & 퀴즈 (`src/attendance`)
- 하루 1회 출석 퀴즈: 랜덤 3문제(O/X) 제공 → 정답 제출 시 출석 처리.
- 월별 출석 내역 조회로 습관 데이터 제공.

### 3. 투자 성향 검사 (`src/investment_profile`)
- `AssessmentMaster` 기반 설문 제공(`version=v1.1`).
- 응답 점수 → 4차원 타입(예: `CLPD`) 산출, `InvestmentProfile` 저장.
- 타입과 유사한 투자 거장(`InvestmentMaster`) 최대 5명 추천.
- 재검사(upsert)와 투자 거장 전체 목록 API 제공.

### 4. 학습 챕터 & 이론 (`src/chapter`, `src/theory`)
- 전체 챕터 목록과 개인 진도(`ChapterProgress`)를 묶어서 반환.
- 챕터 진입 시 이론 슬라이드 전체/현재 위치 전달, 페이지 이동/완료 상태 갱신.

### 5. 퀴즈 & 오답노트 (`src/quiz`, `src/wrong_note`)
- 챕터별 객관식 퀴즈 세트 제공, 진행 중 위치 저장.
- 퀴즈 완료 시 자동 채점, 오답만 `WrongNote` 테이블에 교체 저장.
- 오답노트 목록/삭제/재시도 표시, 개별 힌트 조회.

### 6. 학습 메모 (`src/memo`)
- 템플릿 유형(일지/복기/체크리스트/자유/재무제표)별 개인 메모 CRUD.

### 7. 공통 인프라
- JWT 인증 미들웨어, 세션 trust proxy 설정, CORS 화이트리스트, `/healthz | /readyz | /api/health` 헬스체크.

## 디렉터리 맵
```
src
├── app.js                 # Express 부트스트랩 + 공통 미들웨어 + Swagger
├── config/db.js           # MySQL 접속 정보 로더
├── middleware/auth...     # JWT 인증 및 재발급 처리
├── model/                 # Sequelize 모델 & index (자동 로더)
├── migrations/, seeders/  # sequelize-cli 마이그/시더
├── user/, attendance/, investment_profile/, memo/
├── chapter/, theory/, quiz/, wrong_note/  # 학습 도메인 라우터/서비스
└── utils/jwt.util.js      # 토큰 생성·검증 헬퍼
```
`init.sql` 및 `mysql/init.sql`는 MySQL 전체 스키마와 샘플 데이터를 한 번에 초기화할 때 사용할 수 있습니다.

## API 모듈 개요
| Base Path | 설명 | 하위 엔드포인트 |
| --- | --- | --- |
| `/api/user` | 회원가입/로그인/로그아웃/프로필 | `POST /signup`, `POST /login`, `POST /logout`, `POST /profile` |
| `/api/attendance` | 데일리 출석 퀴즈 | `GET /quiz/start`, `POST /quiz/submit`, `GET /history` |
| `/api/investment_profile` | 투자 성향 검사 | `GET /test`, `POST/GET/PUT /result`, `GET /masters` |
| `/api/chapters` | 챕터 목록 + 나의 진도 | `GET /` |
| `/api/theory` | 이론 슬라이드 진행 | `POST /enter`, `PATCH /progress`, `PATCH /complete` |
| `/api/quiz` | 챕터 퀴즈 진행 | `POST /enter`, `PATCH /progress`, `POST /complete`, `POST /hint` |
| `/api/memo` | 개인 학습 메모 | `GET /`, `PUT /`, `DELETE /:id` |
| `/api/wrong_note` | 오답노트 관리 | `GET/POST /mypage`, `POST /submit`, `DELETE /:quizId`, `PATCH /:quizId/retry` |

> 🔐 대부분의 라우터는 `Authorization: Bearer <accessToken>` 헤더가 필수이며, 토큰 만료 시 `x-refresh-token` 헤더를 함께 보내면 미들웨어가 자동으로 Access Token을 재발급해 `x-access-token` 헤더로 내려줍니다.

## 개발 환경 구성
1. **필수 도구**: Node.js 20+, npm 9+, MySQL 8.0 (또는 Docker), `sequelize-cli` (로컬 전역 설치 optional).
2. **의존성 설치**
   ```bash
   npm install
   ```
3. **환경 변수 작성**: 루트 `.env` 또는 `.env.production`에 아래 값을 채웁니다.
4. **DB 마이그레이션 & 시드** (MySQL이 기동된 상태)
   ```bash
   npm run migrate      # sequelize db:migrate
   npm run seed         # sequelize db:seed:all
   ```
   또는 `mysql -u root -p < init.sql`로 전체 스키마/샘플을 한 번에 생성할 수 있습니다.
5. **개발 서버**
   ```bash
   npm run dev          # nodemon src/server.js
   ```
6. **프로덕션 모드**
   ```bash
   npm start            # node src/server.js
   ```

## 환경 변수
| 변수 | 설명 |
| --- | --- |
| `PORT` | Express 리슨 포트 (기본 8080) |
| `SESSION_SECRET` | express-session 서명 키 |
| `ACCESS_SECRET`, `REFRESH_SECRET` | JWT 서명 키 |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_DIALECT` | MySQL 접속 정보 (`docker-compose` 사용 시 host 기본 `db`) |
| `CORS_ORIGIN` | 허용 오리진 CSV (예: `https://app.example.com,https://admin.example.com`) |
| `DOCS_USER`, `DOCS_PASS` | 설정 시 `/api-docs` Basic Auth 활성화 |
| `NODE_ENV` | `development`일 때만 상세 로그 출력 |

## Docker Compose로 실행
```bash
docker compose up --build
```
- `db` 서비스는 `.env`에 정의된 `MYSQL_*` 값을 사용합니다.
- `app` 서비스는 Dockerfile(Stage 빌드)로 이미지를 생성하고 `server.js`를 0.0.0.0:8080에 바인딩합니다.
- 컨테이너 기동 후 `http://localhost:8080/api/health` 혹은 `/api-docs`로 상태를 확인하세요.

## Swagger & 헬스체크
- Swagger UI: `GET /api-docs` (OpenAPI 스키마는 `openapi.yml`).
- 내부 헬스체크: `/healthz`, `/readyz`.
- 외부용 헬스체크: `/api/health`.

## 유용한 NPM 스크립트
| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | nodemon으로 핫 리로드 개발 서버 실행 |
| `npm start` | 프로덕션 모드 실행 (`src/server.js`) |
| `npm run migrate` / `npm run migrate:undo` | Sequelize 마이그레이션 적용/롤백 |
| `npm run seed` | 모든 시더 실행 (`src/seeders`) |

## 참고/확장 포인트
- `src/seeders`의 `YYYYMMDDXXXX-seed-*.js` 파일로 초기 챕터/이론/퀴즈 데이터를 버전 관리합니다.
- JWT 미들웨어가 refresh 토큰 재발급 시 `x-access-token` 헤더로 새 토큰을 내려주므로, 클라이언트는 헤더 교체 로직을 구현해야 합니다.
- 서버는 express-session을 기본으로 탑재했지만 현재 인증은 JWT 중심입니다. Redis와 같은 외부 스토어를 연결해 세션 기반 보호 라우트로 확장할 수 있습니다.
- `init.sql`을 통해 로컬 개발 DB를 빠르게 초기화한 뒤, 정식 환경에서는 sequelize-cli 마이그레이션을 권장합니다.

