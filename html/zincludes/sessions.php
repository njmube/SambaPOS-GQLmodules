<?php
/*

// Poll Voting Cookie
$chosen=isset($_POST['choices']) ? $_POST['choices'] : '';
//$chosen=$_GET['choices'];

//if(!isset($_SESSION['s_pollname'])) {$_SESSION['s_pollname']='';}

//if($_SESSION['s_pollname']=='') {
    $dbconn=dbconnect();
    include($incdir.'sql/polls/sqlgetpollname.php');
    dbclose($dbconn);
    $dbconn=NULL;
    $_SESSION['s_pollname']=str_replace(' ','',$pname[1]['Poll_Title']);
//}

$voteval=($_SESSION['s_pollname'] ? $_SESSION['s_pollname'] : 'nil');

if(isset($_COOKIE['c_voted'])) {
    if($_COOKIE['c_voted']!=$_SESSION['s_pollname']) {
        setcookie("c_voted", "novote", time()+60*60*24*365, "/", $_SERVER["HTTP_HOST"], 0);
    } else {
        setcookie("c_voted", "$voteval", time()+60*60*24*365, "/", $_SERVER["HTTP_HOST"], 0);
    }
}

if(!isset($_COOKIE['c_voted'])) {
    setcookie("c_voted", "novote", time()+60*60*24*365, "/", $_SERVER["HTTP_HOST"], 0);
}

if($chosen>0) {
    setcookie("c_voted", "$voteval", time()+60*60*24*365, "/", $_SERVER["HTTP_HOST"], 0);
}


*/