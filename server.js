import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import { promises as fs } from "fs";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post("/compile-and-run", async (req, res) => {
  try {
    const { code } = req.body;

    await fs.writeFile("test.wick", code);

    const pythonProcess = spawn("python", ["test.wick"]);

    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data;
      console.log(`Python output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      res.json({ output: output, error: null });
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
