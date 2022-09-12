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
                    const servers = body["servers"];
                    const players = [];
                    for (let i = 0; i < servers.length; i++) {
                        players.push(parseInt(servers[i]["playerCount"]))
                    }
                    var max = Math.max.apply(null,players);

                    for (let i = 0; i < servers.length; i++) {
                        servers[i]["top"] = servers[i]["playerCount"]==max;
                    }


                    const maps = {
                        "mp_rr_canyonlands_64k_x_64k":"King's Canyon Season 0",
                        "mp_rr_desertlands_64k_x_64k":"World's Edge Season 3",
                        "mp_rr_canyonlands_mu1":"King's Canyon Season 2",
                        "mp_rr_canyonlands_mu1_night":"King's Canyon Season 2 After Dark",
                        "mp_rr_desertlands_64k_x_64k_nx":"World's Edge Season 3 After Dark",
                        "mp_lobby":"Lobby Season 3",
                        "mp_rr_canyonlands_staging":"King's Canyon Firing Range",
                        "mp_rr_arena_composite":"Arena Map",
                        "mp_rr_aqueduct":"Drop Off",
                        "mp_rr_aqueduct_night":"Drop Off Night"
                    }
                    for (let i = 0; i < servers.length; i++) {
                        if(Object.keys(maps).includes(servers[i]["map"]))
                        {
                            servers[i]["displaymap"] = maps[servers[i]["map"]];
                        }else{
                            servers[i]["displaymap"] = "CustomMap: " + servers[i]["map"];
                        }
                    }
                    

                    res.render('index',{"servers":servers,"max":max})
                }
            });
    })


})
app.get('/index.css', (req, res) => {
    content = fs.readFileSync("./views/index.css", 'utf8');
    res.send(content)
})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))