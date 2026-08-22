#!/usr/bin/env bash
# Creates ~/.ssh/alhennawy_ovh (private) and .pub (paste this into OVH).
set -euo pipefail
KEY="$HOME/.ssh/alhennawy_ovh"
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
if [ -f "$KEY" ]; then
  echo "Key already exists: $KEY"
else
  ssh-keygen -t ed25519 -C "alhennawy-ovh" -f "$KEY" -N ""
fi
chmod 600 "$KEY"
chmod 644 "$KEY.pub"
echo
echo "Public key — add this in OVH (Public Cloud → Instance → SSH keys) or authorized_keys:"
echo
cat "$KEY.pub"
echo
echo "Then connect:"
echo "  ssh -i $KEY debian@51.79.65.181"
