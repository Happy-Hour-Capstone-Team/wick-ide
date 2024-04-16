const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const { writeFile } = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const userCode = req.body.code;

  writeFile("usercode.wick", userCode, (err) => {
    if (err) {
      res.status(500).json({ error: "Failed to write user code to file" });
      return;
    }

    exec("java Main usercode.wick", (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ error: "Failed to execute Java program" });
        return;
      }

      res.json({ output: stdout });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
