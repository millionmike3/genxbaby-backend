FROM node:18-alpine

WORKDIR /app

# Copy ONLY the backend folder's package.json
COPY backend/package*.json ./

RUN npm install

# Copy ONLY the backend folder's source code
COPY backend/. .

RUN npm run build

CMD ["npm", "run", "start:prod"]
