# ---------- 1️⃣ Dependencies ----------
FROM node:20.19-alpine3.21 AS deps
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    
    # ---------- 2️⃣ Builder ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # 👇 provide DATABASE_URL during build
    ARG DATABASE_URL
    ARG NEXTAUTH_URL
    ARG NEXTAUTH_SECRET
    ARG AUTH_TRUST_HOST
    ARG RESEND_API_KEY
    ENV DATABASE_URL=$DATABASE_URL
    ENV NEXTAUTH_URL=$NEXTAUTH_URL
    ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
    ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST
    ENV RESEND_API_KEY=$RESEND_API_KEY
    
    # Prisma client
    RUN npx prisma generate
    
    # Build Next.js
    RUN npm run build
    
    
    # ---------- 3️⃣ Production ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/prisma ./prisma
    
    EXPOSE 3000
    
    CMD ["npm","start"]