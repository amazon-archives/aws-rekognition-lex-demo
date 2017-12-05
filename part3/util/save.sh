#! /bin/bash
for file in ./images/*; do
    node ./save.js $file
done
