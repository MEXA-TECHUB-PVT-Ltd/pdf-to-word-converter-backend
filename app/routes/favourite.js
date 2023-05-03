module.exports = app => {


    const favourite = require("../controllers/favourite");

    let router = require("express").Router();

    router.post("/add_pdf_to_fav", favourite.addPdfInFav);
    router.delete("/delete_pdf_from_fav/:id", favourite.deletePdfInFav);
    router.post("/view_all_pdf_in_fav", favourite.viewAllPdfInFav);

    router.post("/add_word_to_fav", favourite.addWordInFav);
    router.delete("/delete_word_from_fav/:id", favourite.deleteWordInFav);
    router.post("/view_all_word_in_fav", favourite.viewAllWordInFav);


    app.use("/favourite", router);
};
