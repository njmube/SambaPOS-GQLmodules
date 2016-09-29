<?php
/////////////////////////////////////////////
// CONFIG VALUES THAT CAN BE CHANGED
//
// the order in which these variables
// appear and are defined can be important
// to proper site functionality, so it's
// best to not rearrange their order
/////////////////////////////////////////////


// the name of the website, and it's root URL
$webname = "SambaPOS";		//  MySiteName
$webdom = $_SERVER["HTTP_HOST"];	//  www.mydom.com[:port]
$websrv = $_SERVER["SERVER_NAME"];	//  www.mydom.com (no port)
$weburl = 'http://'.$webdom;		//  http://www.mydom.com

// KEYWORDS to be used in META tags
$keywords = 'POS';

// DESCRIPTION to be used in META tags
$webdescription="SambaPOS Mobile Application";

// CSS file
$stylesheet = 'sambapos.css';

// root path for images
$imgpath='images/';
$photopath='media/photos/';

// define missing image
$imgnotfound=$imgpath.'noimage.jpg';

// favicons
$favico = 'icons/favicon.ico';
$favgif = 'icons/favicon-blue.png';

// path to the Admin System (AS)
$adminpath = '!admin/';

// Document type ... don't alter it unless you know what it's for, and how it can affect things
//$doctype = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
//$doctype = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">';
$doctype = '<!doctype html>'; // HTML 5


/////////////////////////////////////////////
// REQUIRED FILES
//
// the following files are required for
// proper site functionality, and should
// not be moved from this area of this file
/////////////////////////////////////////////

// DATABASE (DB) connectivity information
// alterations to this file may be required to coincide with the DB configuration of the server
include $bpath['cfg'].('configdb.php');

// AUTHENTICATION information
// alterations to this file may be required
// to set the IP addresses that can bypass Authentication
include $bpath['cfg'].('configauth.php');

// E-Mail information
// alterations to this file may be required to coincide with your mailserver
//include $bpath['cfg'].('configemailer.php');


/////////////////////////////////////////////
// CONFIGZ.PHP
//
// the following file is included to set
// up more variables that are required for
// proper site functionality and shouldn't
// be altered, unless you know what effect
// it can have
/////////////////////////////////////////////
include ($bpath['cfg'].'configz.php');
?>
