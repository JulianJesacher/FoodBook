FROM nginx:1.21.6-alpine

USER root

COPY apps/frontend/container/config.json.template /etc/angular/templates/
COPY apps/frontend/container/40-write-config.sh /docker-entrypoint.d/
COPY dist/apps/frontend /usr/share/nginx/html/

RUN chown -R nginx /var/run /run /var/cache /var/cache/nginx
RUN chown -R nginx /etc/nginx /etc/angular
RUN chown -R nginx /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.d/40-write-config.sh

VOLUME /usr/share/nginx/html
VOLUME /usr/share/nginx/html/assets

USER nginx
