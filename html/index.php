<?php
error_reporting(E_ALL & ~E_NOTICE); ini_set('display_errors', 1); // uncomment this line for debugging
include ('/zincludes/zinit.php');

include $bpath['inc'].('zheader.php');

// at this point $bypassauth will be set to true (bypass auth) or false (perform auth)

if(($logout==1 || $_SESSION['s_currentuser']=='') && !$bypassauth ) {

    include $bpath['inc'].('auth.php');

} else {
    
    include ('main.html');

}

include $bpath['inc'].('zfooter.php');