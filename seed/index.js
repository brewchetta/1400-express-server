import mongoose from '../models/index.js'
import Ancestry from '../models/Ancestry.js'
import Character from '../models/Character.js'
import ItemTemplate from '../models/ItemTemplate.js'
import ancestriesData from './ancestries-seed.json' with { type: 'json' }
import charactersData from './characters-seed.json' with { type: 'json' }
import itemsData from './items-seed.json' with { type: 'json' }

const args = process.argv

console.log('RUNNING SEED')

/* HELP */

if (args.includes('-h') || args.includes('--help') || args.length == 2) {
    console.log(
        'In order to use this command please include arguments for which items to seed...',
        '\n\nThese can include:',
        '\n  --ancestries',
        '\n  --characters',
        '\n  --items',
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


/* ITEM TEMPLATES */

if (args.includes('--items')) {
    const { items } = itemsData
    console.log('\nSeeding/reseeding item templates...')

    await ItemTemplate.deleteMany({})

    for (let i = 0; i < items.length; i++) {
        const item = await ItemTemplate.create(items[i])
        console.log(`Created ${item.name} - ${item._id}`)
    }
}


/* CHARACTERS */

if (args.includes('--characters')) {
    const { characters } = charactersData
    console.log('\nSeeding/reseeding characters...')

    const ancestries = await Ancestry.find({})

    if (!ancestries.length) {
        console.error('Ancestries must be seeded in order to seed characters!')
    }

    await Character.deleteMany({})

    for (let i = 0; i < characters.length; i++) {
        const relatedAncestry = await Ancestry.findOne({name: characters[i].ancestry})
        characters[i].ancestry = relatedAncestry._id
        const character = await Character.create(characters[i])
        console.log(`Created ${character.name} - ${character._id}`)
    }
}


// does not shut down gracefully so exit process directly
process.exit()