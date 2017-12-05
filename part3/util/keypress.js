var keypress = require('keypress');
var promise=require('bluebird') 
// make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);

// listen for the "keypress" event 
module.exports=function(){
    return new Promise(function(res,rej){
        process.stdin.on('keypress', function (ch, key) {
            if( key.name==='space'){
                res()
                process.stdin.pause()
            }
        });
        process.stdin.setRawMode(true);
        process.stdin.resume();
    })
}

