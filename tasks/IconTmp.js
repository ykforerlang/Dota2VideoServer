/**
 * Created by yk on 2016/8/25.
 */
"use strict";
const LimitRequestUtil = require('../utils/LimitRequestUtil')
const req = new LimitRequestUtil({concurrence_size: 5})
const resources = require('../conf/resources.json')
const fs = require('fs')
const {leagueDb, leagueMatchDb, matchDetailDb, errorDb} = require('../service/db')

function handleLeagueIcon() {
    leagueDb.get('league')
        .filter(league => {
            if (league.tier == 'premium') return true
            if (league.tier == 'professional' && league.endDate * 1000 >= new Date('2015-07-18').getTime()) return true
            if (league.tier == 'amateur' && league.endDate * 1000 >= new Date('2016-01-18').getTime()) return true
        })
        .map(league => {
            const path = '../public/images/league/' + league.leagueid + '.png'
            fs.exists(path, (e) => {
                if (!e) {
                    console.log("path:" , path, "  ", league.leagueid)

                    let event = league.imageInventory.substring(13)
                    let iconPrefix =  `http://api.steampowered.com/IEconDOTA2_570/GetItemIconPath/v1/?key=${resources.webKey}&format=json&iconname=${event}`
                    req.submitTask(iconPrefix, (err, res, body) =>{
                        if (err || res.statusCode != 200) {
                            console.log("get league:", league.id, "  ", league.imageInventory," icon url err:", err)
                        } else {
                            let image = 'http://cdn.dota2.com.cn/apps/570/' + JSON.parse(body).result.path
                            req.submitDownTask(image, "/image/leagueOriginal", () =>{
                                return league.leagueid + ".png"
                            })
                        }
                    })
                }
            })
        })
        .value()
}

handleLeagueIcon()

