/**
 * Created by yk on 2016/8/12.
 * 初始化轮训任务
 *  名称   周期
 *  赛事    1天
 *  奖金池  30分钟
 *  比赛列表： 30分钟
 *
 */
"use strict";
const LimitRequestUtil = require('../utils/LimitRequestUtil')
const limitReq = new LimitRequestUtil({concurrence_size:5})
const fetch = require('node-fetch')
const request = require('request')
const resources = require('../conf/resources.json')
const db = require('../service/db')
const fs = require('fs')
const kvn = require("keyvalues-node")
const _ = require('lodash/core')
const moment = require('moment')



const taskList = []
class MainTasks {
    static initStart() {
        for (let i = 0; i < taskList.length; i++) {
            const task = taskList[i]
            task.taskFunc()
            setInterval(task.taskFunc, task.taskPoolTime)
        }
    }
}

/**
 *url: https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v1/?key={}&language=zh_cn
 * @type {{taskFunc: leagueTask.taskFunc, taskPoolTime: number}}
 */
/*const leagueTask = {
 taskFunc: () => {
 const url = `https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v1/?key=${resources.webKey}&language=zh_cn`
 fetch(url)
 .then((res) => {
 return res.json()
 })
 .then((res) => {
 const list = res.result.leagues
 for (let i = 0; i < list.length; i++) {
 const league = db.get('league')
 .find({leagueid: list[i].leagueid})
 .value()
 if (!league) {
 db.get('league')
 .push(list[i])
 .value()
 console.log("push a leauge", list[i].leagueid)
 } else {
 console.log("league", list[i].leagueid, " already exsit!")
 }
 }

 }
 )
 .catch(err => {
 console.warn("fetch ", url, ' error ', err)
 })
 },

 taskPoolTime: 24 * 60 * 60 * 1000,
 }
 taskList.push(leagueTask)*/
/*const leagueTask2 = {
 taskFunc: () => {
 const url = `http://api.steampowered.com/IEconItems_570/GetSchemaURL/v1?key=${resources.webKey}`
 fetch(url)
 .then(res => {
 return res.json()
 })
 .then(res => {
 const gameFileUrl = res.result.items_game_url
 const itemsGamePath= "../conf/__itemsGame.txt"
 fs.unlink(itemsGamePath, () => {
 const stream = request(gameFileUrl)
 stream.pipe(fs.createWriteStream(itemsGamePath))
 stream.on("end", () => {
 fs.readFile("../conf/__itemsGame.txt", function(err, data) {
 _handleGameFile(data)
 })
 })
 })
 })
 .catch(err => {
 console.warn("fetch ", url, ' error')
 })
 },
 taskPoolTime: 72 * 60 * 60 * 1000,
 }
 const _handleGameFile = (data) => {
 const result = kvn.decode(data.toString())
 const items = result.items_game.items
 const leaguemap = db.get('league')
 .map('itemdef')
 .value()
 _.forEach(leaguemap, (value) => {
 const ele = items[value + ""]
 if (!ele || !ele.tool) return
 const usage = ele.tool.usage
 if (! usage) return
 const prizePoolStopTime = usage.prize_pool ? usage.prize_pool.stop_sales_time : 0
 db.get('league')
 .find({itemdef:value})
 .assign({imageInventory:ele.image_inventory,
 tier : usage.tier,
 freeToSpectate: usage.free_to_spectate,
 startDate : usage.start_date,
 endDate : usage.end_date,
 prizePoolStopTime,
 })
 .value()
 })


 }
 taskList.push(leagueTask2)*/

/*const leaguePoolTask = {
    taskFunc: () => {
        const url = 'http://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key=577A366039269967223A15C59EDE6D3B&leagueid=2733'
        const now = new Date().getTime()
        db.get('league')
            .filter((league) => {
                return league.prizePoolStopTime * 1000 >= now
            })
            .map((league) => {
                fetch(`http://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key=${resources.webKey}&leagueid=${league.leagueid}`)
                    .then(res => {
                        return res.json()
                    })
                    .then(res => {
                        db.get('league')
                            .find({leagueid: league.leagueid})
                            .assign({prizePool: res.result.prize_pool})
                            .value()
                        console.log("leaugeid:", league.leagueid, " prize:", res.result.prize_pool)
                    })
                    .catch(err => {
                        console.warn("fetch ", url, ' error ', err)
                    })
            })
            .value()
    },

    taskPoolTime: 30 * 60 * 1000,
}
taskList.push(leaguePoolTask)*/

