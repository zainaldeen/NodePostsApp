const multer = require('multer');

exports.fileStorage = multer.diskStorage({
    destination: (req, file,  cb) => {
        cb(null, 'storage');
    },
    filename: (req, file,  cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
})

exports.fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    }
    cb(null, false);
}

exports.handleErrors = (message, statusCode, data = null) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.data = data;
    return error;
}
