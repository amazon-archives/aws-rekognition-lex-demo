module.exports={
  "Resources":Object.assign(
    require('./bot'),
    require('./cfn')
  ), 
  "Conditions": {},
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "creates Lex bot to interact with Rekognition",
  "Mappings": {},
  "Outputs": {
    "BotConsoleUrl":{
      "Value":{"Fn::Join":["",[
        "https://console.aws.amazon.com/lex/home?",
        "region=",{"Ref":"AWS::Region"},
        "#bot-editor:bot=",{"Ref":"Bot"}
      ]]}
    },
    "Bot": {
      "Value":{"Ref": "Bot"},
      "Export":{
        "Name":"REK-BOT"
      }
    }
  }
}
