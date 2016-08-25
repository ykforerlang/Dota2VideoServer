/**
 * Created by yk on 2016/8/9.
 */
"use strict"
const LimitRequestUtil = require("../service/LimitRequestUtil")
const limitReq = new LimitRequestUtil({concurrence_size: 20})

const taskUrlPool = [
    {
        url: 'http://www.imbatv.cn/competition?action=ajaxShow&tour_id=100',
        des: "ti6",
        cb: (err, res, body) => {
            if (err) {
                console.warn("...error")
                return
            }

            const jsonBody = JSON.parse(body)
            console.log(jsonBody.videos[0])
        }
    }
]
class videoPoolTask {
    static initStart() {
        _poolRotation()
        setInterval(() => {
            _poolRotation()
        }, 1000 * 60 * 60 * 12)
    }
}

const _poolRotation = () => {
    for(let i= 0; i< taskUrlPool.length; i++) {
        const urlReq = taskUrlPool[i]
        limitReq.submitTask(urlReq.url, urlReq.cb)
    }
}

videoPoolTask.initStart()
