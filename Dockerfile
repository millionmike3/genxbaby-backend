FROM node:18-alpine

WORKDIR /app

# Copy only backend package files
COPY backend/package*.json ./

RUN npm install

# Copy backend source
COPY backend/. .

# Build TypeScript → dist/
RUN npm run build

# Start the compiled app
CMD ["npm", "run", "start"]
