import express from 'express'
const router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.json({
//     message: "Welcome to the 1400+ API! Available endpoints will be listed below...",
//     endpoints: [
//       'GET POST /characters',
//       'GET PATCH DELETE /characters/:id',
//       'GET /ancestries OPTIONAL QUERY name',
//       'GET /items OPTIONAL QUERY name',
//       'GET /items/:id',
//       'GET /spells OPTIONAL QUERY name',
//       'GET /spells/:id',
//       'GET /rituals OPTIONAL QUERY name',
//       'GET /rituals/:id'
//     ]
//   })
// });

// router.get('/creator-options', (req, res, next) => {
//   res.json({ message: "Options for building characters will go here (ancestries, skills, professions etc.)" })
// })

export default router