#!/bin/sh
# Builds the site and force-pushes dist/ to the gh-pages branch, which GitHub Pages serves.
set -eu
cd "$(dirname "$0")/.."
# the deploy commit is public: never sign it with a personal e-mail
email="86025857+eduardo-toste@users.noreply.github.com"
name="eduardo-toste"

if [ -n "$(git status --porcelain)" ]; then
  echo "Há mudanças sem commit; faça commit antes de publicar." >&2
  exit 1
fi
remote=$(git remote get-url origin)

npm run build
cd dist
[ -f index.html ] || { echo "Build sem index.html; abortando." >&2; exit 1; }
find . -name .DS_Store -delete
rm -rf .git
git init -q -b gh-pages
git -c user.email="$email" -c user.name="$name" add -A
git -c user.email="$email" -c user.name="$name" commit -qm "Deploy $(git -C .. rev-parse --short HEAD)"
git push -qf "$remote" gh-pages
rm -rf .git
echo "Publicado em https://eduardo-toste.github.io/portfolio/"
