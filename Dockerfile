FROM node:21.6

RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 4321

CMD npx prisma migrate deploy && pnpm start
