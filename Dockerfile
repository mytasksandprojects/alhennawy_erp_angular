# Final image is Caddy + the Angular production build only. Source is never copied.
FROM caddy:2.10-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY dist/alhennawy-erp/browser /usr/share/caddy
