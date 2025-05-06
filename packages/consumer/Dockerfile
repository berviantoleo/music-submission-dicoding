FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN yarn --production
COPY lib/ lib/
RUN adduser -D openmusicconsumer && chown -R openmusicconsumer /app
USER openmusicconsumer
CMD ["yarn", "start"]