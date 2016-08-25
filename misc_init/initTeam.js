/**
 * Created by yk on 2016/8/9.
 */
const LimitRequestUtil = require('../service/LimitRequestUtil')
let req = new LimitRequestUtil({concurrence_size: 10})
const fs = require('fs')
const jsdom = require('jsdom')
const jquery = require("jquery")
const teamInfosFile = "../conf/teamBriefs.json"

const teamPrefix = "http://www.dotamax.com/match/tour_famous_team_list/?league_id=&skill=&ladder=&p="
// init team icon
// dota2-node requestProTeamList
let teamInfos = {}
function initTeamIcon() {
    for (let i = 1; i <= 6; i++) {
        let fullUrl = teamPrefix + i
        console.log(fullUrl)
        var options = {
            url: fullUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0',
                'Host': 'www.dotamax.com',
            }
        }
        req.submitTask(options, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                handleBody(body, i)
            }
        })

    }
}
let count = 0
function handleBody(body, index) {
    jsdom.env({
        html: body,
        done: function (err, window) {
            let $ = jquery(window)
            let trList = $("tbody tr")
            trList.each(function (index, ele) {
                let $this = $(ele)
                let onclickStr = $this.attr('onclick')
                let lastIndex1 = onclickStr.lastIndexOf("=")
                let lastIndex2 = onclickStr.lastIndexOf("'")

                let teamId = onclickStr.substring(lastIndex1 + 1, lastIndex2)
                let image = $this.find('img').attr("src")
                let team = {
                    id: teamId,
                    tag: $this.find('.table-title-font').text().trim(),
                    icon: "require('../common/images/team/" + teamId + ".jpg')"
                }
                /*if (image != "/static/image/default_team.jpg") {
                    req.submitDownTask(image, "/image/team1", () => {
                        return teamId + ".png"
                    })
                }*/
                teamInfos[teamId] = team

            })
            count++
            if (count == 6) {
                fs.writeFile(teamInfosFile, JSON.stringify(teamInfos))
            }
        }
    })
}
initTeamIcon()