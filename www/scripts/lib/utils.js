var times = (Math.floor(+new Date()));
//-------------- count down -------------------

function fn_countDown() {

	var countDown = $("[class^='run_countDown']")

	$.each(countDown,function(index, value) {
		var pad = function(value) {
			return (value.toString().length < 2) ? '0' + value : value;
		}
		var cd = "";
		
		var finishtime = parseInt(value.className.replace("run_countDown", ""));
		
		var a = moment(finishtime);
		var b = moment();



		var y = a.diff(b, 'years');
		var m = a.diff(b.add("years", y), 'months');
		var d = a.diff(b.add("months", m), 'days');
		var hours = a.diff(b.add("days", d), 'hours');
		var minutes = a.diff(b.add("hours", hours), 'minutes');
		var seconds = a.diff(b.add("minutes", minutes), 'seconds');

		cd = ((y == 0) ? "" : Math.abs(y) + " year ") +
			((m == 0) ? "" : Math.abs(m) + " month ") +
			((d == 0) ? "" : Math.abs(d) + " day ") +
			pad(Math.abs(hours)) + ":" + pad(Math.abs(minutes)) + ":" + pad(Math.abs(seconds));

		if (a.diff(b) > 0) {

		} else {
			cd = "-" + cd;
		}
		
		value.innerHTML = cd;
		
		$("[class='checkCountdown" + finishtime + "']").css( "color", fn_checkCountdown(finishtime));
		
	});



	setTimeout(function() {
		fn_countDown();
	}, 1000);
	//return cd;

}

function fn_checkCountdown(end) {
	var a = moment(end);
	var b = moment();
	if (a.diff(b) > 0) {
		return "#BFD22B";
	} else {
		return "red";
	}
}
//-------------- cover timestamp --------------start

function formatTime(unixTimestamp) {
	var dt = new Date(unixTimestamp);
	var hours = dt.getHours();
	var minutes = dt.getMinutes();
	var seconds = dt.getSeconds();
	if (hours < 10)
		hours = '0' + hours;
	if (minutes < 10)
		minutes = '0' + minutes;
	if (seconds < 10)
		seconds = '0' + seconds;
	return hours + ":" + minutes + ":" + seconds;
}

function format_time_date(ts) {
	var ds = new Date(ts);
	var pad = function(value) {
		return (value.toString().length < 2) ? '0' + value : value;
	}
	var monthName = new Array(12);
	monthName[0] = "January";
	monthName[1] = "February";
	monthName[2] = "March";
	monthName[3] = "April";
	monthName[4] = "May";
	monthName[5] = "June";
	monthName[6] = "July";
	monthName[7] = "August";
	monthName[8] = "September";
	monthName[9] = "October";
	monthName[10] = "November";
	monthName[11] = "December";

	var month = pad(ds.getUTCMonth());
	var year = ds.getUTCFullYear();
	var day = pad(ds.getUTCDate());
	var date = day + '-' + monthName[ds.getUTCMonth()] + '-' + year;

	return date + '  ' + formatTime(ds);

}
