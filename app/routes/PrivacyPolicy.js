module.exports = app => {


    const PrivacyPolicy = require("../controllers/PrivacyPolicy");

    let router = require("express").Router();

    router.post("/add_privacy_policy", PrivacyPolicy.AddPrivacyPolicy);
    router.put("/update_privacy_policy", PrivacyPolicy.UpdatePrivacyPolicy);
    router.delete("/delete_privacy_policy/:id", PrivacyPolicy.DeletePrivacyPolicy);
    router.get("/view_privacy_policy", PrivacyPolicy.ViewPrivacyPolicy);

    app.use("/privacy_policy", router);
};
