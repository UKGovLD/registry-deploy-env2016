FROM nginxinc/nginx-unprivileged:1.21-alpine

RUN mkdir -p /etc/nginx/conf.d/registry \
  && mkdir -p /tmp/nginx/cache

COPY nginx-server.conf.template /etc/nginx/templates/default.conf.template
COPY proxy-env-registry.conf /etc/nginx/conf.d/registry/proxy-env-registry.conf
COPY nginx-cache.conf /etc/nginx/conf.d/nginx-cache.conf
