/**
 * Created by yk on 2016/7/13.
 *
 * int league price pool according by leagueBriefs.json
 */
const resources = require("../conf/resources.json")
const webKey = resources.webKey
const leagueBriefs = require('../conf/leagueBriefs.json')
const leagueInfos = leagueBriefs.premium.concat(leagueBriefs.professional, leagueBriefs.amateur)
const LimitRequestUtil = require('../service/LimitRequestUtil')
const fs = require("fs")
const req = new LimitRequestUtil({concurrence_size: 20})

const leaguePricePoolFile = "../conf/leaguePricePool.json"
const leaguePricePool = {}
function initPricePool() {
    for (let i = 0; i< leagueInfos.length; i++) {
        let league = leagueInfos[i]

        let fullUrl = "https://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key=" + webKey + "&leagueid=" + league.id
        req.submitTask(fullUrl, (err, res, body) =>{
            if (err || res.statusCode != 200) {
                console.log("err:", err, " leagueid:", league.id)
            } else {
                let price = JSON.parse(body).result.prize_pool
                leaguePricePool[league.id] = price
            }

            if (i == leagueInfos.length - 1) {
                fs.writeFile(leaguePricePoolFile, JSON.stringify(leaguePricePool))
            }
        })
    }
}
initPricePool()
