module.exports = app => {

    const pdfToDoc = require("../controllers/pdfToDoc");

    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/convert_pdf_to_doc", upload.array('pdf'), pdfToDoc.pdfToDoc);
    router.get("/get_all_word",  pdfToDoc.getAllWord);


    app.use("/pdfToDoc", router);
};
