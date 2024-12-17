import express from 'express'
import Profession from '../models/Profession.js'
import { checkExistence } from '../helpers.js'

const router = express.Router();


/* GET /professions */
router.get('/', async (req, res, next) => {
// TODO: names query currently not working (partially due to not capitalizing)
    const profession = await Profession.find({...req.query}).populate('trainings').populate('equipmentGuaranteed')
    res.json({result: profession, query: req.query})
});


/* GET /professions/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const profession = await Profession.findById(req.params.id).populate('trainings').populate('equipmentGuaranteed').exec()

        if (checkExistence(profession, res, next)) {
          res.json(profession)
        }

    } catch (err) {
        res.status(500)
        next(err)

    }
});


export default router