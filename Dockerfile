FROM node:18-alpine

WORKDIR /app

# Copy ONLY the correct package.json (the one inside backend/backend)
COPY backend/backend/package*.json ./

RUN npm install

# Copy the actual backend source
COPY backend/backend/. .

# Build TypeScript → dist/
RUN npm run build

# Start the compiled app
CMD ["npm", "run", "start"]
