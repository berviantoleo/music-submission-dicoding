FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn --production
COPY lib/ lib/
COPY migrations/ migrations/
RUN adduser -D openmusic && chown -R openmusic /app
USER openmusic
CMD ["yarn","start-prod"]