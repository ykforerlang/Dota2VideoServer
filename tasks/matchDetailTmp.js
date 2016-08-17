/**
 * Created by pwrd on 16/8/17.
 */

"use strict";
const LimitRequestUtil = require('../utils/LimitRequestUtil')
const limitReq = new LimitRequestUtil({concurrence_size: 5})
const playerBriefs = require('../conf/playerBriefs.json')
const resources = require('../conf/resources.json')
const _ = require('lodash')

limitReq.submitTask('http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=6515B089779D631CD61B8599622FE7FC&match_id=2469377521',
    (err, res, body) => {
        body = JSON.parse(body)
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
            result.icon = resources.staticHost + "/images/player/" + ele.account_id + ".jpg"
            return result
        })
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

        console.log(matchDetail)
    })

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
        playerList[i][key + 'Rate'] = _.round(playerList[i][key] / total, 3)
    }
}
function _getTimeFromSecond(duration) {
    const hour = parseInt(duration / 3600)
    const min = parseInt((duration - hour * 60) / 60)
    const second = duration - hour * 3600 - min * 60

    return (hour ? hour + "时" : '') + (min + "分") + (second + "秒")
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
