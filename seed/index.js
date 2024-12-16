import mongoose from '../models/index.js'

import Ancestry from '../models/Ancestry.js'
import Character from '../models/Character.js'
import ItemTemplate from '../models/ItemTemplate.js'
import Ritual from '../models/Ritual.js'
import Spell from '../models/Spell.js'
import Training from '../models/Training.js'

import ancestriesData from './ancestries-seed.json' with { type: 'json' }
import charactersData from './characters-seed.json' with { type: 'json' }
import itemsData from './items-seed.json' with { type: 'json' }
import ritualsData from './rituals-seed.json' with { type: 'json' }
import spellsData from './spells-seed.json' with { type: 'json' }
import trainingsData from './trainings-seed.json' with { type: 'json' }

import { toCamelCase } from '../helpers.js'

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
        '\n  --spells',
        '\n  --rituals',
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


/* SPELLS */

if (args.includes('--spells')) {
    const { spells } = spellsData
    console.log('\nSeeding/reseeding spells...')

    await Spell.deleteMany({})

    for (let i = 0; i < spells.length; i++) {
        const key = toCamelCase(spells[i].name)
        const spell = await Spell.create({ ...spells[i], key })
        console.log(`Created ${spell.name} - ${spell._id}`)
    }
}


/* RITUALS */

if (args.includes('--rituals')) {
    const { rituals } = ritualsData
    console.log('\nSeeding/reseeding rituals...')

    await Ritual.deleteMany({})

    for (let i = 0; i < rituals.length; i++) {
        const key = toCamelCase(rituals[i].name)
        const ritual = await Ritual.create({ ...rituals[i], key })
        console.log(`Created ${ritual.name} - ${ritual._id}`)
    }
}


/* TRAININGS */

if (args.includes('--trainings')) {
    const { trainings } = trainingsData
    console.log('\nSeeding/reseeding trainings...')

    console.log('NOTE: Trainings with prerequisites must be seeded after their prerequisites!')

    await Training.deleteMany({})

    const seededTrainings = {}

    for (let i = 0; i < trainings.length; i++) {
        const key = toCamelCase(trainings[i].name)

        // add prerequisites from previously seeded trainings
        if (trainings[i].prereqs) {
            trainings[i].prerequisites = trainings[i].prereqs.map(p => seededTrainings[key]?._id)
        }

        const training = await Training.create({ ...trainings[i], key })
        seededTrainings[training.key] = training

        console.log(`Created ${training.name} - ${training._id}`)
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