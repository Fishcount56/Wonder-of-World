const { user, userprofile } = require('../../models')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const data = req.body

    const schema = Joi.object({
        fullnameregister : Joi.string().min(3).required(),
        emailregister : Joi.string().email().min(5).required(),
        passwordregister : Joi.string().min(4).required(),
        role : Joi.string()
    })

    const { error } = schema.validate(data)

    if(error){
        return res.status(400).send({
            status: "Bad Request",
            message: error.details[0].message,
        })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.passwordregister, salt)
        const alreadyRegister = await user.findOne({
            where: {
                email: data.emailregister
            },
            attributes: {
                exclude: ['fullname','password','createdAt','updateAt']
            }
        })

        if(alreadyRegister){
            return res.status(400).send({
                status: "Bad Request",
                message: "Email aready registered"
            })
        }

        const newUser = await user.create({
            fullname : data.fullnameregister,
            email : data.emailregister,
            password : hashedPassword,
            role: "user"
        })

        const newUserProfile = await userprofile.create({
            idUser: newUser.id
        })

        res.status(201).send({
            status: "Success",
            data : {
                email : newUser.email
            }
        })
    } catch (error) {
        res.status(400).send({
            status: "Bad Request",
            message: error.details[0].message,
        });
    }
}

exports.login = async (req, res) => {
    const schema = Joi.object({
        emaillogin: Joi.string().email().min(5).required(),
        passwordlogin : Joi.string().min(4).required(),
    })

    const { error } = schema.validate(req.body)

    if (error) { 
        return res.status(400).send({
            error: {
                message : error.details[0].message
            }
        })
    }

    try {
        const userExist = await user.findOne({
            where: {
                email : req.body.emaillogin
            },
            attributes: {
                exclude: ['createdAt', 'updateAt']
            }
        })

        const isValid = await bcrypt.compare(req.body.passwordlogin, userExist.password)

        if(!isValid) { 
            return res.status(400).send({
                status: "failed",
                message : "Credential invalid!"
            })
        }

        const dataToken = {
            id : userExist.id
        }

        const TOKEN_KEY = process.env.TOKEN_KEY
        const token = jwt.sign(dataToken, TOKEN_KEY)

        res.status(200).send({
            status: "Success",
            data: {
                name: userExist.name,
                email: userExist.email,
                role: userExist.role,
                token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : "failed",
            message : "Server error"
        })
    }
}

exports.checkAuth = async (req, res) => {
    try {
      const id = req.user.id;
  
      const dataUser = await user.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });

      if (!dataUser) {
        return res.status(404).send({
          status: "failed",
        });
      }
  
      res.send({
        status: "success...",
        data: {
          user: {
            id: dataUser.id,
            name: dataUser.fullname,
            email: dataUser.email,
            role: dataUser.role,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status({
        status: "failed",
        message: "Server Error",
      });
    }
  };