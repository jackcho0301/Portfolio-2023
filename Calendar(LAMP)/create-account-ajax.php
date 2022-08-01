<?php

    require 'database.php';

    if (isset($_POST['new-username']) && isset($_POST['new-password'])) {



        //insert query for creating new account

        $new_username = $_POST['new-username'];
        $new_password = password_hash($_POST['new-password'], PASSWORD_BCRYPT); //https://classes.engineering.wustl.edu/cse330/index.php?title=Web_Application_Security,_Part_2

       
        if (!preg_match('/^[\w_\-]+$/', $new_username)) {
            echo json_encode(array(
                "success" => false
            ));
            exit;
        }


        //check if username is duplicate, if so, exit
        $checkIfUsernameExists = $mysqli->prepare("select username from users where username='$new_username' ");
        if (!$checkIfUsernameExists) {
            echo json_encode(array(
                "success" => false
            ));
            exit;
        }
        $checkIfUsernameExists->execute();
        $checkIfUsernameExists->bind_result($duplicate_username);
        if ($checkIfUsernameExists->fetch() != null) {
  
            echo json_encode(array(
                "success" => false
            ));
            exit;
            
        }
        else {
        // valid new username, so insert to database:
        $stmt = $mysqli->prepare("insert into users (username, hashed_password) values (?, ?)");
        if (!$stmt) {
            exit;
        }
        $stmt->bind_param('ss', $new_username, $new_password);
        $stmt->execute();
        $stmt->close();
        echo json_encode(array(
            "success" => true
        ));
    }
    }
    ?>