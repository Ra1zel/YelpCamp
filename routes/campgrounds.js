const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const catchAsync = require('../utils/cathAsync');
const expressError = require('../utils/expressError');
const campgroundSchema = require('../schemas');
const Campground = require('../models/campground');
const {isLoggedin , isAuthor , validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const uploads = multer({storage})


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedin ,uploads.array('image'), validateCampground ,catchAsync(campgrounds.createCampground))
    // .post(uploads.array('image'),(req,res)=>{
    //     console.log(req.file,req.body)
    //     res.send(req.file)
    // })

router.get('/new', isLoggedin , catchAsync(campgrounds.renderNewForm))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedin , isAuthor, uploads.array('image'),validateCampground ,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedin , isAuthor,catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.renderEditForm))
module.exports = router;