module.exports = app => {
    const admin = require("../controllers/admin");
  
    var router = require("express").Router();
  

    router.post("/sign_in", admin.signIn);
    router.post("/sign_up", admin.signUp);
    router.put("/resetPassword", admin.passwordReset);
    router.get("/get_all_user", admin.GetAllUser)
    router.post("/block_unblock_user", admin.BlockUnblockUser)
    router.get("/get_user_by_id/:id", admin.GetUserByID)

    router.post("/verifyEmail", admin.verifyEmail);
    router.post("/verifyOTP", admin.verifyOTP)
    router.post("/newPassword", admin.newPassword)
    router.post("/google_sign_in", admin.GooglesignIn);


    app.use('/admin', router);
  };