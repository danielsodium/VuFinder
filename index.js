const clientId = 'cxzq8kyu04af1pelv56g6avjbnkp1l';
const accessToken = 'zj7o9na1v6nw4os8ccd53nhsoexayh';
const https = require('https');
const syllable = require('syllable')

const webhook = require("webhook-discord")
const Hook = new webhook.Webhook("https://canary.discord.com/api/webhooks/818645004229541889/IrUj38V04qhKUE4e9Nfff3AyR4HA-fjYzxsMDHLDqUQzVQ5mJGV7B6Q5nF9m_cdXV1Cf")

var found = [];
const gamesToCheck = ["Company%20of%20Heroes%202", "Heroes%20of%20the%20Storm", "Hell%20Let%20Loose"]
const gameNames = ["Company of Heroes 2", "Heroes of the Storm", "Hell Let Loose"]

function doRequest(options) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let responseBody = '';
  
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
  
        res.on('end', () => {

            JSON.parse(responseBody).streams.forEach((element) => {
                if (element.channel.name.toLowerCase().charAt(0) == 't') {
                    if (syllable(element.channel.name) == 3) {
                        newJson = {"url" : "https://twitch.tv/"+element.channel.name,
                        "username" : element.channel.name,
                        "viewers" : element.viewers}
                        if (found.length == 0 || found.find(e => e.username === element.channel.name) == undefined) {
                            found.push(newJson)
                        }
                    }
                }
            });
            resolve(JSON.parse(responseBody));
        });
      });
  
      req.on('error', (err) => {
        reject(err);
      });
      req.end();
    });
  }

  var index = 0;
function doIt() {
    // return the response
    gamesToCheck.forEach(async (game) => {
        for (var i = 0; i < 5; i++) {
            const options = {
                hostname: 'api.twitch.tv',
                path: '/kraken/streams/?limit=100&stream_type=live&game='+game+"&offset="+i,
                headers: {
                    "Client-ID": clientId,
                    "Accept" : "application/vnd.twitchtv.v5+json"
                }
            }
            var info = await doRequest(options);
            
        }
        index++
        if (index === 3) {
            
            if (found.length == 0) {
                var msg = new webhook.MessageBuilder()
                .setName("Vu Finder")
                .setColor("#bc2edb")
                .setTitle("No twitch user found")
                Hook.send(msg);

            } else {
                found.forEach(element => {
                    var msg = new webhook.MessageBuilder()
                    .setName("Vu Finder")
                    .setColor("#bc2edb")
                    .setTitle("Found user " + element.username)
                    .setURL(element.url)
                    .setDescription("Playing for "+ element.viewers+ " viewers")
                    Hook.send(msg);

                });

            }
        }
    })
}


doIt()
/*

gamesToCheck.forEach((element, index) => {
    for (var i = 0; i < 5; i++) {
        const options = {
            hostname: 'api.twitch.tv',
            path: '/kraken/streams/?limit=100&stream_type=live&game='+index+"&offset="+index,
            headers: {
                "Client-ID": clientId,
                "Accept" : "application/vnd.twitchtv.v5+json"
            }
        }
        console.log(i)

        https.get(options, (res) => {
            data = "";
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                var info = JSON.parse(data);
                info.streams.forEach((element) => {
                    if (element.channel.name.toLowerCase().charAt(0) == 't') {
                        console.log(element.channel.name)
                        if (syllable(element.channel.name) <= 4 && syllable(element.channel.name) >= 2) {
                        found.push({"url" : "https://twitch.tv/"+element.channel.name,
                                    "username" : element.channel.name,
                                    "viewers" : element.viewers,
                                    "game" : gameNames[index]})
                        }
                    }
                });
            
            });
        }).on('error', (e) => {
            console.error(e);
        });
    }
});

if (found.length == 0) {
    var msg = new webhook.MessageBuilder()
    .setName("Vu Finder")
    .setColor("#bc2edb")
    .setTitle("No twitch user found")
    Hook.send(msg);

} else {
    found.forEach(element => {
        var msg = new webhook.MessageBuilder()
        .setName("Vu Finder")
        .setColor("#bc2edb")
        .setTitle("Found user " + element.username)
        .setURL(element.url)
        .setText("Playing "+element.game + " for " + element.viewers+ " viewers")
        Hook.send(msg);

    });

}*/