const express = require("express");
const path = require("path");
// const morgan = require("morgan");

const app = express();

//LOGGING
// app.use(morgan("combined"));

//PARSE POST IN JSON. CREATES req.body
app.use(express.json());
//TO SERVE THE REACT BUILD FOLDER STATICALY IN PRODUCTION. IN THIS CASE, IT WILL BE SERVED WITH THE 8000 INSTEAD OF 3000 PORT
app.use(express.static(path.join(__dirname, "../public")));

//ROUTES
// app.use("/v1", api);

//SERVE PUBLIC/INDEX.HTML AS ROOT
// /* to match the react routes- not matched above
// app.get("/*", (req, res) =>
//   res.sendFile(path.join(__dirname, "public", "index.html"))
// );

module.exports = app;
