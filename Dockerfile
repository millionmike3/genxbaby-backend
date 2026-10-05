FROM node:18-alpine

WORKDIR /app

# 1. Copy ONLY backend package files FIRST
COPY backend/package*.json ./

# 2. Install dependencies
RUN npm install

# 3. Copy backend source AFTER dependencies
COPY backend/. .

# 4. Build TypeScript → dist/
RUN npm run build

# 5. Start the compiled app
CMD ["npm", "run", "start"]
