#!/usr/bin/env bash
# Single entry point for CI: install, unit tests, build, end-to-end tests.
set -euo pipefail

cd "$(dirname "$0")/.."

npm ci
npm test
npm run build
npx playwright install --with-deps webkit
npm run test:e2e
