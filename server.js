const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs').promises;
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post('/compile-and-run', async (req, res) => {
    try {
        const { code } = req.body;
        await fs.writeFile('temp.cpp', code);

        exec('g++ temp.cpp -o tempExecutable', (error, stdout, stderr) => {
            if (error) {
                res.status(500).json({ error: stderr });
                return;
            }

            exec('./tempExecutable', (execError, execStdout, execStderr) => {
                if (execError) {
                    res.status(500).json({ error: execStderr });
                    return;
                }

                res.json({ output: execStdout, error: null });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


