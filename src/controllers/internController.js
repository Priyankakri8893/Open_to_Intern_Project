const { default: mongoose } = require('mongoose')
const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const validator = require('validator')


// ### POST /functionup/interns
// - Create a document for an intern. 
// - Also save the collegeId along with the document. Your request body contains the following fields - { name, mobile, email, collegeName}
// - Return HTTP status 201 on a succesful document creation. Also return the document. The response should be a JSON object like [this](#Intern) 

// {
//     status: true,
//     data: {
//           "isDeleted" : false,
//           "name" : "Jane Does",
//           "email" : "jane.doe@iith.in",
//           "mobile" : "90000900000",
//           "collegeId" : ObjectId("888771129c9ea621dc7f5e3b")
//           }
//   }

const intership= async (req, res) => {
    try {
        const { name, mobile, email, collegeId }= req.body

        if (!name.trim() || !mobile.trim() || !email.trim() || !collegeId) {
            return res.status(400).send({
                status: false,
                message: "please provide all detail"
            })
        }

        if (typeof name !== "string" || typeof mobile !== "string" || 
        typeof email !== "string") {
            return res.status(400).send({
                status: false,
                message: "Please provide correct types for all fields"
            })
        }
        
        const idValidate= mongoose.isValidObjectId(collegeId)
        if (!idValidate) {
            return res.status(400).send({
                status: false,
                message: "please provide valid collegeId"
            })
        }

        const emailValidate= validator.isEmail(email)
        if (!emailValidate) {
            return res.status(400).send({
                status: false,
                message: "please provide valid email"
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

        const collegeIdExit= await collegeModel.findOne({_id: collegeId})
        if (!collegeIdExit) {
            return res.status(404).send({
                status: false,
                message: `${collegeId} is not exit`
            })
        }

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