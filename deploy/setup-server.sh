#!/usr/bin/env bash
# One-time VPS bootstrap. Installs Docker and the compose folder. Does not copy source.
set -euo pipefail
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
fi
mkdir -p /opt/alhennawy-erp
if command -v ufw >/dev/null 2>&1; then
  ufw allow 80/tcp || true
  ufw allow 443/tcp || true
  ufw allow 443/udp || true
fi
echo "Docker ready. First image arrives from GitHub Actions."
