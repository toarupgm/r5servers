const express = require('express')
const fs = require('fs')
var request = require('request');
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    var options = {
        uri: "https://r5a-comp-sv.herokuapp.com/servers",
        headers: {
            "Content-type": "application/json",
        },
        json: {
            "version": "VGameSDK002"
        }
    };
    request.post(options, function(error, response, body){
        if(body["success"])
        {
            res.render('index',{servers:body["servers"]})
        }
    });
})
app.get('/index.css', (req, res) => {
    content = fs.readFileSync("./views/index.css", 'utf8');
    res.send(content)
})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))