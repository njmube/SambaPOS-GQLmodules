<?php
// if this var is not set, we have no config, so get out
if ($webdom=='') {
    header("Location: ../");
    die();
}

/////////////////////////////////////////////
// DB connectivity info
/////////////////////////////////////////////

$db_type = 'MSSQL';
$db_host = 'localhost\SQLEXPRESS';
$db_user = 'sa';
$db_pass = 'sambapos';
$db_name = 'SambaPOS5';

?>
