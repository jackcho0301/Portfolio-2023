

$("#create-account-form").submit(function(event) {
    let newUsername = $("#new-username").val();
    let newPassword = $("#new-password").val();
    event.preventDefault();
    $.post("create-account-ajax.php", { 
        "new-username" :newUsername, "new-password": newPassword
    }, function(data, status) {

     
        data = JSON.parse(data);
           if (data.success){
            $("#account-creation-status").html("account successfully created");
            $("#new-username, #new-password").val("");
        }
        else {
            $("#account-creation-status").html("failed to create account; duplicate username exists or username contains invalid characters");
        }
    });

    

});


