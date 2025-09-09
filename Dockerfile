# ---------- deps ----------
    FROM node:20-alpine AS deps
    WORKDIR /app
    # 네이티브 모듈 대비 빌드툴 (bcrypt 등)
    RUN apk add --no-cache python3 make g++ libc6-compat
    COPY package*.json ./
    RUN npm ci 
    
    # ---------- runner ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    USER node
    
    # 앱 소스 & 의존성 복사
    COPY --chown=node:node . .
    COPY --from=deps --chown=node:node /app/node_modules /app/node_modules
    
    EXPOSE 8080
    
    # /healthz가 있다면 헬스체크 활성화, 없다면 아래 라인 주석 처리
    HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD \
      node -e "require('http').get('http://localhost:8080/healthz', r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
    
    CMD ["node", "server.js"]
    