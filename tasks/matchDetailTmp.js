/**
 * Created by pwrd on 16/8/17.
 */

"use strict";
const LimitRequestUtil = require('../utils/LimitRequestUtil')
const limitReq = new LimitRequestUtil({concurrence_size: 5})
const playerBriefs = require('../conf/playerBriefs.json')
const resources = require('../conf/resources.json')
const _ = require('lodash')

const {matchDetailDb} = require('../service/db')

const one = matchDetailDb[0]
limitReq.submitTask(``, (err, res, body) => {

})

