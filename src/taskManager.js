const fs = require('fs');
const path = require('path');

// Rate limiter data
const rateLimits = {};

// Task queue data
const taskQueue = [];
let isProcessing = false;

// Log file path
const logFilePath = path.join(__dirname, '../logs/task.log');

// Rate limiter function
const rateLimit = (userId) => {
    const currentTimestamp = Date.now();
    const userLimits = rateLimits[userId] || { lastRequest: 0, requestCount: 0 };
    const timeDiff = currentTimestamp - userLimits.lastRequest;

    if (timeDiff > 60000) {
        userLimits.requestCount = 0;
    }

    userLimits.requestCount++;
    userLimits.lastRequest = currentTimestamp;

    if (userLimits.requestCount > 20 || timeDiff < 1000) {
        throw new Error('Rate limit exceeded');
    }

    rateLimits[userId] = userLimits;
};

// Task queue processor function
const processQueue = () => {
    if (taskQueue.length === 0 || isProcessing) return;

    isProcessing = true;
    const task = taskQueue.shift();

    setTimeout(() => {
        logTaskCompletion(task.userId);
        console.log(`${task.userId} - task completed at ${new Date().toISOString()}`);
        isProcessing = false;
        processQueue();
    }, 1000);
};

// Add task to queue function
const addTaskToQueue = (userId) => {
    taskQueue.push({ userId });
    processQueue();
};

// Log task completion function
const logTaskCompletion = (userId) => {
    const logMessage = `${userId} - task completed at ${new Date().toISOString()}\n`;
    fs.appendFileSync(logFilePath, logMessage);
};

// Controller function
const handleTaskRequest = (req, res) => {
    const { user_id } = req.body;

    try {
        rateLimit(user_id);
        addTaskToQueue(user_id);
        res.status(200).send({ message: 'Task added to queue' });
    } catch (error) {
        res.status(429).send({ error: 'Rate limit exceeded' });
    }
};

module.exports = handleTaskRequest;
