const { user, book } = require('../../models')
const { Sequelize, sequelize } = require('../../models') 


const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'Desember'
  ]

exports.getBooks = async (req, res) => {
    try {
        const Book = await book.findAll({
            attributes: {
                include: [
                    'id','title',
                   [Sequelize.fn('date_format', sequelize.col('publicationDate'), '%M, %Y'), 'publicationDate'],
                   'pages','author','isbn','about','bookFile'
                ],
                exclude: ['createdAt','updatedAt'],
            },
            raw: true,
        })

        Book.map((item) => item.bookCover = process.env.PATH_FILE_BOOK + item.bookCover)
        res.send({
            status: "Success",
            Book
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error"
        })
    }
}

exports.addBook = async (req, res) => {
    try {
        const checkUser = await user.findOne({
            where: {
                id: req.user.id
            },
            attributes: {
                exclude: ['updatedAt','createdAt','password'] 
            }
        })

        const asAdmin = checkUser.role

        if(asAdmin != 'admin'){
            return res.status(403).send({
                status: "Forbidden",
                message: "You have no right for this access"
            })
        }


        const { ...data } = req.body

        const newBook = await book.create({
            ...data,
            bookFile: req.files.bookFile[0].filename,
            bookCover: req.files.bookCover[0].filename
        })
        newBook.bookFile = newBook.bookFile.filename
        newBook.bookCover = newBook.bookCover.filename
        let bookData = await book.findOne({
            where: {
                id: newBook.id
            },
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        })

        bookData = JSON.parse(JSON.stringify(bookData))
        res.send({
            status: "Success",
            Book: {
                ...bookData
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Failed",
            message: "Server Error"
        })
    }
}

exports.getBook = async (req, res) => {
    try {
        const { id } = req.params
        const Book = await book.findOne({
            where: {
                id
            },
            attributes: {
                include: [
                    'id','title',
                   [Sequelize.fn('date_format', sequelize.col('publicationDate'), '%M, %Y'), 'publicationDate'],
                   'pages','author','isbn','about','bookFile'
                ],
                exclude: ['createdAt','updatedAt']
            }
        })
        Book.bookFile = process.env.PATH_FILE_BOOK + Book.bookFile
        Book.bookCover = process.env.PATH_FILE_BOOK + Book.bookCover
        res.send({
            status: "Success",
            Book
        })
    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error"
        })
    }
}

exports.updateBook = async (req, res) => {
    const { id } = req.params
    try {
        const checkUser = await user.findOne({
            where: {
                id: req.user.id
            },
            attributes: {
                exclude: ['updatedAt','createdAt','password'] 
            }
        })

        const asAdmin = checkUser.role

        if(asAdmin != 'admin'){
            return res.status(403).send({
                status: "Forbidden",
                message: "You have no right for this access"
            })
        }

        await book.update(req.body, {
            where: {
                id
            }
        })
        res.send({
            status:"Success",
            message:`Book with id ${id} has updated`,
            data: req.body
        })
    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error"
        })
    }
}

exports.deleteBook = async (req, res) => {
    try {
        const checkUser = await user.findOne({
            where: {
                id: req.user.id
            },
            attributes: {
                exclude: ['updatedAt','createdAt','password'] 
            }
        })

        const asAdmin = checkUser.role

        if(asAdmin != 'admin'){
            return res.status(403).send({
                status: "Forbidden",
                message: "You have no right for this access"
            })
        }

        const { id } = req.params
        await book.destroy({
            where:{
                id
            }
        })

        res.send({
            status: "Success",
            data: {
                id : id
            }
        })
    } catch (error) {
        res.send({
            status: "Failed",
            Message: "Server Error"
        })
    }
}

exports.getBookWithLimit = async(req,res) => {
    try {
        const limitedBook = await book.findAll({
            order: sequelize.random(),
            limit: 2
        })
        res.status(200).send({
            status: 'Success',
            data: {
                limitedBook
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'Failed'
        })
    }
}