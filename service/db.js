/**
 * Created by yk on 2016/8/16.
 */
const lowdb = require('lowdb')
const db = lowdb('../conf/__lowdb.json', { storage: require('lowdb/lib/file-async') })
db.defaults({ league: [], user: {} })
    .value()

module.exports = db