import express from 'express'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    message: "Welcome to the 1400+ API! Available endpoints will be listed below...",
    endpoints: [
      '/characters',
      '/rules',
      '/skills',
      '/spells',
      '/trainings',
      'and more to come...'
    ]
  })
});

export default router