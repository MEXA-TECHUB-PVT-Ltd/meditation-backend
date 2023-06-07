const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); 
const app = express();
const dbConfig = require('./app/config/db.config')
require('dotenv').config()
var corsOptions = {
  // origin: "http://localhost:8081"s
};
app.use(cors()) // Use this
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.static("files"));
app.use(express.urlencoded({ extended: true }));   
app.use("/images_uploads", express.static("images_uploads"))


app.get("/", (req, res) => {
  res.json({ message: "Welcome to Meditation App!" });
});

require("./app/routes/admin")(app);
require("./app/routes/auth")(app);
require("./app/routes/Goal")(app);
require("./app/routes/Skill")(app);
require("./app/routes/Exercise")(app);
require("./app/routes/RestTime")(app);
require("./app/routes/RelaxationMusic")(app);
require("./app/routes/MeditationPlan")(app);
require("./app/routes/YogaPlan")(app);
require("./app/routes/FoundationPlan")(app);
require("./app/routes/Reminder")(app);
require("./app/routes/waterTracking")(app);
require("./app/routes/Favorites")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

