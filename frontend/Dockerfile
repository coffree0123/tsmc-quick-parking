FROM node:16.16.0-alpine3.16 AS build

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

ARG API_ROOT http://localhost:8000/api
ENV REACT_APP_API_ROOT ${API_ROOT}

RUN pnpm build

RUN pnpm prune --prod

FROM nginx:1.23.2-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d

CMD ["nginx", "-g", "daemon off;"]
