var config=require('./config')
var name={
    name:'name',
    slotConstraint:"Optional",
    slotType:'AMAZON.US.FIRST_NAME",
    valueElicitationPrompt:{
        maxAttempts:1,
        messages:{
            content:"who?",
            contentType:"PlainText"
        }
    }
}
module.exports={
    "areThey":intents({
        name:"areThey",
        utterances:[
            "do you see {name}",
            "is {name} in the picture",
            "who do you see",
            "who is in the picture"
        ],
        slots:[name]
    }),
    "save":intents({
        name:"save",
        utterances:[
            "save this image",
        ]
    }),
    "describe":intents({
        name:"describe",
        utterances:[
            "who do you see",
        ]
    }),
    "hello":intents({
        name:"hello",
        utterances:[
            "hi {name}",
            "hello",
        ],
        slots:[name]
    }),
    "many":intents({
        name:"howMany",
        utterances:[
            "how many people do you see",
        ]
    }),
    "remember":intents({
        name:"remember",
        utterances:[
            "remember {name}"
        ],
        slots:[name]
    }),
    "thankYou":intents({
        name:"thankYou",
        utterances:[
            "thank you",
        ]
    }),
    "Bot": {
      "Type": "Custom::LexBot",
      "Properties": {
        "ServiceToken": {
          "Fn::GetAtt": ["CFNLambda","Arn"]
        },
        "name":{"Fn::Sub":"${AWS::StackName}-Bot"},
        "locale": "en-US",
        "voiceId": config.voiceId,
        "childDirected": false,
        "intents": [
            {"intentName": {"Ref": "areThey"},"intentVersion": "$LATEST"},
            {"intentName": {"Ref": "describe"},"intentVersion": "$LATEST"},
            {"intentName": {"Ref": "hello"},"intentVersion": "$LATEST"},
            {"intentName": {"Ref": "many"},"intentVersion": "$LATEST"},
            {"intentName": {"Ref": "remember"},"intentVersion": "$LATEST"},
            {"intentName": {"Ref": "thankYou"},"intentVersion": "$LATEST"},
            {"intentName": {"Ref": "save"},"intentVersion": "$LATEST"}
        ],
        "clarificationPrompt": {
          "maxAttempts": 5,
          "messages": [
            {
              "content": config.Clarification,
              "contentType": "PlainText"
            }
          ]
        },
        "abortStatement": {
          "messages": [
            {
              "content": config.Abort,
              "contentType": "PlainText"
            }
          ]
        }
      }
    }
}

function intent(opts){
    var out={
      "Type": "Custom::LexIntent",
      "Properties": {
        "ServiceToken": {
          "Fn::GetAtt": ["CFNLambda","Arn"]
        },
        "sampleUtterances":opts.utterances,
        "name":opts.name
        "fulfillmentActivity": {
          "type": "ReturnIntent"
        },
      }
    }
    if(opts.slots){
        out.Properties.slots=opts.slots
    }
    return out
}

