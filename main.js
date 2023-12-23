function stringifyDate(date) {
	return (1900+date.getYear()) + "-" + (date.getMonth()+1) + "-" + date.getDate();
}

function buildDataCalendar() {
	var dataCalendar = document.getElementById("data_calendar");
	const startDate = new Date(2022, 10-1, 31);
	var tableContent = [];
	var id = "";
	var tmpDate = startDate;

	for (var i = 0; i < 7; i++) {
		let tr = [];
		for (var week = 0; week < 52; week++) {
			tmpDate = new Date(startDate);
			tmpDate.setDate(tmpDate.getDate() + 7*week + i);
			id = stringifyDate(tmpDate);
			tr.push("<td title='" + tmpDate.toDateString() + "' id='" + id + "'></td>")
		}

		tableContent.push("<tr>" + tr.join("") + "</tr>");
	}

	dataCalendar.innerHTML = tableContent.join("");
}

function updateDataCalendar() {
	
}

function downloadData(startDate, endDate) {

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
		const prm = "14633140322970";
		const apiUrl = "https://conso.boris.sh/api/consumption_load_curve?prm="+prm+"&start="+stringifyDate(weekStartDate)+"&end="+stringifyDate(earliestEndDate);

		// Make a GET request
		fetch(apiUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				console.log(data);
			})
			.catch(error => {
				console.error('Error:', error);
			});

		weekStartDate.setDate(weekStartDate+7);
	}
}

function submitForm() {
	const startDate = new Date(document.getElementsByName("start_date")[0].value);
	const endDate = new Date(document.getElementsByName("end_date")[0].value);

	downloadData(startDate, endDate);

	return false;
}


window.addEventListener('load', function () {
	buildDataCalendar();
	updateDataCalendar();
})
