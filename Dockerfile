FROM node:11-alpine

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "run", "start"]
