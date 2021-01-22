let count = 0;
$(function () {
	displayCount();
	$('input[type=checkbox]').click(function () {
		if (this.checked) {
			count++;
		} else {
			count--;
		}
		displayCount();
	});

});

function displayCount() {
	$('#count').text(count)
}
