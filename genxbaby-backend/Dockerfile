FROM node:22-alpine

WORKDIR /app

# Copy package.json and lock file
COPY genxbaby-backend/package*.json ./

RUN npm install

# Copy the rest of the backend
COPY genxbaby-backend/. .

RUN npm run build

CMD ["npm", "start"]
