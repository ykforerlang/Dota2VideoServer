/**
 * Created by yk on 2016/8/16.
 */
const lowdb = require('lowdb')
const leagueDb = lowdb('../conf/__leagueDb.json', {storage: require('lowdb/lib/file-async')})
leagueDb.defaults({league: []})
    .value()

const leagueMatchDb = lowdb('../conf/__leagueMatchDb.json', {storage: require('lowdb/lib/file-async')})

const matchDetailDb01 = lowdb('../conf/__matchDetailDb01.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb02 = lowdb('../conf/__matchDetailDb02.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb03 = lowdb('../conf/__matchDetailDb03.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb04 = lowdb('../conf/__matchDetailDb04.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb05 = lowdb('../conf/__matchDetailDb05.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb06 = lowdb('../conf/__matchDetailDb06.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb07 = lowdb('../conf/__matchDetailDb07.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb08 = lowdb('../conf/__matchDetailDb08.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb09 = lowdb('../conf/__matchDetailDb09.json', {storage: require('lowdb/lib/file-async')})
const matchDetailDb10 = lowdb('../conf/__matchDetailDb10.json', {storage: require('lowdb/lib/file-async')})

const errorDb = lowdb('../conf/__errorDb.json', {storage: require('lowdb/lib/file-async')})
errorDb.defaults({error: []})
    .value()

module.exports = {
    leagueDb,
    leagueMatchDb,
    matchDetailDb: [matchDetailDb01, matchDetailDb02, matchDetailDb03, matchDetailDb04, matchDetailDb05, matchDetailDb06,
        matchDetailDb07, matchDetailDb08, matchDetailDb09, matchDetailDb10],
    errorDb
}