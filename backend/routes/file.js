const express = require('express');
const { getFiles, uploadFile } = require('../controller/file');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const singleUpload = require('../middlewares/multer');

router.route("/files").get(getFiles);
router.route("/file/upload").post(isAuthenticated, singleUpload, uploadFile);

module.exports = router;