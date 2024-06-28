var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")
const BOOKS = require("../model/bookModel");
const { log } = require('console');

const upload = require("../utils/multer").single("image")

router.get('/', function (req, res, next) {
  res.render('index')
});

router.get('/home', function (req, res, next) {
  res.render('home')
});

router.get('/about', function (req, res, next) {
  res.render('about')
});

router.get('/library', async function (req, res, next) {
  try {
    const books = await BOOKS.find()
    res.render("library", { books: books })
  } catch (error) {
    res.send(error)
  }


});

router.get('/create', function (req, res, next) {
  res.render("create")
});


router.post('/file/create',upload,async function (req, res, next) {


  try{
    const newBook =await BOOKS({...req.body,image:req.file.filename})
      await newBook.save();
    res.redirect("/library")
  } catch (err) {
    res.send(err)
  }


});

router.get('/delete/:id', async function (req, res, next) {
  try {
    const book = await BOOKS.findByIdAndDelete(req.params.id)
    fs.unlinkSync(path.join(__dirname, "..", "public", "images", book.image))
    res.redirect("/library")
  } catch (error) {
    res.send(error)
  }

})

router.get('/update/:id', async function (req, res, next) {
  try {
    const book = await BOOKS.findById(req.params.id)
    res.render("update", { book: book })
  } catch (error) {
    res.send(error)
  }

});
router.post('/update/:id', upload, async function (req, res, next) {
  try {
    const updateddata = { ...req.body }
  
    if (req.file) {

      updateddata.image = req.file.filename
      fs.unlinkSync(path.join(__dirname, "..", "public", "images", req.body.oldimage))
    }
    await BOOKS.findByIdAndUpdate(req.params.id, updateddata)
    res.redirect("/library")
  } catch (error) {
    res.send(error)
  }

});

module.exports = router;
