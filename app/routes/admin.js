module.exports = app => {
    const admin = require("../controllers/admin");
  
    var router = require("express").Router();
  

    router.post("/sign_in", admin.signIn);
    router.post("/sign_up", admin.signUp);
    router.post("/verify_OTP_sign_in", admin.verifyOTPSignIn);
    router.put("/resetPassword", admin.resetPassword);
    router.put("/verify_OTP_change_password", admin.verifyOTPChangePassword);
    router.put("/update_profile", admin.updateProfile);

    router.post("/get_all_user", admin.GetAllUser)
    router.post("/block_unblock_user", admin.BlockUnblockUser)
    router.get("/get_user_by_id/:id", admin.GetUserByID)
    router.get("/all_plans_count", admin.AllPlansCount);

    router.post("/verifyEmail", admin.verifyEmail);
    router.post("/verifyOTP", admin.verifyOTP)
    router.post("/newPassword", admin.newPassword)
    router.post("/google_sign_in", admin.GooglesignIn);
    router.get("/get_admin_by_id/:id", admin.GetAdminByID);


    app.use('/admin', router);
  };