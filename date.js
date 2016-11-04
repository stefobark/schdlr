var d = new Date();
var date = buildYear(d);
var workingMonth = 0;
var workingDayName = "";
var workingDayNum = "";
var workingDate = "";
var workingHour = "";

var appts = new Array();

function buildDays(days){
	var day = { "hours":buildHours(),"comments":"" };
	d = {};
	for(i = 1; i <= days+1;i++){
		d[i] = day;
	}
	return d;
}

function buildHours(){
	h = {};
	for(i = 0; i <= 24;i++){
		h[i] = {"clientName":"","available":true,"comments":""};
	}
	return h;
}



function setAppt(m,d,h,cName){
	if(checkTime(m,d,h)){
		year.months[m].days[d].hours[h].available = false;
		year.months[m].days[d].hours[h].clientName = cName;
	} else {
		return false;
	}
}

function checkTime(m,d,h){
	month = year.months[m];
	day = month.days[d];
	hour = day.hours[h];
	if(hour.available){
		return true;
	}else{
		return false;
	}
}

//the function that makes other things happen
function start(){
	date.printYear(d);
	$("body").append("<h2 class='printYear' id='"+year.currentYear+"'>"+year.currentYear+"</h2>");
}

//add things to the date object to build helpful datie functionality
function buildYear(d){
	year = Object.create(d);
	year.currentYear = d.getFullYear();
	year.thisMonthNumber =  d.getMonth();
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
	var day = $(this).attr('id');
	workingDate = day;
	var month = date.monthNames[workingMonth];
	var yr = date.currentYear;
	
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
function daysInThisMonth(month){
	var daysInMonths = getDaysInMonths();
	var daysInThisMonth = daysInMonths[month]; //get this month's number of days.
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
			$("#boxes").append("<div style='background-color:rgba(10,100,222,0.4)!important;' onclick='updateWorkingDay();' class='dayBox' id='"+day+"'>"+day+"<br>"+dayName+"</div>");
		} else {
			$("#boxes").append("<div class='dayBox' id='"+day+"'>"+day+"<br>"+dayName+"</div>");
		}
		
		if(dayNum == 6){
			$("#boxes").append("<div class='spacer' style='display:block;height:13%;'></div>");
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


