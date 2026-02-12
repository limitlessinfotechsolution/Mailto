#!/bin/bash
DOMAIN=$1
if [ -z "$DOMAIN" ]; then
    echo "Usage: ./verify-domain.sh <domain>"
    exit 1
fi

echo "Verifying DNS records for $DOMAIN..."
dig +short MX $DOMAIN
dig +short TXT $DOMAIN
echo "Verification complete."
