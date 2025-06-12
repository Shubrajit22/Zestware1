FROM node:22-alpine3.18

WORKDIR /app


COPY package*.json ./

COPY prisma ./prisma

RUN npm install

RUN npx prisma generate


COPY . .

EXPOSE 3000

CMD ["node", "dist/index.js"]
