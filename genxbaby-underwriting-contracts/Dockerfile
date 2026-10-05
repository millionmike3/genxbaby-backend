FROM node:22

WORKDIR /app

COPY . .

RUN npm install

CMD ["npx", "hardhat", "run", "scripts/deploy.js", "--network", "amoy"]
