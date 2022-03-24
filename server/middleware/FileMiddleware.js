const util = require("util");
const multer = require("multer");
const path = require("path");
const maxSize = 5 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            cb(null, __basedir + "/resources/static/assets/uploads/");
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now() + path.extname(file.originalname)}`);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;