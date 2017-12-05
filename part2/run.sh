#! /bin/bash
BUCKET="rekognition-demo-jcalho"

function labels {
imagesnap -w 1 -d "USB 2.0 Camera" face.png
aws s3 cp face.png s3://$BUCKET/face.png
rm face.png

aws rekognition detect-labels \
    --image "S3Object={Bucket=$BUCKET,Name=face.png}" \
    > ./part2/labels.json
}

function play {
    aws polly synthesize-speech     \
        --output-format mp3         \
        --voice-id Joanna           \
        --text "$1"                 \
        ./tmp.mp3 | jq

    afplay ./tmp.mp3
    rm ./tmp.mp3
}

labels &
play "I am looking" &

wait
TEXT=$(./part2/template.js)
rm labels.json

echo "text: $TEXT"
play "$TEXT"

