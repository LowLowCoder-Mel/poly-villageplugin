FROM node:8.4
COPY . /app/duer-node
WORKDIR /app/duer-node
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 8015
CMD node /app/duer-node/app.js