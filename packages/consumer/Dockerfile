FROM node:14-alpine as build
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY src/ src/
COPY tsconfig.json tsconfig.json
RUN yarn build

FROM node:14-alpine as runtime
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --production
COPY --from=build lib/ lib/
CMD ["yarn", "start"]