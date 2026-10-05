FROM node:18-alpine

WORKDIR /app

COPY genxbaby-backend/package*.json ./
RUN npm install

COPY genxbaby-backend/. .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
