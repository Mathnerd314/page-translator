#!/bin/bash

echo -n "Enter version number: "
read versionNumber

zip "./dist/$versionNumber.zip" \
./background.js \
./icons/icon-128.png \
./icons/icon-16.png \
./icons/icon-32.png \
./icons/icon-48.png \
./icons/icon-96.png \
./icons/icon.svg \
./icons/LICENSE.txt \
./LICENSE.txt \
./manifest.json \
./options/options.html \
./options/options.js
