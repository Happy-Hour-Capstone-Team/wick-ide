import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post('/write-file', async (req, res) => {
    try {
        const { fileName, content } = req.body;
        await fs.writeFile(fileName, content);
        res.json({ message: 'File written successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/read-file/:fileName', async (req, res) => {
    try {
        const { fileName } = req.params;
        const content = await fs.readFile(fileName, 'utf-8');
        res.json({ content });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/compile-and-run', async (req, res) => {
    try {
        const { code } = req.body;
        await fs.writeFile('temp.cpp', code);

        const compilerProcess = spawn('g++', ['temp.cpp', '-o', 'tempExecutable']);

        compilerProcess.stderr.on('data', (data) => {
            res.status(500).json({ error: data.toString() });
        });

        compilerProcess.on('close', (code) => {
            if (code !== 0) {
                res.status(500).json({ error: 'Compilation failed' });
            } else {
                const executionProcess = spawn('./tempExecutable');

                let output = '';

                executionProcess.stdout.on('data', (data) => {
                    output += data.toString();
                });

                executionProcess.on('close', () => {
                    res.json({ output });
                });
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
