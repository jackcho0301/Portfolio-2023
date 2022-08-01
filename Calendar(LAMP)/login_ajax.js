// ajax.js

function loginAjax(event) {
    event.preventDefault();
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {document.getElementById("username-display").innerHTML = data.success ? "You've been logged in! Welcome, " + username  : `${data.message}`
        // console.log(data.success ? "You've been logged in! Welcome, " + username  : `You were not logged in ${data.message}`))
        
        
        if (data.success) {
            removeElementsByClass("week-row");	//remove old calendar
            updateCalendar();


            $("#login-div").hide();
            $("#create-account-div").hide();
            $("#events-display").empty(); //UPON LOGIN, SET #TEST EMPTY (this is placeholder for displays)
            $("#username, #password").val("");
            $("#logout-form").show();
            $("#token").val(data.token);
      
        }
        
    })
        .catch(err => console.error(err));


        
}

document.getElementById("login-form").addEventListener("submit", loginAjax, false);