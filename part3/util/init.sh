#! /bin/bash 

sox  -d \
    -t wavpcm \
    -c 1 -b 16 -r 16000 \
    -e signed-integer \
    --endian little \
    - noiseprof speech.noise-profile \
    trim 0 2 > tmp.txt
rm tmp.txt
