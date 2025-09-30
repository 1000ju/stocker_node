# ---------- deps (install/build native deps once, cacheable) ----------
  FROM node:20-alpine AS deps
  WORKDIR /app
  
  # native 모듈(bcrypt 등) 빌드 도구 (build 단계에만 필요)
  RUN apk add --no-cache python3 make g++ libc6-compat
  
  # 1) 의존성 레이어: package.json만 먼저 복사 -> npm ci 캐시 재사용
  COPY package*.json ./
  
  # 프로덕션 의존성만 설치 (dev 제외)
  RUN npm ci --omit=dev
  
  # ---------- runner (lean runtime) ----------
  FROM node:20-alpine AS runner
  WORKDIR /app
  
  # 런타임에만 필요한 C 호환 계층 (bcrypt 등 일부 바이너리 의존)
  RUN apk add --no-cache libc6-compat
  
  ENV NODE_ENV=production
  # 필요하면 포트 수정 (앱이 8080을 리슨해야 함)
  ENV PORT=8080
  
  # 소스 코드만 복사 (node_modules는 deps에서 가져옴)
  # .dockerignore로 불필요 파일이 제외되어야 함
  COPY --chown=node:node . .
  
  # deps 단계에서 설치한 node_modules 복사
  COPY --from=deps --chown=node:node /app/node_modules /app/node_modules
  
  # 실행 사용자 권한 다운그레이드(보안)
  USER node
  
  # 헬스체크(엔드포인트가 있을 때만 유지)
  #EXPOSE 8080
  #HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD \
   # node -e "require('http').get('http://localhost:${process.env.PORT||8080}/healthz', r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
  
  # OCI label(패키지-레포 연결용; OWNER/REPO 맞게 수정)
  LABEL org.opencontainers.image.source="https://github.com/1000ju/stocker_node"
  
  CMD ["node", "server.js"]
  