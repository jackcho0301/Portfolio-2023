<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendar</title>
    <link href="style.css" type="text/css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

</head>
<body>
    <?php
    session_start();
    ?>

    <div id="login-div">
        <h3>Log In</h3>
        <form id="login-form">
            <label for="username">Enter username:</label>
            <input type="text" id="username" placeholder="Username" maxlength="50" required />
            <label for="password">Enter password:</label>
            <input type="password" id="password" placeholder="Password" required />
            <button id="login_btn">Log In</button>
        </form>
        <hr>
    </div>

    <p id="username-display"></p>

    <div id="create-account-div">
        <h3>Create Account</h3>
        <form id="create-account-form" method="POST">
            <label for="new-username">Enter new username:</label>
            <input type="text" name="new-username" id="new-username" maxlength="50" required />
            <label for="new-password">Enter new password:</label>
            <input type="password" name="new-password" id="new-password" required />
            <input type="submit" value="Create New Account" />
        </form>
        <p id="account-creation-status"></p>
        <hr>
    </div>



  

    <form id="logout-form" method="POST">
        <input type="submit" id="logout-input" value="Log Out" />
    </form>

    <?php

    if ($_SESSION['user-logged-in']) {

        echo '
            <script>
            $("#login-div").hide();
            $("#create-account-div").hide();
            $("#username-display").html("You\'ve been logged in! Welcome, ' . $_SESSION['username'] .  ' ");
            $("#logout-form").show();
            </script>
        ';
    }
    else {
        echo '
        <script>
        $("#logout-form").hide();
        </script>
        ';
        
        session_destroy();
    }
    ?>

    <h1 id="current-month-display">..</h1>

    <button id="prev-month-btn">prev month</button>
    <button id="next-month-btn">next month</button>

    <br> 

    <div id="calendar-div">
        <table id="calendar-table">
            <tr id="week-names-row">
                <th>sun</th>
                <th>mon</th>
                <th>tue</th>
                <th>wed</th>
                <th>thu</th>
                <th>fri</th>
                <th>sat</th>
            </tr>
        </table>
    </div>

    <br>
        <hr>

    <form id="new-event-form">
   
        <label id="new-event-input-label" for="new-event-input"></label>
        <br>
        <br>
        <input type="text" id="new-event-input" size="50" required />
        <br>
        <br>
        <label for="hours">Choose Time:</label>
        <select name="hours" id="hours">
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
        </select>

        <input type="radio" id="am" name="am_pm" value="am" required>
        <label for="am">A.M.</label>
        <input type="radio" id="pm" name="am_pm" value="pm" required>
        <label for="pm">P.M.</label>
        <br>
        <br>
        <label for="username-to-share">[optional] Share with another user:</label>
        <input type="text" id="username-to-share" />
        <br>
        <br>
        <input type="hidden" id="new-event-date" >
        <input type="hidden" id="token" value="<?php echo $_SESSION['token'];?>" />
        <input type="submit" id="new-event-btn" value="Create new event" />
        <hr>

    </form>

    <div id="events-display">

    </div>

    
     
    <script src="calendar_helper.js"></script>
    <script src="calendar.js"></script>
    <script src="refresh-event-display.js"></script>
    <script src="login_ajax.js"></script> <!-- load the JavaScript file -->
    <script src="create-account-ajax.js"></script>
    <script src="logout-ajax.js"></script>
    <script>
        $(document).ready(function() {
            $("#new-event-form").hide();
            // $("#logout-form").hide();
        });
    </script>
    <script src="insert-event-ajax.js"></script>
</body>
</html>