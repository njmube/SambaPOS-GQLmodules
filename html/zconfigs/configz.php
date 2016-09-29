<?php
// if this var is not set, we have no config, so get out
if ($webdom=='') {
    header("Location: ../");
    die();
}

/////////////////////////////////////////////
// CONFIGZ.PHP
//
// more variables that are required for
// proper site functionality and shouldn't
// be altered, unless you know what they do
/////////////////////////////////////////////


// originally set in zgetglobs, we overwrite them here with values set in CONFIG
$imgpath  = $updir.$imgpath;
$photopath  = $updir.$photopath;
$rpath['img'] = $imgpath;
$rpath['photo'] = $photopath;
$imgnotfound    = $updir.$imgnotfound;
if(!file_exists($imgnotfound)) {$imgnotfound=$rpath['img'].'noimage.jpg';}


// CSS files
if(!$inadmin && !$inupload) {
    $styler = '';
    $styler .= '<link rel="stylesheet" type="text/css" href="'.$rpath['css'].'reset.min.css" />'."\r\n";
    $styler .= '<link rel="stylesheet" type="text/css" href="'.$rpath['css'].$stylesheet.'" media="screen" />'."\r\n"; // config.php
    //$styler .= '<link rel="stylesheet" type="text/css" href="'.$rpath['css'].'styles.css" media="screen" />'."\r\n";
    //$styler .= '<link rel="stylesheet" type="text/css" href="'.$rpath['css'].'print.css" media="print" />'."\r\n";
    //$styler .= '<link rel="stylesheet" type="text/css" href="'.$rpath['css'].'lightbox.css" media="screen" />'."\r\n";

    // favicons
    $favicons='';
    $favicons.='<link rel="shortcut icon" href="'.$rpath['img'].$favico.'" />'."\r\n";
    $favicons.='<link rel="icon" type="image/gif" href="'.$rpath['img'].$favgif.'" />'."\r\n";
}


// set JS scripts
$jscommon = '';
//$jscommon .= '<script type="text/javascript">var weburl="'.$weburl.'/"</script>'."\r\n";


/////////////////////////////////////////////
// Check and set sessions and cookies
/////////////////////////////////////////////

session_start();

if ($_SERVER["PHP_SELF"]=='/index.php' || $_SERVER["PHP_SELF"]=='/') {include $incdir.('sessions.php');}

if($inadmin || $inupload) {
    // we use $imgroot for the AS, independent of $imgpath
    $imgroot=$rpath['img'];
    $photoroot=$rpath['photo'];
    $styler = '<link rel="stylesheet" type="text/css" href="'.$rpath['css'].'admin.css">';
}

if($inadmin) {
    $jscommon .= '<script type="text/javascript" src="'.$rpath['js'].'rollout.js"></script>'."\r\n";
    include ('assessions.php');
    include ('controlarray.php');
    // AS Control Rollouts
    for($r=1; $r<=count($controls); $r++) {
        $cat_on = !isset($_COOKIE['rollout_' . $r]) || !empty($_COOKIE['rollout_' . $r]) ? true : false;
        if( $cat_on ) {
            $ro[$r]=true;
        } else {
            $ro[$r]=false;
        }
    }
}
?>