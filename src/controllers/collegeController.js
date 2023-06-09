const collegeModel = require('../models/collegeModel')
const validator = require('validator')


// ### POST /functionup/colleges
// - Create a college - a document for each member of the group
// - The logo link will be provided to you by the mentors. This link is a s3 (Amazon's Simple Service) url. Try accessing the link to see if the link is public or not.

//   `Endpoint: BASE_URL/functionup/colleges`
//   {
//     status: true,
    // data: {
    //       "name" : "iith",
    //       "fullName" : "Indian Institute of Technology, Hyderabad",
    //       "logoLink" : "https://functionup.s3.ap-south-1.amazonaws.com/colleges/iith.png",
    //       "isDeleted" : false
    //        }
//   }

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
            data: {
                name: data.name,
                fullName: data.fullName,
                logoLink: data.logoLink,
                isdeleted: data.isDeleted
            }
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}


// ### GET /functionup/collegeDetails
// - Returns the college details for the requested college (Expect a query parameter by the name `collegeName`. This is anabbreviated college name. For example `iith`)
// - Returns the list of all interns who have applied for internship at this college.
// - The response structure should look like [this](#college-details)

const internsList= async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}


module.exports= {createCollege, internsList}
