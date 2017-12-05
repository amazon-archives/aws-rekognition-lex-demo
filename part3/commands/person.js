#! /usr/bin/env node

var _=require('lodash')

module.exports=function(result){
    console.log(JSON.stringify(result,null,2))
    var emotions=result.Emotions
    
    var beard=is(result.Beard)
    var smile=is(result.Smile)
    var gender=is(result.Gender)
    var age=result.AgeRange

    var text="I see a "+(gender==="Male" ? "man" : "woman")
    text+=" who is between "+age.Low+" and "+age.High+" years old. "
    text+=(gender==="Male" ? "he" : "she")+" is "+(smile ? "smiling" : "not smiling")
    text+=" and appears to be "+list(emotions.map(x=>x.Type))+'.'
    return text
}

function is(obj){
    return obj.Confidence>90 ? obj.Value : false
}

function list(words){
    if(words.length===1){
        return words[0]
    }else if(words.length===2){
        return words.join(' and ')
    }else{
        return words.slice(0,-1).join(', ')+' and ' +words[words.length-1]
    }
}
