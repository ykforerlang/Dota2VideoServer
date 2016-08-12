/**
 * Created by yk on 2016/8/12.
 * 初始化轮训任务
 *  名称   周期
 *  赛事    1天
 *  奖金池  30分钟
 *  比赛列表： 30分钟
 *
 */

class MainTasks {
    initStart() {

    }
}

const leagueTask =  {
    taskFunc : () => {

    },

    taskPoolTime: 24 * 60 * 60 * 1000 ,
}

const leaguePoolTask = {
    taskFunc : () => {

    },

    taskPoolTime: 30 * 60 * 1000 ,
}

const matchListTask = {
    taskFunc : () => {

    },

    taskPoolTime: 30 * 60 * 1000,
}

module.exports = MainTasks