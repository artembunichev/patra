#!/bin/sh

npx vite build \
&& mkdir dist/main \
&& cp main.js dist/main/index.js \
&& echo "main.js -> dist/main/index.js" \
&& cp preload.js dist/main/ \
&& echo "preload.js -> dist/main/preload.js" \
&& echo '{"type": "commonjs"}' > dist/main/package.json \
&& echo "dist/main/package.json."
