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
const limitReq = new LimitRequestUtil()
const fetch = require('node-fetch')
const request = require('request')
const resources = require('../conf/resources.json')
const db = require('../service/db')
const fs = require('fs')
const kvn = require("keyvalues-node")

const taskList = []
class MainTasks {
    initStart() {
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
                console.warn("fetch ", url, ' error')
            })
    },

    taskPoolTime: 24 * 60 * 60 * 1000,
}
taskList.push(leagueTask)
const leagueTask2 = {
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
    console.dir(items)
    for(let key in items) {
        const value = items[key]
        const keyNum = parseInt(key)

        const league = db.get('league')
            .find({itemdef:keyNum})
            .assign({imageInventory:value.image_inventory

            })

    }

}
taskList.push(leagueTask2)

const leaguePoolTask = {
    taskFunc: () => {
        const url = 'https://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key=577A366039269967223A15C59EDE6D3B&leagueid=2733'
        const liveLeagueList = resources.liveLeaugeList
        for(let i = 0; i< liveLeaugeList.length; i++) {
            fetch(`https://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key=${resources.webKey}&leagueid=${liveLeagueList[i]}`)
                .then(res => {
                    return res.json()
                })
                .then(res => {
                    db.get('league')
                        .find({leagueid: liveLeagueList[i]})
                        .assign({prizePool: res.result.prize_pool})
                        .value()
                })
                .catch(err => {
                    console.warn("fetch ", url, ' error')
                })
        }
    },

    taskPoolTime: 30 * 60 * 1000,
}
taskList.push(leaguePoolTask)

const matchListTask = {
    taskFunc: () => {

    },

    taskPoolTime: 30 * 60 * 1000,
}
taskList.push(matchListTask)

const mt = new MainTasks()
mt.initStart()
//module.exports = MainTasks