/**
 * 根据赛事id  获取比赛列表
 * steam webapi: 获取某个赛事下的比赛： http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v001/?key={}
 * player_name=<name> # 通过玩家名字搜索匹配, 仅限精确匹配
 * hero_id=<id> # 通过特定的英雄搜索, 英雄的ID在你的DOTA安装目录 dota/scripts/npc/npc_heroes.txt 中
 * skill=<skill>  # 0为任意 , 1为N , 2为H, 3为VH
 * date_min=<date> # date in UTC seconds since Jan 1, 1970 (unix time format)
 * date_max=<date> # date in UTC seconds since Jan 1, 1970 (unix time format)
 * account_id=<id> # Steam账号ID (不是Steam的登录ID, 而是数字ID)
 * league_id=<id> # 该联赛ID的比赛记录
 * start_at_match_id=<id> # 从填入的匹配记录ID开始，降序
 * matches_requested=<n> # 默认25场，可以改低
 *
 */
const matchListTask = {
    taskFunc: () => {
        const now = new Date('2015-07-18').getTime()

        db.get("league")
            .filter(league => {
                if (!league.endDate) return
                return league.endDate * 1000 >= now
            })
            .map(league => {
                limitReq.submitTask(`http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v001/?key=${resources.webKey}&league_id=${league.leagueid}&matches_requested=100`,
                    _handlerMatchRes.bind(null, league.leagueid))
            })
            .value()
    },

    taskPoolTime: 30 * 60 * 1000,
}
const _handlerMatchRes = (leagueid, err, res, body) => {
    if (err) {
        console.warn("match history error:", err)
        return
    } else {
        body = JSON.parse(body)
        if (!body.result || !body.result.matches) return
        const matches = body.result.matches
        if (matches.length <= 0) return
        const lastMatchId = matches[matches.length - 1].match_id

        if(body.result.results_remaining != 0) {
            limitReq.submitTask(`http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v001/?key=${resources.webKey}&league_id=${leagueid}&matches_requested=100&start_at_match_id=${lastMatchId}`,
                _handlerMatchRes.bind(null, leagueid))
        }
        _handlerMatches(leagueid, body.result.matches)
    }
}

const _handlerMatches = (leagueid, matches) => {
    integrateMatch(leagueid, matches)
}
//将赛事列表 转化为 bo几 的列表形式  根据 series_type  判定： 0 is a non-series, 1 is a bo3, 2 is a bo5
function integrateMatch(leagueid, matches) {
    let data = []
    for (let i = 0; i < matches.length;) {
        let match = matches[i]
        let matchesEnrich =  [enrichmentMatch(match, 0)]
        if (match.series_type != 0) { //series
            let seriesId = match.series_id
            for (var j = 1; j < 10; j++) {
                if (i + j >= matches.length)
                    break

                if (matches[i + j].series_id == seriesId) {
                    matchesEnrich.push(enrichmentMatch(matches[i + j], j))
                } else {
                    break
                }
            }
            i = i + j
        } else {
            i = i + 1
        }
        matchesEnrich.reverse()
        data = data.concat(matchesEnrich)
    }
    const matchesArray = db.get('league')
        .find({leagueid:leagueid})
        .get('matches')
        .value()
    if (matchesArray) {
        db.get('league')
            .find({leagueid:leagueid})
            .get('matches')
            .push(data)
            .value()
    } else {
        db.get('league')
            .find({leagueid:leagueid})
            .set('matches', data)
            .value()
    }
    console.log(leagueid, "data:", data)
}

function enrichmentMatch(match, index) {
    let {match_id, start_time, players,  series_type, radiant_team_id, dire_team_id} = match
    const type =_getSeriesType(series_type) + "/" + (index + 1)
    let heroes = players.map((ele) => ele.hero_id)
    const startDate = new moment(start_time * 1000)
    return {
        heroes,
        matchId: match_id,
        startTime: startDate.format("HH时mm分"),
        startDay: startDate.format("YYYY年MM月DD"),
        type,
        radiantTeam: _getTeamTag(radiant_team_id),
        direTeam: _getTeamTag(dire_team_id),
    }
}

const teamBriefs = require('../conf/teamBriefs.json')
function _getTeamTag(teamId) {
    const team = teamBriefs[teamId + ""]
    if (team) {
        return team.tag || "unkown"
    } else {
        return 'unkown'
    }
}

const stMap = {"2": "BO5", "1": "BO3", "0": "BO1"}
function _getSeriesType(seriesType) {
    return stMap[seriesType + ""]
}

taskList.push(matchListTask)

MainTasks.initStart()
//module.exports = MainTasks