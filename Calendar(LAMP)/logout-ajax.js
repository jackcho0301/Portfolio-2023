$("#logout-form").submit(function(event){
    event.preventDefault();
    let logoutInput = "true";
    $.post("logout-ajax.php",{logoutInput : logoutInput}, function(data, status) {


        if (status === "success") {
            // console.log(data);
            $("#login-div").show();
            $("#create-account-div").show();
            $("#events-display").html(); 
            for (let i = 0; i < cells.length; ++i) {
                $("#cell-" + i).removeClass("cells-with-events");
            }
            $("#new-event-form").hide();
            $("#events-display").empty();
            $("#logout-form").hide();
            $("#username-display").empty();
        }
    });
});