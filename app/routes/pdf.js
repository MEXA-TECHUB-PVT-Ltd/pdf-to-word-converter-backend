module.exports = app => {

  const pdf = require("../controllers/pdf");

  const upload = require("../middlewares/FolderImagesMulter")

  let router = require("express").Router();

  router.post("/lock_pdf", upload.array('pdf'), pdf.lockPdf);
  router.post("/unlock_pdf", upload.array('pdf'), pdf.unlockPdf);
  router.post("/merge_pdfs", upload.array('pdf'), pdf.mergePdf);


  app.use("/pdf", router);
};
