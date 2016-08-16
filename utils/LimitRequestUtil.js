/**
 * Created by yk on 2016/7/4.
 */
"use strict"
const request = require("request")
const log4js =  require('log4js')
const fs =  require('fs')
const path =  require('path')
const log = log4js.getLogger(__filename.replace(__dirname, ""))

const  DEFAULT_CONCURRENCE_SIZE = 20
const  DEFAULT_TIMEOUTS = 5000
class LimitRequestUtil {
    /*static  DEFAULT_CONCURRENCE_SIZE : 20
    static  DEFAULT_TIMEOUTS : 5000*/

    constructor(opt) {
        opt = opt ? opt :{}
        this.nowSize = 0
        this.taskQueue = []
        this.concurrence_size = opt.concurrence_size || DEFAULT_CONCURRENCE_SIZE
        this.timeouts = opt.timeouts || DEFAULT_TIMEOUTS
    }

    // 如果现在的 访问数小于size， 直接访问， 否则放到队列
    submitTask(url, cb) {
        log.info("submit a task:", url)
        let self = this

        if (this.nowSize < this.concurrence_size) {
            let wrapCb = function() {
                cb.apply(this, Array.prototype.slice.call(arguments))  // 恢复 cb的调用, 包括this和参数

                self.nowSize--
                let firstTask = self.taskQueue.shift()

                if(!firstTask) {
                    // 队列为空  do nothing
                } else if (firstTask.type == "downTask") {
                    self.submitDownTask(firstTask.url, firstTask.targetDir, firstTask.nameFunc)
                } else {
                    self.submitTask(firstTask.url, firstTask.cb)
                }

               // cb.call(this, Array.prototype.slice.call(arguments))  // 恢复 cb的调用, 包括this和参数
            }
            request.get(url, wrapCb)
            this.nowSize++
        } else {
            this.taskQueue.push({url:url, cb:cb, type:"task"})
        }
    }

    //下载任务， 比如静态文件
    submitDownTask(url, targetDir, nameFunc) {
        log.info("submit a task:", url)

        let nameFuncRel = nameFunc ? nameFunc : this.__getFileName

        if (this.nowSize < this.concurrence_size) {
            let fileName = nameFuncRel(url)
            let stream = request(url)

            let desStream = fs.createWriteStream(path.join(targetDir, fileName))
            stream.pipe(desStream)
            stream.on("error", (err)=> {
                log.warn("handled a task:", url, " err:", err)
                desStream.close()
                this.__handleNextDown()
            })
            stream.on('end', ()=>{
                log.info("handled a task:", url, "nowSize:", this.nowSize)
                desStream.close()
                this.__handleNextDown()
            })
            this.nowSize++
        } else {
            this.taskQueue.push({url:url, targetDir:targetDir, nameFunc:nameFunc, type:"downTask"})
        }
    }


    __getFileName(url) {
        let start = url.lastIndexOf("/")
        let end = url.indexOf("?")
        end = end == -1 ? url.length : end
        return url.substring(start + 1, end)
    }

    __handleNextDown() {
        this.nowSize--
        let firstTask = this.taskQueue.shift()

        if(!firstTask) {
            // 队列为空  do nothing
        } else if (firstTask.type == "downTask") {
            this.submitDownTask(firstTask.url, firstTask.targetDir, firstTask.nameFunc)
        } else {
            this.submitTask(firstTask.url, firstTask.cb)
        }
    }
}

module.exports = LimitRequestUtil
