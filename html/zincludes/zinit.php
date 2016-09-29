<?php
// PHP's default character set is set to empty.
// http://php.net/default-charset
ini_set("default_charset","UTF-8");

// Timezone - can be overridden in CONFIG
date_default_timezone_set("Etc/GMT+6"); // CST: central standard time

// Emulate register_globals on
if (!ini_get('register_globals')) {
    $superglobals = array($_SERVER, $_ENV,
        $_FILES, $_COOKIE, $_POST, $_GET);
    if (isset($_SESSION)) {
        array_unshift($superglobals, $_SESSION);
    }
    foreach ($superglobals as $superglobal) {
        extract($superglobal, EXTR_SKIP);
		//echo $superglobal.'<br />';
    }
}
// let's make sure the $_SERVER['DOCUMENT_ROOT'] variable is set
if(!isset($_SERVER['DOCUMENT_ROOT'])){ if(isset($_SERVER['SCRIPT_FILENAME'])){
//$_SERVER['DOCUMENT_ROOT'] = str_replace( '\\', '/', substr($_SERVER['SCRIPT_FILENAME'], 0, 0-strlen($_SERVER['PHP_SELF'])));
$_SERVER['DOCUMENT_ROOT'] = substr($_SERVER['SCRIPT_FILENAME'], 0, 0-strlen($_SERVER['PHP_SELF']));
}; };
if(!isset($_SERVER['DOCUMENT_ROOT'])){ if(isset($_SERVER['PATH_TRANSLATED'])){
//$_SERVER['DOCUMENT_ROOT'] = str_replace( '\\', '/', substr(str_replace('\\\\', '\\', $_SERVER['PATH_TRANSLATED']), 0, 0-strlen($_SERVER['PHP_SELF'])));
$_SERVER['DOCUMENT_ROOT'] = substr(str_replace('\\\\', '\\', $_SERVER['PATH_TRANSLATED']), 0, 0-strlen($_SERVER['PHP_SELF']));
}; };


// get client browser IP for VOTING
// we need this before CONFIGZ
$userip = $_SERVER["REMOTE_ADDR"];

// set some more site path variables
$siteroot = $_SERVER['DOCUMENT_ROOT'];
$_SERVER['DOCUMENT_ROOT'] = null;

$cfgdir = $siteroot.'/zconfigs/';
$incdir = $siteroot.'/zincludes/';
$navdir = $siteroot.'/znav/';
$pgdir  = 'zpage/';
$cssdir = 'zcss/';
$jsdir  = 'zjs/';
$imgpath  = 'images/';
$photopath = 'photos/';
$tempdir = 'ztemp/';

// paths based on website root
$bpath['cfg'] = $siteroot.'/zconfigs/';
$bpath['inc'] = $siteroot.'/zincludes/';
$bpath['nav'] = $siteroot.'/znav/';
// paths which are relative
$rpath['pg'] = 'zpage/';
$rpath['css'] = 'zcss/';
$rpath['js'] = 'zjs/';
$rpath['img'] = 'images/';
$rpath['photo'] = 'photos/';
$rpath['tmp'] = 'ztemp/';


// quick toggles to check if in AS or UPLOAD
$inadmin  = (strpos($_SERVER["PHP_SELF"],'admin.php')!==FALSE ? TRUE : FALSE);
$inupload = (strpos($_SERVER['PHP_SELF'], 'upload/')!==FALSE ? TRUE : FALSE);


/////////////////////////////////////////////
// find out where we are
// and updir relative paths if necessary
/////////////////////////////////////////////

$where = str_replace('/','',$_SERVER["PHP_SELF"],$replcount); // $replcount will contain number of replacements
$where=null;

$replcount--; // subtract 1 for the file (i.e. /index.php)

$updir = '';
if ($replcount) {
    for ($r=1; $r<=$replcount; $r++) {
        $updir .= '../';
    }
}

if ($updir) {
    foreach($rpath as $k => $v) {
        $rpath[$k] = $updir.$v;
    }
    $pgdir  = $updir.$pgdir;
    $cssdir = $updir.$cssdir;
    $jsdir  = $updir.$jsdir;
    $imgpath  = $updir.$imgpath;
    $photopath  = $updir.$photopath;
    $tempdir  = $updir.$tempdir;
}


if (file_exists($bpath['inc'].('zzzdebug.txt'))) {
    $debug=true;
} else {
    $debug=false;
}
if ($debug || 1==1) {
    error_reporting(E_ALL & ~E_NOTICE);
    //E_ALL & ~E_DEPRECATED & ~E_STRICT
    //error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);
    ini_set("display_errors", 1);
}


// CONSTANT decalarations used throughout the site
include $bpath['inc'].('constants.php');

// FUNCTION declarations used throughout the site
include $bpath['inc'].('functions.php');

// FUNCTION declarations used throughout the site
include $bpath['inc'].('functionsdb.php');

// CONFIG load... causes subsequent load of CONFIGZ
include $bpath['cfg'].('config.php');


// User Agent (Browser) info
$ua=getBrowser();

if(!$inadmin && !$inupload && file_exists($bpath['inc'].('sql/sqlvisitorinfo.php'))) {
    include $bpath['inc'].('sql/sqlvisitorinfo.php');
}

if(!$inadmin && !$inupload && file_exists($bpath['inc'].('sql/sqlmetainfo.php'))) {
    include $bpath['inc'].('sql/sqlmetainfo.php');
}

if (!$inadmin && !$inupload && file_exists($bpath['inc'].('prepage.php'))) {
    include $bpath['inc'].('prepage.php');
}
?>