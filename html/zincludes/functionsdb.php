<?php
$queries = '';

function dbconnect($dhost = '', $duser = '', $dpass = '', $dname = '') {
    global $db_type, $db_host, $db_user, $db_pass, $db_name;

    $dhost = ($dhost ? $dhost : $db_host);
    $dhost = ($dhost ? $dhost : 'localhost');

    $duser = ($duser ? $duser : $db_user);
    $dpass = ($dpass ? $dpass : $db_pass);
    $dname = ($dname ? $dname : $db_name);

    if ($db_type == 'MySQL') {
        $db_resource = mydbconnect();
    } elseif ($db_type == 'MSSQL') {
        $db_resource = msdbconnect($dhost, $duser, $dpass, $dname);
    } else {
        echo '<b style="color:#FF0000">ERROR connecting to Database: db_type unknown</b>';
        echo '<PRE><CODE>';
        echo 'DB Type:' . $db_type . "\r\n";
        echo 'DB Host:' . $dhost . "\r\n";
        echo '</CODE></PRE>';
        die('<b style="color:#FF0000">EXECUTION TERMINATED!</b>');
    }

    return $db_resource;
}

function dbclose($conn = '') {
    global $db_type, $dbconn;

    $conn = ($conn ? $conn : $dbconn);

    if ($db_type == 'MySQL') {
        mysql_close($conn);
    }
    if ($db_type == 'MSSQL') {
        sqlsrv_close($conn);
    }

    return 0;
}

function dbquery($inqry, $inparms = array(), $arrname = 'unknown', $conn = '') {
    global $db_type, $dbconn;

    $conn = ($conn ? $conn : $dbconn);

    if ($db_type == 'MySQL') {
        $db_queryresult = myexecquery($inqry);
    }
    if ($db_type == 'MSSQL') {
        $db_queryresult = msexecquery($conn, $inqry, $inparms, $arrname);
    }

    return $db_queryresult;
}

function dbinsertid($inresultid) {
    global $db_type;
    if ($db_type == 'MySQL') {
        $db_insertid = mysql_insert_id();
    }
    if ($db_type == 'MSSQL') {
        sqlsrv_next_result($inresultid);
        sqlsrv_fetch($inresultid);
        $db_insertid = sqlsrv_get_field($inresultid, 0);
    }

    return $db_insertid;
}

function mydbconnect() {
    global $db_host, $db_user, $db_pass, $db_name;

    $eiq_dbresource = mysql_connect($db_host, $db_user, $db_pass) or die('<b style="color:#FF0000">ERROR connecting to MySQL:</b><PRE><CODE>' . mysql_error() . '</CODE></PRE>');
    mysql_select_db($db_name);

    Return $eiq_dbresource;
}

function msdbconnect($dhost = '', $duser = '', $dpass = '', $dname = '') {
    global $db_host, $db_user, $db_pass, $db_name;

    $dhost = ($dhost ? $dhost : $db_host);
    $duser = ($duser ? $duser : $db_user);
    $dpass = ($dpass ? $dpass : $db_pass);
    $dname = ($dname ? $dname : $db_name);

    $connectionInfo = array("UID" => $duser,
        "PWD" => $dpass,
        "Database" => $dname, "ReturnDatesAsStrings" => true);

    $mssql_dbresource = sqlsrv_connect($dhost, $connectionInfo);
    if ($mssql_dbresource === false) {
        echo '<b style="color:#FF0000">ERROR connecting to MSSQL:</b>';
        echo '<PRE><CODE>';
        print_r(sqlsrv_errors(), false);
        echo '</CODE></PRE>';
        die('<b style="color:#FF0000">EXECUTION TERMINATED!</b>');
    }
    Return $mssql_dbresource;
}

function myexecquery($inqry) {
    $qrytype = 'mySQL';
    $queryrecords = array();

    $queryresult = mysql_query($inqry) or die('<b style="color:#FF0000">ERROR executing MySQL query:</b><PRE><CODE>' . mysql_error() . '</CODE></PRE><b>QUERY:</b><PRE><CODE>' . $inqry . '</CODE></PRE>');

    $qrc = mysql_num_rows($queryresult);

    for ($q = 1; $q <= $qrc; $q++) {
        $queryrecords[$q] = mysql_fetch_array($queryresult, MYSQL_ASSOC);
    }

    mysql_free_result($queryresult);

    addquery($inqry, $qrc, $qrytype);

    Return $queryrecords[1];
}

