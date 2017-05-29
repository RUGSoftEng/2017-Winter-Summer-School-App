/** The parsed data, and week offset: default is zero */
var result, week = 0;

function initialisePreviousButton() {
    $('#sched-getprevious').on('click', function () {
        week -= 1;
        $.ajax({
            url: "/calendar/event?week=" + week + '&rendered=true&extended=true', success: function (result) {
                if ((result = JSON.parse(result))) {
                    if (result.error) {
                        console.log('scheduleHandler: Request to get previous week data failed!');
                        week += 1;
                    } else {
                        $('#scheduleModule').html(result.data);
                        refreshModalAndSchedule();
                    }
                }
            }
        });
    });
}

function displayErrorBanner(msg) {
    $('#errorMessage span.textMsg').text(' ' + msg);
    $('#errorMessage').show();
}

function initialiseNextButton() {
    $('#sched-getnext').on('click', function () {
        week += 1;
        $.ajax({
            url: "/calendar/event?week=" + week + '&rendered=true&extended=true', success: function (result) {
                if ((result = JSON.parse(result))) {
                    if (result.error) {
                        console.log('scheduleHandler: Request to get next week data failed!');
                        displayErrorBanner('scheduleHandler: Request to get next week data failed!');

                        week -= 1;
                    } else {
                        $('#scheduleModule').html(result.data);
                        refreshModalAndSchedule();
                    }
                }
            }
        });
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
