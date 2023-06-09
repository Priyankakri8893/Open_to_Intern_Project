const express = require('express')
const router = express.Router()

const {createCollege, internsList} = require('../controllers/collegeController')
const {intership} = require('../controllers/internController')

router.post('/functionup/colleges', createCollege)
router.post('/functionup/interns', intership)
router.get('/functionup/collegeDetails', internsList)


module.exports= router