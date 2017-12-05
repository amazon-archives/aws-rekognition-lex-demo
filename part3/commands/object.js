#! /usr/bin/env node

var _=require('lodash')

module.exports=function(labels){
    var did=labels
    .filter(x=>x.Confidence>85)

    var may=labels
    .filter(x=>x.Confidence>70 && x.Confidence<85)

    if((did.length+may.length)>0){
        var out=_.compact([
            did.length>0 ? "I saw "+list(did) : null,
            may.length>0 ? "I may have seen "+list(may) : null
        ]).join('. ')
        return out
    }else{
        return "Sorry, i do not know what i saw"
    }
}

function list(words){
    words=words.map(x=>a(x.Name))
    if(words.includes('a Person')){
        var words=words.filter(x=>!x.match('Person') & !x.match('People') & !x.match('Human'))
        var base="a person with "
        if(words.length===0){
            return "I saw a person"
        }else if(words.length===1){
            return base+words[0]
        }else if(words.length===2){
            return base+words.join(' and ')
        }else{
            return base+words.slice(0,-1).join(', ')+' and ' +words[words.length-1]
        }
    }else{
        if(words.length===1){
            return words[0]
        }else if(words.length===2){
            return words.join(' and ')
        }else{
            return words.slice(0,-1).join(', ')+' and ' +words[words.length-1]
        }
    }
}

function a(word){
    if(word.match('ing')){
        return word
    }else {
        if(['a','e','i','o','u'].includes(word[0].toLowerCase())){
            return "an "+word
        }else{
            return "a "+word
        }
    }
}
