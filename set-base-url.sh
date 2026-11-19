#!/usr/bin/env bash
# Usage: ./set-base-url.sh https://yourname.github.io/outlook-spinner-signature
set -euo pipefail
NEW="${1%/}"
sed -i.bak "s#https://YOUR-GITHUB-USERNAME.github.io/outlook-spinner-signature#${NEW}#g" manifest.xml && rm -f manifest.xml.bak
echo "manifest.xml now points to ${NEW}"
