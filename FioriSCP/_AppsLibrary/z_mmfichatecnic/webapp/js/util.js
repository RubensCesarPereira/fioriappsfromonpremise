function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return year+''+month+''+day+'';
}
function formatDateTime(date) {
	var result = date.getFullYear();
	var month = date.getMonth() + 1;
	if (month.toString().length == 1)
		month = "0" + month;
	result += "" + month;
	var day = date.getDate();
	if (day.toString().length == 1)
		day = "0" + day;
	result += "" + day;
	var hours = date.getHours();
//	if (hours.toString().length == 1)
//		hours = "0" + hours;
//	result += " " + hours;
//	var minutes = date.getMinutes();
//	if (minutes.toString().length == 1)
//		minutes = "0" + minutes;
//	result += ":" + minutes;
//	var seconds = date.getSeconds();
//	if (seconds.toString().length == 1)
//		seconds = "0" + seconds;
//	result += ":" + seconds;
	return result;
}