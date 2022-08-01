<?php
// login_ajax.php

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json


$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];



require 'database.php';

$validLogin = false;

//check format of username
if (!preg_match('/^[\w_\-]+$/', $username)) {

    echo "Invalid username; remove spaces or unusual characters";

} else {

    //verify password for existing user: (need to query database)
        // https://classes.engineering.wustl.edu/cse330/index.php?title=Web_Application_Security,_Part_2

    // Use a prepared statement
    $stmt = $mysqli->prepare("SELECT COUNT(*), hashed_password FROM users WHERE username=?");

    // Bind the parameter
    $stmt->bind_param('s', $user);
    $user = $username;
    $stmt->execute();

    // Bind the results
    $stmt->bind_result($cnt, $pwd_hash);
    $stmt->fetch();

    $pwd_guess = $password;
    // Compare the submitted password to the actual password hash

    if ($cnt == 1 && password_verify($pwd_guess, $pwd_hash)) {
        // Login succeeded!


        $validLogin = true;
    } else {

      
    }
    $stmt->close();
}










if( $validLogin ){
	session_start();
	$_SESSION['username'] = $username;
    $_SESSION['user-logged-in'] = true;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

	echo json_encode(array(
		"success" => true,
        "token" => htmlentities($_SESSION['token'])
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>