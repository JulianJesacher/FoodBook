FROM nginx:5027291eb45e

USER root

COPY apps/client/container/config.json.template /etc/angular/templates/
COPY apps/client/container/40-write-config.sh /docker-entrypoint.d/
COPY dist/apps/client /usr/share/nginx/html/

RUN chown -R nginx /var/run /run /var/cache /var/cache/nginx
RUN chown -R nginx /etc/nginx /etc/angular
RUN chown -R nginx /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.d/40-write-config.sh

USER nginx
