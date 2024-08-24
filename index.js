const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
//const { Queue } = require('bull');
const Queue = require('bull');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const app = express();
app.use(express.json());

const taskQueue = new Queue('taskQueue');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each user to 20 requests per windowMs
    keyGenerator: (req) => req.body.user_id,
});

app.post('/api/v1/task', limiter, (req, res) => {
    const userId = req.body.user_id;
    taskQueue.add({ userId });
    res.status(202).send('Task is being processed');
});

taskQueue.process(async (job) => {
    await task(job.data.userId);
});

async function task(user_id) {
    const logMessage = `${user_id}-task completed at-${Date.now()}\n`;
    fs.appendFileSync('task_logs.txt', logMessage);
    console.log(logMessage);
}

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
