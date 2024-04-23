const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const fs = require("fs").promises;
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post("/compile-and-run", async (req, res) => {
  try {
    const { code } = req.body;
    await fs.writeFile("temp.cpp", code);

    exec("g++ temp.cpp -o tempExecutable", async (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ error: stderr });
        return;
      }

      const pythonProcess = spawn("python", ["script.py"]);

      pythonProcess.stdout.on("data", (data) => {
        console.log(`Python output: ${data}`);
        // Save output to test.wick
        fs.writeFile("test.wick", data);
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python error: ${data}`);
      });

      pythonProcess.on("close", (code) => {
        console.log(`Python process exited with code ${code}`);
        // Read the content of test.wick and send it as response
        fs.readFile("test.wick", "utf-8", (err, content) => {
          if (err) {
            res.status(500).json({ error: "Error reading file" });
          } else {
            res.json({ output: content, error: null });
          }
        });
      });

      exec("./tempExecutable", async (execError, execStdout, execStderr) => {
        if (execError) {
          res.status(500).json({ error: execStderr });
          return;
        }

        // Save output to test.wick
        await fs.writeFile("test.wick", execStdout);

        // Read the content of test.wick and send it as response
        fs.readFile("test.wick", "utf-8", (err, content) => {
          if (err) {
            res.status(500).json({ error: "Error reading file" });
          } else {
            res.json({ output: content, error: null });
          }
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
