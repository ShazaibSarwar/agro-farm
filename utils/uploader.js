const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storageWithPath = (dirPath) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const today = new Date().toDateString().replaceAll(' ', '_');
            const uploadPath = path.join(__dirname, `/../public/${dirPath}/${today}`);
            console.log('Upload path: ---->  ' + uploadPath)
            if (!fs.existsSync(uploadPath)) {
                try {
                    fs.mkdirSync(uploadPath);
                } catch (err) {
                    console.error('error',err);
                }
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {

            cb(null, file.originalname.split('.').join('') + "_" + Date.now() + path.extname(file.originalname));
        }
    });
};

const upload = (dirPath) => multer({ storage: storageWithPath(dirPath) });

module.exports = { upload };
