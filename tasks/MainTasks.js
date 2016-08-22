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
const limitReq = new LimitRequestUtil({concurrence_size: 5})
const fetch = require('node-fetch')
const request = require('request')
const resources = require('../conf/resources.json')
const {leagueDb, leagueMatchDb, matchDetailDb, errorDb} = require('../service/db')
const fs = require('fs')
const kvn = require("keyvalues-node")
const _ = require('lodash')
const moment = require('moment')
const playerBriefs = require('../conf/playerBriefs.json')
const teamBriefs = require('../conf/teamBriefs.json')


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
const leagueTask = {
    taskFunc: () => {
        const url = `https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v1/?key=${resources.webKey}&language=zh_cn`
        fetch(url)
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                    const list = res.result.leagues
                    for (let i = 0; i < list.length; i++) {
                        const league = leagueDb.get('league')
                            .find({leagueid: list[i].leagueid})
                            .value()
                        if (!league) {
                            leagueDb.get('league')
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
//taskList.push(leagueTask)
const leagueTask2 = {
    taskFunc: () => {
        const url = `http://api.steampowered.com/IEconItems_570/GetSchemaURL/v1?key=${resources.webKey}`
        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(res => {
                const gameFileUrl = res.result.items_game_url
                const itemsGamePath = "../conf/__itemsGame.txt"
                fs.unlink(itemsGamePath, () => {
                    const stream = request(gameFileUrl)
                    stream.pipe(fs.createWriteStream(itemsGamePath))
                    stream.on("end", () => {
                        fs.readFile("../conf/__itemsGame.txt", function (err, data) {
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
    const leaguemap = leagueDb.get('league')
        .map('itemdef')
        .value()
    _.forEach(leaguemap, (value) => {
        const ele = items[value + ""]
        if (!ele || !ele.tool) return
        const usage = ele.tool.usage
        if (!usage) return
        const prizePoolStopTime = usage.prize_pool ? usage.prize_pool.stop_sales_time : 0
        leagueDb.get('league')
            .find({itemdef: value})
            .assign({
                imageInventory: ele.image_inventory,
                tier: usage.tier,
                freeToSpectate: usage.free_to_spectate,
                startDate: usage.start_date,
                endDate: usage.end_date,
                prizePoolStopTime,
            })
            .value()
    })


}
//taskList.push(leagueTask2)

const leaguePoolTask = {
    taskFunc: () => {
        const url = 'http://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key=577A366039269967223A15C59EDE6D3B&leagueid=2733'
        const now = new Date().getTime()
        leagueDb.get('league')
            .filter((league) => {
                return league.prizePoolStopTime * 1000 >= now
            })
            .map((league) => {
                fetch(`http://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key=${resources.webKey}&leagueid=${league.leagueid}`)
                    .then(res => {
                        return res.json()
                    })
                    .then(res => {
                        leagueDb.get('league')
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
//taskList.push(leaguePoolTask)

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
        leagueDb.get("league")
            .filter(league => {
                if (!league.endDate || !league.tier) return false
                if (leagueMatchDb.get(league.leagueid + "").value()) return false

                if (league.tier == 'premium') return true
                if (league.tier == 'professional' && league.endDate * 1000 >= new Date('2015-07-18').getTime()) return true
                if (league.tier == 'amateur' && league.endDate * 1000 >= new Date('2016-01-18').getTime()) return true
            })
            .map(league => {
                console.log(league.leagueid)
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
        try {
            body = JSON.parse(body)
        } catch (err) {
            errorDb.get('error').push({"matchListError": leagueid})
            return
        }

        if (!body.result || !body.result.matches) return
        const matches = body.result.matches
        if (matches.length <= 0) return
        const lastMatchId = matches[matches.length - 1].match_id

        if (body.result.results_remaining != 0) {
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
        let matchesEnrich = [enrichmentMatch(leagueid, match, 0)]
        if (match.series_type != 0) { //series
            let seriesId = match.series_id
            for (var j = 1; j < 10; j++) {
                if (i + j >= matches.length)
                    break

                if (matches[i + j].series_id == seriesId) {
                    matchesEnrich.push(enrichmentMatch(leagueid, matches[i + j], j))
                } else {
                    break
                }
            }
            i = i + j
        } else {
            i = i + 1
        }
        matchesEnrich = _.compact(matchesEnrich)
        matchesEnrich.reverse()
        data = data.concat(matchesEnrich)
    }
    const matchesArray = leagueMatchDb.get(leagueid + "")
        .value()
    if (matchesArray) {
        leagueMatchDb.get(leagueid + "")
            .push(data)
            .value()
    } else {
        leagueMatchDb.set(leagueid + "", data)
            .value()
    }
}

function enrichmentMatch(leagueid, match, index) {
    let {match_id, start_time, players,  series_type, radiant_team_id, dire_team_id} = match
    const type = _getSeriesType(series_type) + "/" + (index + 1)
    let heroes = players.map((ele) => ele.hero_id)
    if (heroes.length != 10) return
    const startDate = new moment(start_time * 1000)

    /* if (!leagueDb.get('matchDetail').get(match_id + "").value()) {
     limitReq.submitTask(`http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=${resources.webKey}&match_id=${match_id}`,
     (err, res, body) => {
     if (err) {
     console.log("err:", err)
     } else {
     _handlerMatchDetail(body, leagueid, match_id)
     }
     })
     }*/
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


//taskList.push(matchListTask)


/// 处理match detail   第一次初始化的时候用来初始化 历史数据，只使用一次
function tmpMatchDetail() {
    leagueMatchDb.forEach((value, key) => {

        _.forEach(value, (match) => {
           if (!match || !match.matchId) return
            const index = match.matchId % 10
            if (matchDetailDb[index].get(match.matchId + "").value())
                return
            limitReq.submitTask(`http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=${resources.webKey}&match_id=${match.matchId}`,
                (err, res, body) => {
                    if (err) {
                        console.log("err:", err)
                    } else {
                        _handlerMatchDetail(body, match.matchId)
                    }
                })
        })
    }).value()

}
//tmpMatchDetail()

/// 处理丢掉的lastHits /denies, 修正Rate
function tmpLastHitsAndRate() {
    errorDb.get("error").forEach((value) => {
        const matchId = value.matchDetailError
        limitReq.submitTask(`http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=${resources.webKey}&match_id=${matchId}`,
            (err, res, body) => {
                if (err) {
                    console.log("err:", err)
                } else {
                    _handlerMatchDetail(body, matchId)
                }
            })

    }).value()
}
//tmpLastHitsAndRate()



function _handlerMatchDetail(body, matchid) {
    try {
        body = JSON.parse(body)
        if (body.result.players.length != 10) {
            throw "res error"
        }
    } catch (err) {
        errorDb.get("error2")
            .push({"matchDetailError": matchid})
            .value()
        console.log("err body:", body)
        return
    }
    const bodyDetail = body.result
    const matchDetail = {}

    const players = bodyDetail.players.map((ele) => {
        const result = {}
        result.accountId = ele.account_id
        const player = playerBriefs[ele.account_id]
        result.name = player ? player.personaname : 'unkown'
        result.itemList = [ele.item_0, ele.item_1, ele.item_2, ele.item_3, ele.item_4, ele.item_5]
        result.kills = ele.kills
        result.deaths = ele.deaths
        result.assists = ele.assists
        result.xpm = ele.xp_per_min
        result.gpm = ele.gold_per_min
        result.level = ele.level
        result.gold = ele.gold + ele.gold_spent
        result.towerDamage = ele.tower_damage
        result.heroDamage = ele.hero_damage
        result.healing = ele.hero_healing

        result.lastHits = ele.last_hits
        result.denies = ele.denies

        const iconPart = player ? ele.account_id : "default"
        result.icon = "players/" + iconPart + ".jpg"
        return result
    })
    if (players.length != 10) {
        console.log("players length:", players.length)
        return
    }

    _handlerTotalRate('gold', players)
    _handlerTotalRate('towerDamage', players)
    _handlerTotalRate('heroDamage', players)
    _handlerTotalRate('healing', players)
    matchDetail.players = players
    matchDetail.winner = bodyDetail.radiant_win ? '天辉' : '夜魇'
    matchDetail.matchId = bodyDetail.match_id
    matchDetail.duration = _getTimeFromSecond(bodyDetail.duration)
    matchDetail.radiantScore = bodyDetail.radiant_score
    matchDetail.direScore = bodyDetail.dire_score
    matchDetail.radiantTeam = _getTeamTag(bodyDetail.radiant_team_id)
    matchDetail.direTeam = _getTeamTag(bodyDetail.dire_team_id)

    const index = matchid % 10
    matchDetailDb[index].set(matchid + "", matchDetail)
        .value()
    //console.log(matchDetail)
}

function _handlerTotalRate(key, playerList) {
    const radiantTotal = _handlerTotal(key, playerList, 0)
    const direTotal = _handlerTotal(key, playerList, 5)
    _setTotalRate(key, playerList, 0, radiantTotal)
    _setTotalRate(key, playerList, 5, direTotal)
}
function _handlerTotal(key, playerList, start) {
    let total = 0
    for (let i = start; i < start + 5; i++) {
        total += playerList[i][key]
    }
    return total
}
function _setTotalRate(key, playerList, start, total) {
    for (let i = start; i < start + 5; i++) {
        playerList[i][key + 'Rate'] = Math.round(playerList[i][key] / total * 1000) / 10 + "%"
    }
}
function _getTimeFromSecond(duration) {
    const hour = parseInt(duration / 3600)
    const min = parseInt((duration - hour * 60) / 60)
    const second = duration - hour * 3600 - min * 60

    return (hour ? hour + "时" : '') + (min + "分") + (second + "秒")
}


MainTasks.initStart()
//module.exports = MainTasks