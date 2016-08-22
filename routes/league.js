/**
 * Created by yk on 2016/5/27.
 */
"use strict";
const express = require('express')
const log4js = require('log4js')
const router = express.Router();
const log = log4js.getLogger(__filename)
const {leagueDb, leagueMatchDb, matchDetailDb, errorDb} = require('../service/db')

/**
 * @param req.maxItemdef 最大itemDef 返回的值的itemdef小于这个值， 不包括
 * @type  类型字段
 */
router.get('/getList', (req, res) => {
    const {maxItemdef, minItemdef, type} = req.query
    const list = leagueDb.get('league')
        .filter(league => {
            if (minItemdef) {
                return league.tier === type && league.itemdef > minItemdef
            }
            if (maxItemdef) {
                return league.tier === type && league.itemdef < maxItemdef
            }

            return league.tier === type
        })
        .orderBy('itemdef', 'desc')
        .take(50)
        .value()
    res.json(list)
})

router.get('/matchList', (req, res) => {
    const {maxId, minId, leagueId} = req.query

    const matchList = leagueMatchDb.get(leagueId)
        .filter(match => {
            if (maxId) {
                return match.matchId < maxId
            }
            if (minId) {
                return match.matchId > minId
            }

            return true
        })
        .take(50)
        .value()
    res.json(matchList || [])
})


module.exports = router;