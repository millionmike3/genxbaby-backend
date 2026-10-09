FROM node:22-alpine

WORKDIR /app

# Install root dependencies (if any)
COPY genxbaby-backend/package*.json ./
RUN npm install

# Install backend dependencies
COPY genxbaby-backend/backend/package*.json ./backend/
RUN cd backend && npm install

# Copy the rest of the backend
COPY genxbaby-backend/. .

# Build backend
RUN cd backend && npm run build

CMD ["node", "backend/dist/main.js"]
