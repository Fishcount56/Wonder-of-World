const { user, userprofile } = require('../../models')

// Get user profile 

exports.userProfile = async(req, res) => {
    try {
        let Profile = await userprofile.findOne({
            where: {
                idUser : req.user.id
            },
            include: [
                {
                    model: user,
                    as: "ProfileUser",
                    attributes: {
                        exclude:['email','password','role','createdAt','updatedAt']
                    }
                }
            ],
            attributes: {
                exclude: ['id','createdAt','updatedAt']
            }
        })
        Profile = JSON.parse(JSON.stringify(Profile));
        Profile = {
            ...Profile,
            userPhoto: Profile.userPhoto ? process.env.PATH_FILE_USER + Profile.userPhoto : null
        }
        res.send({
            status: "Success",
            data : {
                Profile
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "Error"
        })
    }
}

exports.editProfile = async(req, res) => {
    try {
        const profileEdit = await userprofile.update({
            gender: req.body.gender,
            phoneNumber : req.body.phoneNumber,
            address: req.body.address,
            userPhoto: req.file.filename
        },{
            where : {
                idUser : req.user.id
            }
        })
        res.send({
            status: "Success"
        })
    } catch (error) {
        res.send({
            status: "Error"
        })
    }
}