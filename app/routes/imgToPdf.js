module.exports = app => {

  const imgToPdf = require("../controllers/imgToPdf");

  const upload = require("../middlewares/FolderImagesMulter")

  let router = require("express").Router();

  
  router.post("/convert_images_to_pdf", upload.array('pdf'), imgToPdf.imgToPdf);


  app.use("/imgToPdf", router);
};
