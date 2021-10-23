FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN adduser -D openmusic && chown -R openmusic /app
USER openmusic
CMD ["npm","run start-prod"]