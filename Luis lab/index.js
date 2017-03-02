var express = require("express");

var port = (process.env.PORT || 16778);
var app = express();

var publicFolder = path.join(__dirname, 'public');
app.use("/", express.static(publicFolder));

app.get("/hello", (req, res) => {
    res.send("<html><body>Hi there!</body></html>")
})

app.listen(port, () =>  {
    console.log("Magic id happening on port " + port);
}).on('error', (error) => {
    console.log("Server can not be started: " + error);
});