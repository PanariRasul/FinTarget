const express = require('express');
const handleTaskRequest = require('./taskManager');

const app = express();
app.use(express.json());

app.post('/api/v1/task', handleTaskRequest);

module.exports = app;
