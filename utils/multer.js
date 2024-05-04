const path = require("path")
const multer = require("multer")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
  },
 
})

// const fileFilter = (req, file, cb) => {
//   console.log(file);
//   let allowedfiles = /png|jpg|jpeg|svg|webp|gif/;
//   let minetype = allowedfiles.test(file.minetype);
//   let extname = allowedfiles.test(path.extname(file.originalname).toLowerCase());
//   if (extname && minetype) {
//     cb(null, true)
//   }else{
//     cb(`Error:only ${allowedfiles} images extensions are allowed`)
//   }
// }
const upload = multer({ storage: storage})
module.exports = upload
//, fileFilter: fileFilter 