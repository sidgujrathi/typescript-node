import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';

const publicDir = './public';
const imgDir = './public/images';

if (!existsSync(publicDir)) {
    mkdirSync(publicDir);
}

if (!existsSync(imgDir)) {
    mkdirSync(imgDir);
}

const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, imgDir);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

const uploads = multer({ storage: Storage });

export default uploads;
