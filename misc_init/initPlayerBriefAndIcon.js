/**
 * Created by yk on 2016/7/15.
 */
const LimitRequestUtil = require('../service/LimitRequestUtil')
const resources = require("../conf/resources.json")
const webKey = resources.webKey
let teamBriefs  = require("../conf/teamBriefs.json")
const bigInt = require("big-integer");
const steamBigInt = new bigInt("76561197960265728")
const fs = require('fs')

let req = new LimitRequestUtil({concurrence_size: 30})

const playerBriefsFile = "../conf/playerBriefs.json"
const playerBriefs = {}
function initPlayerBriefAndIcon() {
    //teamBriefs = {3:[1]}
    for (let key in teamBriefs) {
        // https://api.steampowered.com/IDOTA2Teams_570/GetTeamInfo/v1?key={}&team_id=726228
        let fullUrl = "https://api.steampowered.com/IDOTA2Teams_570/GetTeamInfo/v1?key=" + webKey + "&team_id=" + key
        req.submitTask(fullUrl, (err, res, body) =>{
            if(err || res.statusCode != 200) {
                console.log("warn: err:", err, " fullUrl:", fullUrl)
            } else {
                JSON.parse(body).teams[0].members.forEach((member) =>{
                    let steamid = steamBigInt.add(member.account_id).toJSNumber()
                    let playUrl = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + webKey + "&steamids=" + steamid
                    req.submitTask(playUrl, (err, res, body) =>{
                        if (err || res.statusCode != 200) {
                            console.log("err:", err, " playUrl:", playUrl)
                        } else {
                            let player = JSON.parse(body).response.players[0]
                            if (!player) {
                                return
                            }
                            let avatarSteam = player.avatar
                            avatarSteam = avatarSteam.replace("https://steamcdn-a.akamaihd.net", "http://cdn.dota2.com.cn")

                            playerBriefs[member.account_id] = {
                                personaname:player.personaname,
                                icon:"require('../common/images/player/" + member.account_id + ".jpg')"
                            }
                           /* req.submitDownTask(avatarSteam, "./player2", ()=>{
                                return member.account_id + ".jpg"
                            })*/
                        }
                    })
                })
            }
        })
    }
}
//initPlayerBriefAndIcon()


//TODO add icon to json file

const players = require("../conf/playerBriefs.json")
for (let key in players) {
    players[key].icon = "require('../common/images/player/" + key + ".jpg')"
}
fs.writeFile("../conf/playerBriefs.json", JSON.stringify(players))