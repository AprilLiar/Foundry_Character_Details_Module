#!/usr/bin/env bash
# Builds the files of a Foundry release into an output folder (default: dist/):
#   <module id>.zip  the module, with module.json at the zip root as Foundry expects
#   module.json      the manifest of this release, uploaded next to the zip
#   version.txt      the release version
#
# Usage: package.sh <owner/repo> [output folder]
# Run from the repository root, with the full git history available.
#
# The version is "<major>.<minor>" from module.json plus the number of commits as the patch, so every
# commit gets a higher version than the last. To start a new minor or major version, edit "version" in
# module.json.
set -euo pipefail

REPO="${1:?usage: package.sh <owner/repo> [output folder]}"
OUT="${2:-dist}"

ID=$(jq -r .id module.json)
VERSION="$(jq -r .version module.json | cut -d. -f1,2).$(git rev-list --count HEAD)"
MANIFEST_URL="https://github.com/$REPO/releases/latest/download/module.json"
DOWNLOAD_URL="https://github.com/$REPO/releases/download/v$VERSION/$ID.zip"

rm -rf "$OUT"
mkdir -p "$OUT/pkg"

# Everything tracked by git goes into the module, except the release tooling itself
git archive HEAD -- . ':(exclude).github' | tar -x -C "$OUT/pkg"

# The manifest of the release points at this release's zip, and at the latest manifest for updates
jq --arg version "$VERSION" --arg manifest "$MANIFEST_URL" --arg download "$DOWNLOAD_URL" \
  '.version = $version | .manifest = $manifest | .download = $download' \
  module.json > "$OUT/pkg/module.json"

(cd "$OUT/pkg" && zip -qr "../$ID.zip" .)
cp "$OUT/pkg/module.json" "$OUT/module.json"
echo "$VERSION" > "$OUT/version.txt"
rm -rf "$OUT/pkg"

echo "Built $ID $VERSION in $OUT/"
