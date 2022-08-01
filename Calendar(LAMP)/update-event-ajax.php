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

if(!hash_equals($_SESSION['token'], $_POST['token'])){
    echo json_encode(array(
        "success" => false,
        "user_logged_in" => false
    ));
    die("Request forgery detected");
}

if (isset($_POST['new_title']) && isset($_POST['event_id']) ) {
    $stmt = $mysqli->prepare("update events set title=? where id=?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    
    $stmt->bind_param('si', $_POST['new_title'], $_POST['event_id']);
    
    $stmt->execute();
    
    $stmt->close();





    $getHourStmt = $mysqli->prepare("select hour from events where id=?");
    if(!$getHourStmt){
        echo json_encode(array(
            "success" => false,
            "user_logged_in" => true
        ));
        exit;
    }
    $getHourStmt->bind_param('i', $_POST['event_id']);
    $getHourStmt->execute();
    $getHourStmt->bind_result($hour);

    $resultArr = array(); 


    while($getHourStmt->fetch()){
    
        
        echo json_encode(array(
            "success" => false,
            "user_logged_in" => true,
            "hour" => htmlentities($hour)
        ));
    }


    $getHourStmt->close();




}
else {
    echo "failed to edit";
}


?>