ARG NGINX_BASE=registry.cn-qingdao.aliyuncs.com/wod/nginx:1.27

FROM ${NGINX_BASE}

ARG AUTHOR
ARG VERSION
LABEL maintainer=${AUTHOR} version=${VERSION}

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 8087