function msexecquery($conn, $inqry, $inparms=array(), $arrname = 'unknown') {
    $qrytype = 'MSSQL';
    $queryrecords = array();

    $querystart = $inqry;
    $inqry_commentremoved = $inqry;
    
    //remove comments before executing
    $commentfirstpos = strpos($inqry,'--');
    if ($commentfirstpos!==false) {
        $crfirstpos = strpos($inqry,"\r\n");
        if ($crfirstpos!==false) {
            $querystart = substr($inqry,$crfirstpos+2);
            $inqry_commentremoved = substr($inqry,$crfirstpos+2);
        }
    }
    //echo 'querystart:'.$querystart.'... ';
    
    $querystart = strtoupper(trim(substr($querystart, 0, 10))); // SELECT, INSERT, UPDATE, DELETE
    //echo 'querystart:'.$querystart.'... ';
    
    $query_type = 'UNKNOWN';
    if (strpos($querystart, 'SELECT') !== FALSE) {
        $query_type = 'SELECT';
    }
    if (strpos($querystart, 'INSERT') !== FALSE) {
        $query_type = 'INSERT';
        $inqry .= "; SELECT SCOPE_IDENTITY() AS IDENTITY_COLUMN_NAME";
        $inqry_commentremoved .= "; SELECT SCOPE_IDENTITY() AS IDENTITY_COLUMN_NAME";
    }
    if (strpos($querystart, 'UPDATE') !== FALSE) {
        $query_type = 'UPDATE';
    }
    if (strpos($querystart, 'DELETE') !== FALSE) {
        $query_type = 'DELETE';
    }
    if (strpos($querystart, 'ALTER') !== FALSE) {
        $query_type = 'ALTER';
    }
    //echo 'query_type:'.$query_type.'xxx ';
    
    //$queryresult = sqlsrv_query($conn, $inqry, array(), array("Scrollable" => SQLSRV_CURSOR_KEYSET));
    $queryresult = sqlsrv_query($conn, $inqry_commentremoved, $inparms, array("Scrollable" => SQLSRV_CURSOR_STATIC));

    if ($queryresult === false) {
        dberror(sqlsrv_errors(), $inqry);
    }

    if ($query_type == 'SELECT') {
        // return the SELECT records
        $qrc = sqlsrv_num_rows($queryresult);
        for ($q = 1; $q <= $qrc; $q++) {
            $queryrecords[$q] = sqlsrv_fetch_array($queryresult);
        }
        $ReturnVal = $queryrecords;
    } else if ($query_type == 'INSERT') {
        // return the last Insert ID
        $ReturnVal = dbinsertid($queryresult);
    } else {
        // return the RESOURCE
        $ReturnVal = $queryresult;
    }

    sqlsrv_free_stmt($queryresult);

    addquery($inqry, $qrc, $qrytype, $arrname);

    Return $ReturnVal;
}

function addquery($inqry, $rcount, $inqrytype = 'mySQL', $arrname = 'unknown') {
    global $queries;
    global $queriescount;
    global $recordstotalcount;

    $queriescount++;
    $recordstotalcount+=$rcount;

    $currentquery = "\r\n--- Query#:" . $queriescount . " -- (" . $inqrytype . ") -- Records:" . $rcount . " -- Array:" . $arrname . " ----------------\r\n\r\n";
    $currentquery.=$inqry . "\r\n";

    $queries.=$currentquery;
}

function dbconnect2($db2_dbuser, $db2_dbpass, $db2_dbname) {
    global $eiq_dbhost;

    $db2_dbresource = mysql_connect($eiq_dbhost, $db2_dbuser, $db2_dbpass) or die('I cannot connect to the database because: ' . mysql_error());
    mysql_select_db($db2_dbname);

    Return $db2_dbresource;
}

function dbescapestring($instr) {
    global $db_type;

    if ($db_type == 'MySQL') {
        $outstr = mysql_escape_string($instr);
    }
    if ($db_type == 'MSSQL') {
        $outstr = mssql_real_escape_string($instr);
    }
    return $outstr;
}

function mssql_real_escape_string($s) {
    if (get_magic_quotes_gpc()) {
        $s = stripslashes($s);
    }
    $s = str_replace("'", "''", $s);
    return $s;
}

function showquery($q, $showit = 1) {
    $q = str_replace('\r\n', '<br/>', $q);
    $q = str_replace(', ', '<br/>, ', $q);
    $q = str_replace('FROM', '<br/>FROM', $q);
    $q = str_replace('WHERE', '<br/>WHERE', $q);
    $q = '<PRE><CODE style="font:Consolas">' . trim($q) . '</CODE></PRE>';
    if ($showit == 1) {
        echo $q;
    }
    return $q;
}

function dberror($dberror_array=array(), $inqry='', $dberror_die=true) {
    //$bt = debug_backtrace();
    //$caller = array_shift($bt);
    // echo $caller['file'];
    // echo $caller['line'];
  
    echo '<b style="color:#FF0000">ERROR executing query</b>';

    echo '<PRE><CODE>';
    print_r($dberror_array, false);
    echo '</CODE></PRE>';
    
    echo '<b style="color:#FFFFFF">QUERY:</b>';
    echo '<PRE><CODE style="font:Consolas">' . showquery($inqry, 0) . '</CODE></PRE>';

    echo '<br /><br />';
    echo '<b style="color:#FF00FF">BACKTRACE:</b>';
    echo '<PRE><CODE>';
    var_dump(debug_backtrace());
    echo '</CODE></PRE>';
    
    if ($dberror_die) {
        die('<b style="color:#FF0000">EXECUTION TERMINATED!</b>');
    }
}
?>