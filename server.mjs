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

    const wickProcess = spawn("wick", ["test.wick"]);

    let output = "";

    wickProcess.stdout.on("data", (data) => {
      output += data;
      console.log(`Wick output: ${data}`);
    });

    wickProcess.stderr.on("data", (data) => {
      console.error(`Wick error: ${data}`);
    });

    wickProcess.on("close", (code) => {
      console.log(`Wick process exited with code ${code}`);
      res.json({ output: output });
    });
  } catch (err) {
    console.error("Error executing Wick code:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
