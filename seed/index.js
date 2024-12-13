import mongoose from '../models/index.js'
import Ancestry from '../models/Ancestry.js'
import ancestriesData from './ancestries-seed.json' with { type: 'json' }

const args = process.argv

console.log('RUNNING SEED')

/* HELP */

if (args.includes('-h') || args.includes('--help') || args.length == 2) {
    console.log(
        'In order to use this command please include arguments for which items to seed...',
        '\n\nThese can include:',
        '\n  --ancestries',
        '\n  --characters',
    )
    process.exit()
}


/* ANCESTRIES */

if (args.includes('--ancestries')) {
    const { ancestries } = ancestriesData
    console.log('\nSeeding/reseeding ancestries...')

    await Ancestry.deleteMany({})

    for (let i = 0; i < ancestries.length; i++) {
        const ancestry = await Ancestry.create(ancestries[i])
        console.log(`Created ${ancestry.name} - ${ancestry._id}`)
    }
}


/* CHARACTERS */

if (args.includes('--characters')) {
    console.log('\nCharacters will be supported in a future update')
}


// does not shut down gracefully so exit process directly
process.exit()