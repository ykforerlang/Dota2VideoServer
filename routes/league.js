/**
 * Created by yk on 2016/5/27.
 */
"use strict";
var express = require('express');
var resUtil = require('../util/resUtil')
var myDota2Web = require('../service/myDota2Web')
var moment = require("moment")
var log4js = require('log4js');
var router = express.Router();
var log = log4js.getLogger(__filename)

const teamBriefs = require("../conf/teamBriefs.json")

router.get("/:id/getMatches", (req, res) => {
    _handleGetMatch(req, res, integrateMatch)
})
function  _handleGetMatch(req, res, detailHandler) {
    let leagueid = Number(req.params.id)
    let params = req.query || {}

    let opt = {league_id: leagueid, matches_requested: 30}  // matches_requested is number of series
    if (params.startMatchId)
        opt.start_at_match_id = params.startMatchId

    myDota2Web.getMatchHistory(opt, function (err, data) {
        if (err) {
            log.warn("get league: ", leagueid, " match list err:", err)
            res.send(resUtil.failureRes(err))
            return
        }

        var matches = detailHandler(data.result.matches)
        res.send(resUtil.successRes(matches))
    })
}


//将赛事列表 转化为 bo几 的列表形式  根据 series_type  判定： 0 is a non-series, 1 is a bo3, 2 is a bo5
function integrateMatch(matches) {
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

    const result = {}
    for (let i = 0; i< data.length; i++) {
        const key =  new moment(data[i].startTime * 1000).format("YYYY/MM/DD")
        if (result[key] ) {
            result[key].push(data[i])
        } else {
            result[key] = [data[i]]
        }
    }
    return result
}

function enrichmentMatch(match, index) {
    let {match_id, start_time, players,  series_type, radiant_team_id, dire_team_id} = match
    const title =_getSeriesType(series_type) + "/" + (index + 1)
    let heroes = players.map((ele) => ele.hero_id)
    return {
        heroes,
        matchId: match_id,
        startTime: start_time, //new moment(start_time * 1000).format("YYYY/MM/DD HH时mm分"),
        title,
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

module.exports = router;