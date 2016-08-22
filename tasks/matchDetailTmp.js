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
        console.log(err, res, body)
    })

