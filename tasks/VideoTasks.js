/**
 * Created by yk on 2016/8/23.
 */
// http://www.imbatv.cn/competition?action=ajaxShow&tour_id=104
// http://r3.ykimg.com/0542040857B01A7E6A0A4A051B9753AE
// Wings vs DC Ti6 总决赛 Bo5 第四场
// <iframe height=498 width=510 src="http://player.youku.com/embed/XMTY4NDE0MTE3Mg==" frameborder=0 allowfullscreen></iframe>
// 2569610900
// 2016.8.14

"use strict";
const LimitRequestUtil = require('../utils/LimitRequestUtil')
const limitReq = new LimitRequestUtil({concurrence_size: 5})
const moment = require('moment')
const db = require('../service/db')
const videoDb = db.videoDb

function videoTask() {
    limitReq.submitTask(`http://www.imbatv.cn/competition?action=ajaxShow&tour_id=104`, (err, res, body) => {
        const bodyJson = JSON.parse(body)
        console.log(bodyJson.videos.length)
        const matches = db.leagueMatchDb.get("4664").take(170).value()
        for (let i = 0; i < bodyJson.videos.length; i++) {
            const video = bodyJson.videos[i]
            const key = new moment(parseInt(Number(video.addtime) * 1000)).format("YYYY年MM月DD")
            const value = {
                videoId:169 - i,
                thumb: `http://${video.thumb_host}${video.thumb_path}`,
                title: video.video_title,
                videoRes:'<iframe height=498 width=510 src="http://player.youku.com/embed/XMTY3MDM2ODg4NA==" frameborder=0 allowfullscreen></iframe>',
                matchId: matches[i].matchId,
                startDay:key,
            }

            videoDb.get('video').push(value).value()
        }
    })
}
videoTask()


