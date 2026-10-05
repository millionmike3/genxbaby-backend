FROM node:18-alpine

WORKDIR /app

# Copy the correct package.json
COPY backend/package*.json ./

RUN npm install

# Copy the actual backend source
COPY backend/. .

# Build TypeScript → dist/
RUN npm run build

# Start the compiled app
CMD ["npm", "run", "start"]
