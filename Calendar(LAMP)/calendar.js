//get current date:
https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript

var todayDate = new Date();

let currentMonth = new Month(2022, todayDate.getMonth());


//get h1 element for displaying month name
let currentMonthDisplay = document.getElementById("current-month-display")

//get table element from html:
let calendarTable = document.getElementById("calendar-table");	


//function for removing elements by class name
function removeElementsByClass(className){
	// console.log("removing...");
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

let monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

//this function creates a table, initially empty.
function createTable() {
	//update month and year display:
	currentMonthDisplay.innerHTML = monthNames[currentMonth.month] + " " + currentMonth.year;	

	


	//create appropriate number of rows for number of weeks
	for (let i = 0; i < currentMonth.getWeeks().length; ++i) {
		let tableRow = document.createElement("tr");	//create a row
		tableRow.setAttribute("id", "week-" + i);
		tableRow.setAttribute("class", "week-row");

		//create 7 cells per row
		for (let j = 0; j < 7; ++j) {
			let tableData = document.createElement("td");
			tableData.setAttribute("class", "calendar-cell");
			tableData.innerHTML = "x";	//place holder
			tableRow.appendChild(tableData);	//append cells to table row
		}
		calendarTable.appendChild(tableRow);	//apped table row to table element
	}
}

//array of calendar table cells. (DOM)
let cells = document.getElementsByClassName("calendar-cell");	

//array of date objects
let dates = [];

updateCalendar();	//call updateCalendar, to display calendar of current Month (default page)



////Event listener for Next Month, Prev Month buttons:
// Change the month when the "next" button is pressed
document.getElementById("next-month-btn").addEventListener("click", function (event) {
	removeElementsByClass("week-row");	//remove old calendar
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	//console.log("Next month is " + currentMonth.month + " " + currentMonth.year);
}, false);

// Change the month when the "prev" button is pressed
document.getElementById("prev-month-btn").addEventListener("click", function (event) {
	removeElementsByClass("week-row");
	currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	//console.log("Previous month is " + currentMonth.month + " " + currentMonth.year);
}, false);




function updateCalendar() {
	var weeks = currentMonth.getWeeks();

	createTable();	
	dates=[];
	//index for cells array, which contains cell html elements
	cellsIndex = 0;


	for (var w in weeks) {
		var days = weeks[w].getDates();
		// days contains normal JavaScript Date objects.


		for (var d in days) {

			
			dates.push(days[d]);

			//if the day overflows, grey it out:
			if( days[d].getMonth() != currentMonth.month){
				cells[cellsIndex].setAttribute("style", "background-color: lightgrey;");
			}
			
			//fill the table cell with numbered date
			cells[cellsIndex].setAttribute("id", "day-" + days[d].getDate());
			cells[cellsIndex].innerHTML = days[d].getDate();

			++cellsIndex;
		}

	}


	

	//add click event for each table cell
	for (let i = 0; i < cells.length; ++i) {
		if (monthNames[dates[i].getMonth()] == monthNames[currentMonth.month]){ //add click event only for dates with current months
			let monthFormatted = (dates[i].getMonth() + 1);
			if (monthFormatted < 10) {
				monthFormatted = "0" + monthFormatted;
			}
			let dayFormatted = dates[i].getDate();
			if (dayFormatted < 10) {
				dayFormatted = "0" + dayFormatted;
			}
			let dateFormatted = dates[i].getFullYear() + "-" + monthFormatted + "-" +  dayFormatted;
			cells[i].id = "cell-" + i;
			
			cells[i].addEventListener("click", function (event) {
				
				console.log(dateFormatted);
				//console.log(dates[i].getDate());
				event.preventDefault();
				$.post("get-events.php", {dateFormatted: dateFormatted}, function(data, status) { // post(): to pass in current date.
                   
					//change color of table cell when clicked
					for (let j = 0; j < cells.length; ++j) {
						$("#cell-" + j).removeClass("clicked-cell");
					}
					$("#cell-" + i).addClass("clicked-cell");


					refresh_event_display(dateFormatted);
					
					


                }) 
			}, false);



		}
			


	}



	// for coloring dates with events
	for (let i = 0; i < cells.length; ++i) {
		// $("#cell-" + i).trigger("click");
		if (monthNames[dates[i].getMonth()] == monthNames[currentMonth.month]){ //add click event only for dates with current months
			let monthFormatted = (dates[i].getMonth() + 1);
			if (monthFormatted < 10) {
				monthFormatted = "0" + monthFormatted;
			}
			let dayFormatted = dates[i].getDate();
			if (dayFormatted < 10) {
				dayFormatted = "0" + dayFormatted;
			}
			let dateFormatted = dates[i].getFullYear() + "-" + monthFormatted + "-" +  dayFormatted;
			//cells[i].id = "cell-" + i;
			
			
				
				$.post("get-events.php", {dateFormatted: dateFormatted}, function(data, status) { // post(): to pass in current date.
                   
		

					data = JSON.parse(data);

					if (data.user_logged_in && data.events.length > 0) {
						$("#cell-" + i).addClass("cells-with-events");
					}
                }) 
			



		}
	}
	
	
}