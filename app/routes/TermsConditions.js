module.exports = app => {


    const TermsConditions = require("../controllers/TermsConditions");

    let router = require("express").Router();

    router.post("/add_terms_conditions", TermsConditions.AddTermsConditions);
    router.put("/update_terms_conditions", TermsConditions.UpdateTermsConditions);
    router.delete("/delete_terms_conditions/:id",TermsConditions.DeleteTermsConditions );
    router.get("/specific_terms_conditions", TermsConditions.ViewTermsConditions);

    app.use("/terms_conditions", router);
};
