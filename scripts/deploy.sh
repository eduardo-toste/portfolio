#!/bin/sh
# Builds the site and force-pushes dist/ to the gh-pages branch, which GitHub Pages serves.
set -e
cd "$(dirname "$0")/.."
remote=$(git remote get-url origin)
email=$(git config user.email)
name=$(git config user.name)

npm run build
cd dist
rm -rf .git
git init -q -b gh-pages
git -c user.email="$email" -c user.name="$name" add -A
git -c user.email="$email" -c user.name="$name" commit -qm "Deploy $(git -C .. rev-parse --short HEAD)"
git push -qf "$remote" gh-pages
rm -rf .git
echo "Publicado em https://eduardo-toste.github.io/portfolio/"
