#!/bin/bash
# Loomin-Docs v2.0 - 100% Compliance Enterprise Deployment Script
# Target: RHEL 9 (Air-Gapped)
# Author: Anish Anto

set -e

echo "========================================================"
echo " Starting Loomin-Docs v2.0 FULL Enterprise Deployment"
echo "========================================================"

if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: Please run as root (sudo ./setup.sh)"
  exit 1
fi

echo "⏳ Verifying offline payloads..."
MISSING=0
for file in "offline_images/loomin-backend.tar" "offline_images/loomin-frontend.tar" "models/llama3-8b.gguf"; do
    if [ ! -f "$file" ]; then
        echo "❌ MISSING: $file"
        MISSING=1
    fi
done

if [ "$MISSING" -eq 1 ]; then
    echo "❌ Deployment aborted. Please ensure all payloads are present."
    exit 1
fi

echo "⏳ Loading Linux/AMD64 images into Docker cache..."
docker load -i offline_images/loomin-backend.tar
docker load -i offline_images/loomin-frontend.tar

echo "🚀 Launching Production Environment..."
docker run -d --name loomin-backend-v2 -p 8000:8000 -v $(pwd)/data:/app/data --restart always loomin-backend-v2-rhel9:latest
docker run -d --name loomin-frontend-v2 -p 80:80 --restart always loomin-frontend-v2-rhel9:latest

echo "========================================================"
echo "🎉 100% COMPLIANT DEPLOYMENT SUCCESSFUL"
echo "========================================================"