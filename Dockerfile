FROM node:18-alpine

WORKDIR /app

# Copy ONLY backend package files FIRST
COPY backend/package*.json ./

RUN npm install

# Copy backend source AFTER dependencies
COPY backend/. .

# Build TypeScript → dist/
RUN npm run build

# Start the compiled app
CMD ["npm", "run", "start"]
