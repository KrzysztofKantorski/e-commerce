    const multer = require("multer")

    const DIR = "./uploads"

    const storage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, DIR)
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname);
        }
    })

    const fileFilter = (req, file, cb) =>{
    if (file.mimetype === "image/jpeg" || 
            file.mimetype === "image/png" || 
            file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            cb({ message: "Unsupported file format" }, false);
        }
    }

    const upload = multer({
        storage: storage,
        limits: {filesize: 1024 * 1024},
        fileFilter: fileFilter
    })

    module.exports = upload