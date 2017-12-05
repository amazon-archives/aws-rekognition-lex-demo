#! /bin/bash
BUCKET="rekognition-demo-jcalho"

imagesnap -w 1 -d "USB 2.0 Camera" face.png
aws s3 cp face.png s3://$BUCKET/face.png
rm face.png

aws rekognition detect-labels \
    --image "S3Object={Bucket=$BUCKET,Name=face.png}" \
    | jq 
