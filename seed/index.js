import mongoose from '../models/index.js'

import Ancestry from '../models/Ancestry.js'
import Character from '../models/Character.js'
import ItemTemplate from '../models/ItemTemplate.js'
import Profession from '../models/Profession.js'
import Ritual from '../models/Ritual.js'
import Spell from '../models/Spell.js'
import Training from '../models/Training.js'
import User from '../models/User.js'

import ancestriesData from './ancestries-seed.json' with { type: 'json' }
import charactersData from './characters-seed.json' with { type: 'json' }
import itemsData from './items-seed.json' with { type: 'json' }
import professionsData from './professions-seed.json' with { type: 'json' }
import ritualsData from './rituals-seed.json' with { type: 'json' }
import spellsData from './spells-seed.json' with { type: 'json' }
import trainingsData from './trainings-seed.json' with { type: 'json' }
import usersData from './users-seed.json' with { type: 'json' }

import { toCamelCase } from '../_commonHelpers.js'

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
        '\n  --professions',
        '\n  --rituals',
        '\n  --spells',
        '\n  --users',
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

        // add prerequisites from previously seeded trainings
        if (trainings[i].prereqs) {
            console.log(`${trainings[i].name} training prereqs: `, trainings[i].prereqs.join())
            trainings[i].prerequisites = trainings[i].prereqs.map(p => seededTrainings[p]?._id)
        }

        const key = toCamelCase(trainings[i].name)

        const training = await Training.create({ ...trainings[i], key })

        seededTrainings[training.key] = training

        console.log(`Created ${training.name} - ${training._id}`)
    }

}


/* PROFESSIONS */

if (args.includes('--professions')) {
    const { professions } = professionsData

    console.log('\nSeeding/reseeding professions...')

    const trainings = await Training.find({})

    if (!trainings.length) {
        console.error('Trainings must be seeded in order to seed professions!')
    }

    const items = await ItemTemplate.find({})

    if (!items.length) {
        console.error('Items must be seeded in order to seed professions!')
    }

    await Profession.deleteMany({})

    for (let i = 0; i < professions.length; i++) {
        const profession = professions[i]

        profession.equipmentGuaranteed = items
            .filter(item => profession.equipmentGuaranteed.includes(item.name.toLowerCase()))
            .map(item => item._id)

        profession.trainings = trainings
            .filter(training => profession.trainings.includes(toCamelCase(training.name)))
            .map(training => training._id)

        profession.key = toCamelCase(profession.name)

        const newProfession = await Profession.create(profession)
        console.log(`Created ${newProfession.name} - ${newProfession._id}`)     
    }
    
}


/* USERS */

if (args.includes('--users')) {
    const { users } = usersData

    console.log('\nSeeding/reseeding users...')

    await User.deleteMany({})

    for (let i = 0; i < users.length; i++) {
        // delete specific users from seed instead of all
        const user = await User.create(users[i])

        console.log(`Created ${user.username} - ${user._id}`)
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

    const users = await User.find({})

    if (!users.length) {
        console.error('Users must be seeded in order to seed characters!')
    }

    const spells = await Spell.find({})
    const rituals = await Ritual.find({})

    await CharacterSpell.deleteMany({})
    await CharacterRitual.deleteMany({})
    await Character.deleteMany({})

    for (let i = 0; i < characters.length; i++) {
        const relatedAncestry = await Ancestry.findOne({ name: characters[i].ancestry })
        characters[i].ancestry = relatedAncestry._id

        const relatedUser = users[Math.floor(Math.random() * users.length)]
        console.log('relatedUser: ', relatedUser.username)
        characters[i].user = relatedUser._id

        if (spells.length) {
            const sp1 = spells[Math.floor(Math.random() * spells.length)]._id
            const sp2 = spells[Math.floor(Math.random() * spells.length)]._id
            if (sp1 !== sp2) {
                characters[i].spells = [sp1, sp2]
            }
        }

        if (rituals.length) {
            const r1 = rituals[Math.floor(Math.random() * rituals.length)]._id
            const r2 = rituals[Math.floor(Math.random() * rituals.length)]._id
            if (r1 !== r2) {
                characters[i].rituals = [r1,r2]
            }
        }

        characters[i].gold = Math.floor(Math.random() * 20)

        const character = await Character.create(characters[i])
        console.log(`Created ${character.name} - ${character._id}`)
    }
}


// does not shut down gracefully so exit process directly
process.exit()