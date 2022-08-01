<?php

include "database.php";

session_start();
if (!$_SESSION['user-logged-in']) {

    echo json_encode(array(
        "success" => false,
        "user_logged_in" => false
    ));
    session_destroy();
    exit;
}

if (isset($_POST['dateFormatted']) && $_SESSION['user-logged-in']) {

    $stmt = $mysqli->prepare("select id, title, username, date, hour, todo from events where username=? and date=? or  shared_username=? and date=? order by hour asc;");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "user_logged_in" => true
        ));
        exit;
    }
    $stmt->bind_param('ssss', $_SESSION['username'], $_POST['dateFormatted'], $_SESSION['username'], $_POST['dateFormatted']);
    $stmt->execute();
    $stmt->bind_result($event_id, $title, $username, $date, $hour, $todo);


    $resultArr = array(); 


    while($stmt->fetch()){
    
        
        $myObj = new stdClass(); //create empty object.. for some reason the object cannot be overwritten in the loop
        $myObj->event_id = htmlentities($event_id);
        $myObj->title = htmlentities($title);
        $myObj->username = htmlentities($username);
        $myObj->date = htmlentities($date);
        $myObj->hour = htmlentities($hour);
        $myObj->todo = htmlentities($todo);

        $myJSON = json_encode($myObj);



    array_push($resultArr, $myObj);

    
    }


    echo json_encode(array(
        "success" => true,
        "user_logged_in" => true,
        "events" => $resultArr
    ));

    $stmt->close();


    }
// }
?>

