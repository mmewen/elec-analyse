const socket = io();
var form, startDateField, endDateField;


function stringifyDate(date) {
	return (1900+date.getYear()) + "-" + (date.getMonth()+1) + "-" + date.getDate();
}

function buildDataCalendar() {
	var dataCalendar = document.getElementById("data_calendar");
	const startDate = new Date(2022, 10-1, 31);
	var tableContent = [];
	var id = "";
	var tmpDate = startDate;
	const formatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }); 

	for (var i = 0; i < 7; i++) {
		let tr = [];
		for (var week = 0; week < 52; week++) {
			tmpDate = new Date(startDate);
			tmpDate.setDate(tmpDate.getDate() + 7*week + i);
			id = stringifyDate(tmpDate);
			tr.push("<td title='" + formatter.format(tmpDate) + "' id='" + id + "'></td>")
		}

		tableContent.push("<tr>" + tr.join("") + "</tr>");
	}

	dataCalendar.innerHTML = tableContent.join("");
}

function updateDataCalendar() {
	
}

window.onload = function() {
	form = document.getElementById('get-data-form');
	startDateField = document.getElementById("start_date");
	endDateField = document.getElementById("end_date");
	buildDataCalendar();
	updateDataCalendar();

	form.onsubmit = function(e) {
		e.preventDefault();// Retrieve the message from the textarea.
		var message = {
			"startDate" : startDateField.value,
			"endDate" : endDateField.value
		}
		// socket.send(message);// Add the message to the messages list.
		socket.emit('get linky data', message);
		// console.log("Message envoyé !");
		return false;
	};
};

socket.onopen = function(event) {
	console.log('Connected to: ' + event.currentTarget.url);
};

// Handle messages sent by the server.
socket.onmessage = function(event) {
  var message = event.data;
  console.log(message);
};