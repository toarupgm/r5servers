const express = require('express')
const fs = require('fs')
var request = require('request');
const path = require('path')
const PORT = process.env.PORT || 80

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    var request = require('request');

    var options = {
            url: 'https://raw.githubusercontent.com/Mauler125/r5sdk/5f56e5abd3f3df1c45bf3a07f64e91daaf2bc0dd/r5dev/tier0/basetypes.h',
        method: 'GET'
    }
    request(options, function (error, response, body) {
            const lines = body.split("\n");
            const vline = lines.filter((line) => {
                    return line.includes("#define SDK_VERSION");
            })[0]
            const version = vline.slice( vline.indexOf("\"")+1, vline.indexOf("\" //") );


            var options = {
                uri: "http://ms.r5reloaded.com/servers",
                headers: {
                    "Content-type": "application/json",
                },
                json: {
                    "version": version
                }
            };
            request.post(options, function(error, response, body){
                if(body["success"])
                {
                    res.render('index',{servers:body["servers"]})
                }
            });
    })


})
app.get('/index.css', (req, res) => {
    content = fs.readFileSync("./views/index.css", 'utf8');
    res.send(content)
})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))