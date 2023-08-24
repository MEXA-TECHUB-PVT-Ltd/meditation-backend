module.exports = app => {
    const Auth = require("../controllers/auth");
  
    var router = require("express").Router();
    const upload = require("../middlewares/FolderImagesMulter")


    router.post("/sign_in",  Auth.signIn);
    router.post("/sign_up",upload.single('image'), Auth.signUp);
    router.post("/add_image",upload.single('image'), Auth.addImage);
    router.put("/resetPassword", Auth.passwordReset);
    router.post("/verifyEmail", Auth.verifyEmail);
    router.post("/verifyOTP", Auth.verifyOTP)
    router.post("/newPassword", Auth.newPassword)


    router.post("/all_plans_user", Auth.AllPlansUser)

    router.put("/update_subscription", Auth.updateSubscription)
    router.post("/all_subscribed_users", Auth.SubscribedUsers)

    // router.post("/google_sign_in", Auth.GooglesignIn);
    router.put("/update_profile",upload.single('image'), Auth.updateProfile);
    router.post("/total_users", Auth.AllUsers)
    router.get("/specific_user/:id", Auth.SpecificUser)
    router.put("/get_skill_progress", Auth.skillProgress);
    router.put("/restart_progress", Auth.RestartProgress);
    router.get("/get_years", Auth.getYears)
    router.post("/get_history", Auth.getHistory)
    router.post("/remove_progress", Auth.removeProgress)

    // router.put("/add_image", upload.single('image'),  Auth.addImage);
    // router.put("/add_cover_image", upload.single('image'),  Auth.addCoverImage);
    // router.post("/all_users", Auth.AllUsers)
    // router.delete("/delete_user/:id", Auth.DeleteUser)
    // router.get("/totay_added_users", Auth.todaysAddedUsers)
    
    router.post("/get_monthwise_users", Auth.getAllUsers_MonthWise_count)
    router.post("/get_monthwise_meditation", Auth.getAllMeditation_MonthWise_count)
    router.get("/get_years_meditation", Auth.getYearsMeditation)

    
    // router.get("/subscribed_user_count", Auth.SubscribedUserCount)
    // router.get("/subscribed_users", Auth.SubscribedUsers)

    // router.get("/block_users_count", Auth.BlockUserCount)
    // router.get("/block_users", Auth.BlockUsers)


    app.use('/auth', router);
  };