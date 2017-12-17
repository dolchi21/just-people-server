var db = require('../db')

async function main() {
    console.log('sync', 'start')
    await db.sync()
    console.log('sync', 'end')
}

main()
