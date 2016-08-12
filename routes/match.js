/**
 * Created by yk on 2016/6/14.
 */

"use strict";
var express = require('express');
var myDota2Web = require('../service/myDota2Web')
var log4js = require('log4js');
var router = express.Router();
var resUtil = require('../util/resUtil')
var log = log4js.getLogger(__filename)

/**
 * 根据steam webapi获取  某个赛事详情
 */
router.get("/:matchId/detail", (req, res) => {
    let matchId = req.params.matchId;

    myDota2Web.getMatchDetail(matchId, function(err, data) {
        if (err) {
            res.send(resUtil.failureRes(err))
            return
        }
        let standardData = standardMatch(data.result)
        res.send(resUtil.successRes(standardData))
    })
})

function standardMatch(matchDetail) {
    let stan = {}
    stan.players = matchDetail.players.map(player =>{
        return {
            accountId:player.account_id,
            heroId:player.hero_id,
            items: [player.item_0, player.item_1, player.item_2, player.item_3, player.item_4, player.item_5],
            kills: player.kills,
            deaths:player.deaths,
            assists: player.assists,
            lastHits: player.lastHits,
            denies: player.denies,
            goldPerMin: player.gold_per_min,
            xpPerMin:player.xp_per_min,
            level:player.level,
            gold:player.gold,
            persona:player.persona,
        }
    })

    stan.radiantWin = matchDetail.radiant_win
    stan.duration = matchDetail.duration
    stan.matchId = matchDetail.match_id
    return stan
}

module.exports = router;