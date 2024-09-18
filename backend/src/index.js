const express = require("express");
const app = express();
const cors = require("cors");
const mainRouter = require("./routes/index");
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // for parsing application/json

app.use(express.json());
app.use("/api", mainRouter);
app.use(cors());

app.listen(3000);
