const { default: mongoose } = require('mongoose')
const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const validator = require('validator')

const intership= async (req, res) => {
    try {
        let { name, mobile, email, collegeName }= req.body

        if (typeof name !== "string" || typeof mobile !== "string" || 
        typeof email !== "string" || typeof collegeName !== "string") {
            return res.status(400).send({
                status: false,
                message: "Please provide correct types for all fields"
            })
        }
        
        if (!name.trim() || !mobile.trim() || !email.trim() || !collegeName.trim()) {
            return res.status(400).send({
                status: false,
                message: "please provide all detail"
            })
        }

        const emailValidate= validator.isEmail(email)
        if (!emailValidate) {
            return res.status(400).send({
                status: false,
                message: "please provide valid email"
            })
        }

        const mobilValidate= validator.isMobilePhone(mobile)
        if (!mobilValidate) {
            return res.status(400).send({
                status: false,
                message: "please provide valid mobile number"
            })
        }

        const emailAlreadyExit= await internModel.findOne({email: email})
        if (emailAlreadyExit) {
            return res.status(400).send({
                status: false,
                message: `this email ${email} is already registered`
            })
        }

        const mobileAlreadyExit= await internModel.findOne({mobile: mobile})
        if (mobileAlreadyExit) {
            return res.status(400).send({
                status: false,
                message: `this mobile number ${mobile} is already registered`
            })
        }

        const collegeNameExit= await collegeModel.findOne({name: collegeName})
        if (!collegeNameExit) {
            return res.status(404).send({
                status: false,
                message: `${collegeName} is not exit`
            })
        }

        req.body.collegeId = collegeNameExit._id

        const data= await internModel.create(req.body)

        res.status(201).send({
            status: true,
            data: {
                name: data.name, 
                mobile: data.mobile, 
                email: data.email, 
                collegeId: data.collegeId,
                isDeleted: data.isDeleted
            }
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}


module.exports= {intership}