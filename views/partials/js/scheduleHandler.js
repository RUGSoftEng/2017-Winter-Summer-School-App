
/** The week offset: default is zero */
var week = 0;

function initialisePreviousButton() {
    $('#sched-getprevious').on('click', function() {
        week -= 1;
        $.ajax({url: "/calendar/event?week=" + week + '&rendered=true&extended=true', success: function (result) {
            $('#scheduleModule').html(result);
            refreshModalAndSchedule();
        }});
    });
}

function initialiseNextButton() {
    $('#sched-getnext').on('click', function() {
        week += 1;
        $.ajax({url: "/calendar/event?week=" + week + '&rendered=true&extended=true', success: function (result) {
            $('#scheduleModule').html(result);
            refreshModalAndSchedule();
        }});
    });
}

function refreshModalAndSchedule() {
    initialisePreviousButton();
    initialiseNextButton();
    initialiseModalOpeners();
    openTodaysSchedule();
}

function initialiseScheduleButtons() {
    initialisePreviousButton();
    initialiseNextButton();
}
