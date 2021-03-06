const multer = require('multer')

exports.uploadEpub = (epubFile) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/epub")
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ""))
        }
    })

    const fileFilter = function (req, file, cb) {
        if (file.fieldname === epubFile) {
            if(!file.originalname.match(/\.(EPUB|epub)$/)) {
                req.fileValidationError = {
                    message: "Only epub file are allowed!"
                }
                return cb(new Error("Only epub file are allowed!"), false)
            }
        }
        cb(null, true)
    }

    const sizeInMB = 10
    const maxSize = sizeInMB * 1000 * 1000

    const upload = multer({
        storage,
        fileFilter,
    }).single(epubFile)

    return(req, res, next) => {
        upload(req, res, function(err) {
            if(req.fileValidationError) {
                return res.status(400).send(req.fileValidationError)
            }

            if(!req.file && !err) {
                return res.status(400).send({
                    message: "Please select image or EPUB file to upload"
                })
            }

            return next()
        })
    }
}