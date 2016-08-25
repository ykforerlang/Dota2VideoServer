/**
 * Created by yk on 2016/7/4.
 */
"use strict"

const LimitRequestUtil = require('../service/LimitRequestUtil')
const mongoService = require("../service/mongoService")
const collections = require('../conf/resources.json').mongo.collectionName
const log4js = require('log4js')
const heroesInfo = require("../conf/heroes20160711.json").heroes
const log = log4js.getLogger(__filename)
const cdnPrefix = "http://cdn.dota2.com.cn/"
const heroPrefix = cdnPrefix + "apps/dota2/images/heroes/"
const teamPrefix = "http://www.dotamax.com/match/tour_famous_team_list/?league_id=&skill=&ladder=&p="
const request = require("request")
const jsdom = require('jsdom')
const jquery = require("jquery")
const fs = require('fs')
const teamInfosFile = "../conf/teamBriefs.json"

let req = new LimitRequestUtil({concurrence_size: 10})


// init league icon
/*setTimeout(initLeagueIcon, 500)  // wait mongo ok
function initLeagueIcon() {
    mongoService.getCollection(collections.leagues)
        .find({}, {fields: {_id: 0}})
        .toArray()
        .then(docs => {
            for (let i = 0; i < docs.length; i++) {
                let doc = docs[i]
                log.info(doc)
                /!*if (doc.image && doc.leagueid) {
                 req.submitDownTask(doc.image, "/image/league", () => {
                 let suffix = getSuffix(doc.image)
                 return doc.leagueid + suffix
                 })
                 }*!/
            }
        })
}
function getSuffix(url) {
    let index = url.lastIndexOf(".")
    return url.substring(index)
}*/

// init hero icon
// http://cdn.dota2.com.cn/apps/dota2/images/heroes/nyx_assassin_eg.png
let heroBriefs = {}
const heroBriefsFile = "../conf/heroBriefs.json"
function initHeroIcon() {
    for (let i = 0; i < heroesInfo.length; i++) {
        let hero = heroesInfo[i]
        let fullUrl = heroPrefix + hero.name.replace("npc_dota_hero_", "") + "_selection.png" // all picture is png format, eg is small
        req.submitDownTask(fullUrl, "/image/heroOriginal", () => {
            return hero.id + ".png"
        })

        let heroBrief = {
            id: hero.id,
            name: hero.localized_name,
        }
        heroBriefs[hero.id] = heroBrief
    }
    fs.writeFile(heroBriefsFile, JSON.stringify(heroBriefs))
}
initHeroIcon()


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
                    tag: $this.find('.table-title-font').text().trim()
                }
                if (image != "/static/image/default_team.jpg") {
                    req.submitDownTask(image, "/image/team1", () => {
                        return teamId + ".png"
                    })
                }
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


// item icon init
const itemUrlPrefix = cdnPrefix + "apps/dota2/images/items/"
const itemBriefsFile = "../conf/itemBriefs.json"
const itemInfos = require("../conf/itemInfos.json").items
let itemBriefs = {}
function initItemIcon() {
    for (let i = 0; i < itemInfos.length; i++) {
        let item = itemInfos[i]
        //http://cdn.dota2.com.cn/apps/dota2/images/items/mithril_hammer_eg.png
        let fullUrl = itemUrlPrefix + item.name.replace("item_", "") + "_eg.png"
        req.submitDownTask(fullUrl, "/image/item1/", () => {
            return item.id + ".png"
        })
        let itemBrief = {
            id: item.id,
            name: item.localized_name
        }
        itemBriefs[item.id] = itemBrief
    }
    fs.writeFile(itemBriefsFile, JSON.stringify(itemBriefs))
}
initItemIcon()

