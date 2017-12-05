var exec = require('promised-exec')
var aws=require('./aws')
var bucket="rekognition-demo-jcalho"
var url=require('url')
var api=url.parse("https://nsy5z736t9.execute-api.us-east-1.amazonaws.com/api")
var axios=require('axios')
var hash=require('hash-files')
var rek=new aws.Rekognition()
var sign=require('aws4').sign
var snap=require('./snap')
var Promise=require('bluebird')
var _=require('lodash')

module.exports=function(){
    var image=__dirname+'/tmp.png'
     
    return snap(image,bucket)            
    .then(()=>save(image))
    .tap(()=>exec("rm "+image))
    .catch(console.log)
}

if (require.main === module) {
    var image=__dirname+'/'+process.argv[2]
    console.log(image)
    
    save(image)
    .catch(console.log)
}

function save(image){
    var name=hash.sync({files:[image]})+'.jpeg'
    
    return exec("aws s3 cp "+image+" s3://"+bucket+'/'+name)
    .then(()=>rek.detectLabels(
        {Image:{S3Object:{
            Bucket:bucket,
            Name:name
        }}}
    ).promise())
    .tap(console.log)
    .tap(function(result){
        var Qs=_.filter(
            result.Labels,x=>x.Confidence>50)
        .map(x=>x.Name.toLowerCase())
        
        var A=_.filter(
            result.Labels,x=>x.Confidence<80 && x.Confidence>60)
        .map(x=>x.Name.toLowerCase()).concat(['image'])
        .join(' ')
        console.log(Qs)
        if(Qs.length>0){
            var imageUrl='http://'+bucket+'.s3-website-'+aws.config.region+'.amazonaws.com/'+name
            var body=[{
                qid:'image.'+name,
                q:Qs,
                a:A,
                r:{
                    title:'image',
                    imageUrl
                }
            }]
            var request={
                host:api.hostname,
                method:"PUT",
                url:api.href+'/'+name,
                path:api.path+'/'+name,
                body:JSON.stringify(body),
                data:body,
                headers:{
                    'content-type':'application/json'
                }
            }
            console.log(body)
            var signed=sign(request,aws.config.credentials)        
            return Promise.resolve(axios(signed))
        }else{
            return Promise.resolve()
        }
    }).get('Labels')
}
