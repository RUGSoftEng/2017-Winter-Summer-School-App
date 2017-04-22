
/** The week offset: default is zero */
var week = 0;

function initialisePreviousButton() {
    $('#sched-getprevious').on('click', function() {
        week -= 1;
        $.ajax({url: "/calendar/event?week=" + week + '&rendered=true', success: function (result) {
            $('#scheduleModule').html(result);
            initialiseScheduleButtons();
        }});
    });
}

function initialiseNextButton() {
    $('#sched-getnext').on('click', function() {
        week += 1;
        $.ajax({url: "/calendar/event?week=" + week + '&rendered=true', success: function (result) {
            $('#scheduleModule').html(result);
            initialiseScheduleButtons();
        }});
    });
}

function initialiseScheduleButtons() {
    initialisePreviousButton();
    initialiseNextButton();
}
