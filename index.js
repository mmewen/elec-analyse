import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from "socket.io";
import fetch from 'node-fetch';
import { Headers } from 'node-fetch';

import config from './config.js'; // assert { type: 'json' };

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));


// Copy from client js
function stringifyDate(date) {
  var monthStr = (date.getMonth()+1).toString();
  var dayStr = (date.getDate()).toString();
  monthStr = monthStr.length == 1 ? "0"+monthStr : monthStr;
  dayStr = dayStr.length == 1 ? "0"+dayStr : dayStr;
  return (1900+date.getYear()) + "-" + monthStr + "-" + dayStr;
}

function normalizeLinky(requestedStartDate, requestedEndDate, rawLinkyJSON) {

  // return object
}

function saveLinkyData(json) {
  // See https://blog.logrocket.com/reading-writing-json-files-node-js-complete-tutorial/
}

function sendLinkyDataChunck(json) {
  // See  https://socket.io/docs/v4/tutorial/step-5      for broadcast
}

function sendLinkyData() {
  // For all files of selected PRM
    // sendLinkyDataChunck(json);
}

function downloadData(requestedStartDate, requestedEndDate) {
  // Linky data is given from 00:30 on start date and 00:29 on end date.
  // The user expected behaviour is to get data from 00:00 on start date to 23:59 on end date.
  // TODO : the bellow code needs to be adapted accordingly

  // TMP
  const startDate = requestedStartDate;
  const endDate = requestedEndDate;

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
  const nbLoops = diffDays/7;

  var weekStartDate = new Date(startDate);

  var plusSeven = new Date(startDate);
  var earliestEndDate;

  for (var i = 0; i < nbLoops; i++) {
    plusSeven.setDate(plusSeven.getDate()+7);
    earliestEndDate = endDate < plusSeven ? endDate : plusSeven;
    
    // Download date from startDate to earliestEndDate
    const apiUrl = "https://conso.boris.sh/api/consumption_load_curve?prm="+config.prm+"&start="+stringifyDate(weekStartDate)+"&end="+stringifyDate(earliestEndDate);
    const meta = [['Authorization', 'Bearer ' + config.apiToken ]];
    const headers = new Headers(meta);

    console.log(apiUrl);

    // Make a GET request
    fetch(apiUrl, { headers: headers })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        //return response.json();
        console.log(JSON.stringify(response.json()));
      })
      .then(data => {
        const normalizedLinkyDataJSON = JSON.stringify(normalizeLinky(requestedStartDate, requestedEndDate, response.json()));
        saveLinkyData(normalizedLinkyDataJSON);
        sendLinkyDataChunck(normalizedLinkyDataJSON);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    weekStartDate.setDate(weekStartDate.getDate()+7);
  }
}


app.use(express.static('static'));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  // console.log('a user connected');

  // TODO : send already known data to client
  sendLinkyData();


  socket.on('get linky data', (msg) => {
    console.log('message: ' + JSON.stringify(msg));
    var startDate = new Date(msg.startDate);
    var endDate = new Date(msg.endDate);
    downloadData(startDate, endDate);
  });
  socket.on('disconnect', () => {
    // console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
