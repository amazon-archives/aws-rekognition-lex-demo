var player=require('../util/play')
var look=require('../util/look')
var exec = require('child_process').exec
var object=require('./object')
var Promise=require('bluebird')
var person=require('./person')
var open=require('open')
var save=require('../util/save')
var _=require('lodash')

module.exports={
    thankYou:function(result){
        return player.play("your welcome")
    },
    save:function(result){
        return save()
        .then(function(labels){
            var did=labels.filter(x=>x.Confidence>85)

            if((did.length)>0){
                var out=_.compact([
                    did.length>0 ? "I saved an image of "+list(did) : null
                ]).join('. ')
                return player.play(out)
            }else{
                return player.play("Sorry, i do not know what i saw")
            }
        })
    },
    many:function(result){
        return look.many().then(function(x){
            if(x===0){
                return player.play('i see no people')
            }else if(x===1){
                return player.play('i see one person')
            }else{
                return player.play('i see '+x+' people')
            }
        })
    },
    image:function(result){
        var params=result.slots
        var card=result.sessionAttributes

        if(card && card.appContext){
            var url=JSON.parse(card.appContext).responseCard.genericAttachments[0].imageUrl
            console.log(url)
            open(url)
            player.play('here')
        }else if(!result.message.match('ask me again')){
            if( result.inputTranscript.match('show me') ){
                return player.play('Sorry, I have not seen that')    
            }else{
		        return player.play(result.message)	
            }
        }else{
            return player.play('sorry, i do not know that')
        }
    },
    areThey:function(result){
        var params=result.slots
        return look.image().then(()=>look.recall())
        .then(function(result){
            console.log(result)
            if(result.length===0){
                if(params.name){
                    return player.play("I do not see "+params.name)
                }else{
                    return player.play("I do not recognize the person in the image")
                }
            }else{
                var name=result[0].Face.ExternalImageId
                if(params.name){
                    if(name===params.name){
                        return player.play("yes, i see "+name)
                    }else{
                        return player.play("I do not see "+params.name+",but i do see "+name)
                    }
                }else{
                    return player.play("I see "+name)
                }
            }
        })
        .catch(err=>err.message.match(/no faces in the imag/),
            ()=>player.play("I do not see anybody")
        )
    },
    remember:function(result){
        var params=result.slots
        return look.image().then(()=>look.remember(params.name))
        .then(()=>player.play("ok, I now know "+params.name))
    },
    hello:function(result){
        var params=result.slots
        if(params.voice){
            var voice=params.voice[0].toUpperCase()+params.voice.slice(1)
            if(["Russell","Matthew","Brian","Amy","Justin","Joey","Kendra"].indexOf(voice)>0){
                player.voice(voice)
                return player.play('hi')
            }else{
                return player.play('I do not know '+voice)
            }
        }else{
            return player.play('hi, my name is '+player.name)
        }
    },
    describe:function(result){
        var params=result.slots
        return  look.image().then(()=>look.labels())
            .then(function(labels){
                if(labels.find(x=>x.Name==="Person")){
                    return Promise.join(
                        look.faces(),
                        player.play("I saw a person")
                    )
                    .spread(function(response){
                        console.log(response)
                        var text=person(response)
                        return player.play(text)
                    })
                }else{
                    var text=object(labels)
                    return player.play(text)
                }
            })
    },
    isthere:function(result){
        var params=result.slots
        console.log(result)
        return look.image().then(()=>look.labels())
            .then(function(labels){
                var yes=labels.map(x=>x.Name.toLowerCase()).includes(params.item)
                if(yes){
                    return player.play('yes i see a '+params.item)
                }else{
                    return player.play('no i did not see a '+params.item)
                }
            })
    }
}

function list(words){
    words=words.map(x=>a(x.Name))
    if(words.length===1){
        return words[0]
    }else if(words.length===2){
        return words.join(' and ')
    }else{
        return words.slice(0,-1).join(', ')+' and ' +words[words.length-1]
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
