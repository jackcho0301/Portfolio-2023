<?php

    require 'database.php';

    session_start();



    if(!hash_equals($_SESSION['token'], $_POST['new_event_token'])){
        echo json_encode(array(
            "success" => false,
            "user_logged_in" => false
        ));
        die("Request forgery detected");
    }



if (!$_SESSION['user-logged-in']) {

    echo json_encode(array(
        "success" => false,
        "user_logged_in" => false
    ));
    session_destroy();
    exit;
}

    if (isset($_POST['new_event_title']) && isset($_POST['new_event_date'])  && isset($_POST['new_event_time_hour'])  && isset($_POST['new_event_time_am_pm'])) {


        $hourInt = intval($_POST['new_event_time_hour']);

        if ($_POST["new_event_time_am_pm"]  == "am" ) {
            if ($hourInt == 12) {
                $hourInt = 0;
            }
        }
        else {
            if ($hourInt != 12) {
                $hourInt = $hourInt + 12;
            }
        }

        if (isset($_POST['username_to_share'])) {







            if ($_POST['username_to_share'] === "") {
                $stmt = $mysqli->prepare("insert into events (title, username, date, hour) values (?, ?, ?, ?)");
            if(!$stmt){
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }
            $dat = date("2022-03-03"); //REQUIRED FOR BINDING DATE
            
            $stmt->bind_param('sssi', $_POST['new_event_title'], $_SESSION['username'], $_POST['new_event_date'], $hourInt);
            
            $stmt->execute();
            
            $stmt->close();
        
            echo json_encode(array(
                "success" => true,
                "user_logged_in" => true
            ));            
            }




            else {

                $shared_stmt = $mysqli->prepare("select username from users where username=?");
                if(!$shared_stmt){
                    printf("Query Prep Failed: %s\n", $mysqli->error);
                    exit;
                }
                $shared_stmt->bind_param('s', $_POST['username_to_share']);
                $shared_stmt->execute();
                $shared_stmt->bind_result($username_result);
            
            
                $row = $shared_stmt->fetch();

                if( ! $row)
                    {
                  
                        echo json_encode(array(
                            "username_to_share_with_does_not_exist" => true
                        ));    
                        exit;
                    }
                $shared_stmt->close();

            






                $stmt = $mysqli->prepare("insert into events (title, username, date, hour, shared_username) values (?, ?, ?, ?, ?)");
            if(!$stmt){
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }
            $dat = date("2022-03-03"); //REQUIRED FOR BINDING DATE
            
            $stmt->bind_param('sssis', $_POST['new_event_title'], $_SESSION['username'], $_POST['new_event_date'], $hourInt, $_POST['username_to_share']);
            
            $stmt->execute();
            
            $stmt->close();
        
            echo json_encode(array(
                "success" => true,
                "user_logged_in" => true
            ));     
            }
             
        }
        else {
    }

    }
    else {
        echo "cannot execute insert query";
    }
?>