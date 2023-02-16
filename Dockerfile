FROM node:lts-alpine AS builder

ARG NPM_TOKEN
RUN npm install -g npm

WORKDIR /builder
COPY .npmrc .npmrc
COPY package* ./
RUN npm install -D
COPY . .
RUN npm run build

FROM node:lts-alpine

ARG NPM_TOKEN
ENV NODE_ENV production
ENV SERVICE_NAME collector

WORKDIR /src
COPY --from=builder /builder/package* ./
COPY .npmrc .npmrc
RUN npm install
COPY --from=builder /builder/built ./built
RUN rm -f .npmrc

CMD npm run start
