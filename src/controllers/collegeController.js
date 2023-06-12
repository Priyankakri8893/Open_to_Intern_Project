const collegeModel = require('../models/collegeModel')
const validator = require('validator')
const internModel = require('../models/internModel')

const createCollege= async (req, res) => {
    try {
        const {name, fullName, logoLink}= req.body

        if (!name || !fullName || !logoLink) {
            return res.status(400)
            .send({
                status: false,
                message: "please provide all detail"
            })
        }

        if (typeof name !== "string" || typeof fullName !== "string" || 
        typeof logoLink !== "string") {
            return res.status(400).send({
              status: false,
              message: "Please provide correct types for all fields"
            });
          }

        const nameAlreadyExit= await collegeModel.findOne({name: name})
        if(nameAlreadyExit){
            return res.status(400).send({
                status: false,
                message: `${name} is already registered`
            })
        }
        
        if (!validator.isURL(logoLink)) {
            return res.status(400).send({
              status: false,
              message: "Please provide a valid logo link"
            });
          }
        
        const data= await collegeModel.create(req.body)

        res.status(201).send({
            status: true,
            data: data
            // data: {
            //     name: data.name,
            //     fullName: data.fullName,
            //     logoLink: data.logoLink,
            //     isdeleted: data.isDeleted,
            // }
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// **************************************************************************** //

const internsList= async (req, res) => {
    try {
        const name= req.query.collegeName
        if (!name) {
            return res.status(400).send({
                status: false,
                message: "please provide collegeName to get data"
            })
        }

        const college= await collegeModel.findOne({name: name})
        if (!college) {
            return res.status(404).send({
                status: false,
                message: `${name} is not exit`
            })
        }

        const internsList= await internModel
        .find({collegeId: college._id}).select({
            name: 1,
            email: 1,
            mobile: 1
          })
        if (internsList.length === 0) {
            return res.status(200).send({
                status: true,
                "data": {
                    name: college.name,
                    fullName: college.fullName,
                    logoLink: college.logoLink,
                    interns: "no apply for any internship"
                }
            })
        }

        return res.status(200).send({
            status: true,
            "data": {
                name: college.name,
                fullName: college.fullName,
                logoLink: college.logoLink,
                interns: internsList
            }
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        }) 
    }
}


module.exports= {createCollege, internsList}
