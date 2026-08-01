#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_dir="$repo_dir/output/extension"
archive_path="$output_dir/juno-appointment-prep-extension-v1.0.0.zip"

mkdir -p "$output_dir"
rm -f "$archive_path"

cd "$repo_dir/extension"
zip -qr "$archive_path" . \
  -x 'test/*' \
  -x 'store-listing.md' \
  -x 'README.md'

printf '%s\n' "$archive_path"
