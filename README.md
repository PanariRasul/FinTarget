Run index.js OR Server.js


for index.js ==>
npm install
node index.js

output ==>
Worker 12345 started
Worker 12346 started
Worker 12347 started
Worker 12348 started

request on postman ==>
post methos =  http://localhost:3000/api/v1/task

json body=
{
 "user_id": "user123"
}





for serevr.js ====>

>> npm install

>> cd FinTarget/src

run >> nodemon server.js

output ==>
task completed at 2024-08-24T11:40:59.485Z

request on postman ==>
post methos =  http://localhost:3000/api/v1/task

json body=
{
 "user_id": "user123"
}


