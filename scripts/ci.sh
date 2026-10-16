#!/usr/bin/env bash
# Single entry point for CI. Detects the project type and runs build + tests.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f Package.swift ]]; then
  swift build
  swift test
  exit 0
fi

echo "No buildable project detected yet; nothing to test."
