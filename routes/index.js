var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")
const BOOKS = require("../model/bookModel");
const { log } = require('console');
// const Books = [];
const upload = require("../utils/multer").single("image")
// console.log(bookstore);
/* GET home page. */
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
  // BOOKS.find().then((books) => {
  //   res.render("library", { books: books })
  // }).catch((err) => res.send(err))
  // res.render('library', { books: Books })

});

router.get('/create', function (req, res, next) {
  res.render("create")
});


router.post('/file/create',upload, async function (req, res, next) {


  try{
    const newBook = new BOOKS({...req.body,image:req.file.filename})
      await newBook.save();
    res.redirect("/library")
  } catch (err) {
    res.send(err)
  }
    // res.json({ body: req.body, file: req.file })


  // Books.push(req.body)
  // res.redirect("/library")
  // BOOKS.create(req.body).then(()=>{
  //   res.redirect("/library")
  // }).catch((err)=>res.send(err))

});

router.get('/delete/:id', async function (req, res, next) {
  try {
    const book = await BOOKS.findByIdAndDelete(req.params.id)
    fs.unlinkSync(path.join(__dirname, "..", "public", "images", book.image))
    res.redirect("/library")
  } catch (error) {
    res.send(error)
  }
  // Books.splice(req.params.index, 1)
  // res.redirect("/library")
});

router.get('/update/:id', async function (req, res, next) {
  try {
    const book = await BOOKS.findById(req.params.id)
    res.render("update", { book: book })
  } catch (error) {
    res.send(error)
  }
  // const i = req.params.index //for storing index of  array
  // const b = Books[i]    //for sotring value of arrayindex
  // res.render("update", { book: b, index: i })
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
  // const i = req.params.index  //for storing index of  array
  // Books[i] = req.body
  // res.redirect("/library")
});

module.exports = router;
