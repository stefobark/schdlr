var d = new Date();
var schdlr = buildYear(d);   // this function returns our custom date object

// number, name of the month day and hour we're working with on the ui. these
// probably shouldn't be global.
var workingMonth = 0;
var workingDayName = "";
var workingDayNum = "";
var workingDate = "";
var workingHour = "";

// this will hold all of our appointment date objects that we will use to pass info back
// to the server.
var appts = new Array();


//the function that makes other things happen
function start(){
	schdlr.printYear(d);
	$("body").append("<h2 class='printYear' id='"+schdlr.currentYear+"'>"+schdlr.currentYear+"</h2>");
}

//add things to the date object to build helpful datish functionality
//remember the "year" object is born here, but we pass it back and it becomes schdlr.
//dont use 'year' outside this scope ( i kept forgetting this for some reason ).
function buildYear(){
	year = Object.create(d); //so year is an object like Date, that we passed to this with 'd'
	year.currentYear = d.getFullYear(); //just trying to make things quicker to get at
	year.thisMonthNumber =  d.getMonth();

        //month and day names.
	year.monthNames = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September" ,
				"October",
				"November",
				"December"
			],
	year.dayNames = [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday"
			],

	year.currentDay = d.getDay(); //a number 0 -6
	year.workingMonth =  workingMonth;
	year.workingDayName =  workingDayName;
	year.workingDayNum = workingDayNum;
	year.workingDate = workingDate;
	year.workingHour = workingHour;
	year.daysInMonths =  getDaysInMonths();//an array with each month's number of days.

	year.weekdays = new Array(7);
		year.weekdays[0] = "Monday";
		year.weekdays[1] = "Tuesday";
		year.weekdays[2] = "Wednesday";
		year.weekdays[3] = "Thursday";
		year.weekdays[4] = "Friday";
		year.weekdays[5] = "Saturday";
		year.weekdays[6]=  "Sunday";

	year.printYear = function(){

		$.each( year.monthNames, function( key, value ) {
		  $("#rightBar").append( "<div id='"+key + "' class='mNamesRight'>" + value.toUpperCase() + "</div>");
		  $('#'+key).on("click",dayBoxes);
		});
	};


	return year
}

//run this when... they click a day!
function clickDay(){
	var day = $(this).attr('id'); // the day numbers are stored in the div's id
	workingDate = day; //globalize that day number from the div that was clicked
	var month = schdlr.monthNames[workingMonth]; //get at that global schdlr object
	var yr = schdlr.currentYear;

	//this date object is used to set properties for the appointment
	//we store this in the year object and name them 'working....'
	var appt = new Date();
		appt.setMonth(workingMonth);
		appt.setDate(day-1);
		var dayNum = appt.getDay();
		var dayName = year.weekdays[dayNum];
		year.workingDayName = dayName;
		year.workingDayNum = dayNum + 1;
		year.workingDate = workingDate;

	$('#infoBox').html('<h2 style="margin-bottom:5px;">'+month+' '+day+', '+yr+'</h2>');
	$('#infoBox').append("<div class='row' id='am'></div>");

	for(i=0;i< 24;i++){
		var hr=i+1;
		var btns = "<div id='"+hr+"' class='set' onclick=\"setHour($(this).attr('id'));addAppt($(this).attr('id'));\">&nbsp;&nbsp;ADD APPOINTMENT</div><div id='remove' class='btn btn-default'>&nbsp;&nbsp;REMOVE APPOINTMENT</div>";
		var occupied = false;
		$.each(appts,function(){
			if(hr == this.getHours()){
				$('#'+hr).css('background-color','black');
			}
		});
		if(occupied == false){
			$("#am").append("<div class='col-xs-4 hourblock'>"+hr+" "+btns+"</div>");
		} else {
			$("#am").append("<div class='col-xs-4 hourblock' style='background-color:rgba(200,80,80,0.4)!important;'>"+hr+" "+btns+"</div>");
		}

	}
}

//tell me how many days are in a given month
function daysInThisMonth(m){
	var daysInMonths = getDaysInMonths();
	var daysInThisMonth = daysInMonths[schdlr.workingMonth]; //get this month's number of days.
	return daysInThisMonth; //give it back
}

//run through all the days in the month, build and return an array of all day nums.
function getDaysInMonths(){
	var monthDays = [];
	for(i = 0; i < 12; i++){
		var days = new Date(year.currentYear, i+1, 0);
		monthDays[i] = days;
	}
	return monthDays;
}

//figure out what month we're working with, build a calendar with the
//appropriate day nums for the month.
function dayBoxes(){
	var color;
	workingMonth = $(this).attr("id");
	year.workingMonth = workingMonth;
	var days = daysInThisMonth(workingMonth).getDate();
	$('.dayBox,#monthName,.spacer').remove();
	$("#boxes").append("<h2 id='monthName'>"+year.monthNames[workingMonth]+"</h2>");

	for(i = 0; i < days; i++){
		day = i+1;
		var d = new Date();
		d.setMonth(workingMonth);
		d.setDate(i);
		var dayNum = d.getDay();
		var dayName = year.weekdays[dayNum];
		workingDayName = dayName;
		workingDayNum = dayNum;
		if(dayNum == 6 || dayNum == 5){
			color = true;
			/**********************************************************
			 * 			REMEMBER THIS IS WHERE BOXES GET STYLE
			 * *******************************************************/
			$("#boxes").append("<div style='background-color:rgba(10,100,222,0.4)!important;' onclick='updateWorkingDay();' class='dayBox' id='"+day+"'>"+day+"<h2 style='font-size:12px;'>"+dayName+"</h2>");
		} else {
			$("#boxes").append("<div class='dayBox' id='"+day+"'>"+day+"<h2 style='font-size:12px;'>"+dayName+"</h2>");
		}

		if(dayNum == 6){
			$("#boxes").append("<div class='spacer' style='display:block;height:20%;'></div>");
		}

	}
	$('.dayBox').on("click",clickDay);
}

function setHour(hr){
	workingHour = hr;

}
function addAppt(hr){
	var yr = String(year.currentYear);
	var twoCharYr = yr.substr(yr.length -2);
	var month = year.workingMonth;
	var day = year.workingDate;
	year.workingHour =  workingHour;
	var hour = year.workingHour;
	var apptDate = new Date(yr,month,day,hour);
	var occupied = false;
	$.each(appts,function(){
		if(hr == this.getHours()){
			occupied = true;
		}
	});
	if(occupied != true){
		$('div.col-xs-4.hourblock').find('#'+hr).parent().css('background-color','black');
		appts.push(apptDate); // add to our collection of appointments
	}
	console.log(appts); // check on appointments
}

function updateWorkingDay(){
	year.workingDayName = workingDayName;
	year.workingDayNum = workingDayNum
}


