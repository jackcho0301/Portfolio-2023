$("#new-event-form").submit(function(event) {
    event.preventDefault();
    let new_event_title = $("#new-event-input").val();
    let new_event_date = $("#new-event-date").val();

    let new_event_time_hour = $("#hours").val();
    let new_event_time_am_pm = "";

    let new_event_token = $("#token").val();
    if ($("#am").is(":checked")) {
        new_event_time_am_pm = "am";
    }
    else {
        new_event_time_am_pm = "pm";
    }

    const username_to_share = $("#username-to-share").val();

    $.post("insert-event-ajax.php",{
        new_event_title: new_event_title,
        new_event_date: new_event_date,
        new_event_time_hour: new_event_time_hour,
        new_event_time_am_pm, new_event_time_am_pm,
        username_to_share, username_to_share,
        new_event_token, new_event_token
    }, function(data, status) {
        removeElementsByClass("week-row");	//remove old calendar
        updateCalendar();
        $("#new-event-input").val("");
        $("#username-to-share").val("");

        

        data = JSON.parse(data);

        if (data.username_to_share_with_does_not_exist) {
           alert("The username you wish to share the event with does not exist.");
        }


        refresh_event_display(new_event_date);

        
    });

});