function refresh_event_display(dateFormatted) {
    
    $.post("get-events.php", {"dateFormatted": dateFormatted}, function(data, status) {
        data = JSON.parse(data);
        
        if (data.user_logged_in) {
            $("#new-event-form").show();
            $("#new-event-input-label").html("Add event for " + dateFormatted + " : ");
            $("#new-event-date").val(dateFormatted);
        }
        else {
            $("#new-event-form").hide();
        }

  

        if (data.success) {
            $("#events-display").empty(); // I NEED THIS OR I GET COLLISION
            $("#events-display").append("<h3>Events on " + dateFormatted + " : </h3>");
            
            $("#events-display").append($('<input/>').attr({ type: 'button', id:'delete-todo-btn', value:'Delete all ToDo for the day!' }));
  

            $("#delete-todo-btn").click(function(){
                $.post("delete-todo-ajax.php", {dateFormatted:dateFormatted, token: $("#token").val()}, function(data, status) {
                    refresh_event_display(dateFormatted);
                    removeElementsByClass("week-row");	//remove old calendar
                    updateCalendar();
                });
            });



            if (data.events.length > 0) {
                
                for (let k = 0; k < data.events.length;++k) {



                    let event_div = $("<div/>").attr('id','event-div-' + data.events[k].event_id);   
                    $(event_div).addClass("event-div-class");
                    $("#events-display").append(event_div);



                    let event_to_display = $('<p>').attr({id:'event-to-display-' + data.events[k].event_id });

                    let hourAMPM = data.events[k].hour;
                    if (hourAMPM < 12) {
                        hourAMPM = hourAMPM + " a.m.";
                    }
                    else if (hourAMPM == 12) {
                        hourAMPM = hourAMPM + " p.m.";
                    }
                    else if (hourAMPM < 24) {
                        hourAMPM = (hourAMPM - 12) + " p.m.";
                    }
                    else {
                        hourAMPM = (hourAMPM - 24) + " a.m."
                    }


                    if (data.events[k].todo == "checked") {
                        $(event_to_display).html("<strike><hr>" + "• " + data.events[k].title + " [" + hourAMPM + "]</strike>");

                    }
                    else {
                    $(event_to_display).html("<hr>" + "• " + data.events[k].title + " [" + hourAMPM + "]");

                    $(event_to_display).click(function() {
                        $.post("todo-ajax.php", {event_id: data.events[k].event_id, token: $("#token").val()}, function(toDoData, status){

                        });
                        $(this).wrap("<strike>");

                    });
                    }   

                    event_div.append(event_to_display);


                    let delete_button = $('<input/>').attr({ type: 'button', id:'delete-event-btn-' + data.events[k].event_id, value:'delete event' });
                        

                    //delete AJAX
                    $(delete_button).bind('click', function() {
                        console.log("event id is " + data.events[k].event_id);
                        $.post("delete-event-ajax.php",{event_id: data.events[k].event_id, token : $("#token").val()}, function(data, status) {
                            removeElementsByClass("week-row");
                            updateCalendar();
                            //REMOVE CORRESPONDING EVENT DISPLAY AND BUTTON

                            $(delete_button).remove();
                            $(event_to_display).remove();
                            $(event_div).remove();
                            refresh_event_display(dateFormatted);
                        });

                    });
                    event_div.append(delete_button);
                    event_div.append("<br><br>");







                    //create form for edit-event 
                            let edit_event_form = $("<form id='edit-event-form-" + data.events[k].event_id + "'></form>");
                            let edit_event_input = $("<input type='text' id='edit-event-input-" + data.events[k].event_id + "' placeholder='edit this event to...' size='40' required />");
                            let edit_event_btn = $('<input type="submit" id="edit-event-btn-' +  data.events[k].event_id + '" value="edit event">');
                            
                            edit_event_form.append(edit_event_input);
                            edit_event_form.append(edit_event_btn);

                            $(edit_event_form).submit(function(event) {
                                event.preventDefault();
                                let new_title = $("#edit-event-input-" + data.events[k].event_id ) .val();
                                $.post("update-event-ajax.php", {
                                    new_title: new_title,
                                    event_id: data.events[k].event_id,
                                    token : $("#token").val()
                                }, function(hourData, status) {
                                    hourData = JSON.parse(hourData);
                                    let hourAMPM_after_update = hourData.hour;
                                    if (hourAMPM_after_update < 12) {
                                        hourAMPM_after_update = hourAMPM_after_update + " a.m.";
                                    }
                                    else if (hourAMPM_after_update == 12) {
                                        hourAMPM_after_update = hourAMPM_after_update + " p.m.";
                                    }
                                    else if (hourAMPM_after_update < 24) {
                                        hourAMPM_after_update = (hourAMPM_after_update - 12) + " p.m.";
                                    }
                                    else {
                                        hourAMPM_after_update = (hourAMPM_after_update - 24) + " a.m."
                                    }


                                    $(event_to_display).html("<hr>" + "• " + new_title + " [" + hourAMPM_after_update + "]");
                                    $(edit_event_input).val("");
                                    $(event_to_display).click(function() {
                                        $.post("todo-ajax.php", {event_id: data.events[k].event_id , token: $("#token").val()}, function(toDoData, status){
                
                                        });
                                        $(this).wrap("<strike>");
                
                                    });
                                });
                            }
                                
                            );

                        
                            event_div.append(edit_event_form);







                }
                $("#new-event-form").show();
                $("#new-event-input-label").html("Add event for " + dateFormatted + " : ");
            }
            else { //then the user does not have any event for the clicked date
                $("#events-display").empty();
            }
        
        }


    });
}