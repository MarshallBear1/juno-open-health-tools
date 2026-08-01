#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
plugin_dir="$repo_dir/plugins/juno-health-tools"
output_dir="$repo_dir/output/plugin"
archive_path="$output_dir/juno-health-tools-plugin-v0.2.0.zip"

mkdir -p "$output_dir"
rm -f "$archive_path"

cd "$plugin_dir"
zip -qr "$archive_path" . -x '.DS_Store'

printf '%s\n' "$archive_path"
