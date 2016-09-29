<?php
if($_SERVER['PHP_SELF'] == "/index.php" || $_SERVER['PHP_SELF'] == "/" || $_SERVER['PHP_SELF'] == "") {
    $cat=1;
    $scat=0;
    $npath='';
    $canonicallink='<link rel="canonical" href="'.$weburl.'" />';
}

$module = strtolower($_GET["nav"]);
$module = ($module=='' ? 'main_menu' : $module);

// figure out where we are within the site
$contentpage=strtolower($_SERVER['PHP_SELF']); // gives path like: /menu/drinks/index.php
//$contentpage=substr($contentpage, 1, strlen($contentpage)-1); // strip leading slash: menu/drinks/index.php
$contentpage=str_replace('index.php','',$contentpage); // strip filename: menu/drinks/
$contentpage.='/'; // add trailing slash: menu/drinks//
$contentpage=str_replace('//','/',$contentpage); // replace double-slashes with singles: menu/drinks/


$npath=$contentpage; // should be like: menu/drinks/ or menu/ or simply /

$canonicallink=($canonicallink=='' ? '<link rel="canonical" href="'.$weburl.$contentpage.'" />' : $canonicallink);




// build $webpagetitle

$blah = '';

$webpagetitle='';//($module=='' ? 'Main Menu' : $module);
$webpagetitle.=($module ? ucwords(str_replace('_',' ',str_replace('_and_',' & ',$module))) : '');
$webpagetitle.=($nscat ? ($ncat ? ' :: ' : '').ucwords(str_replace('_',' ',str_replace('_and_',' & ',$nscat))) : '');
$webpagetitle=str_replace('Default','Home',$webpagetitle);
$webpagetitle.=' ~ '.$webdescription.' ~ '.$webname;
if(strpos($webpagetitle,'Home')!==FALSE) {$webpagetitle=$webname.' ~ '.$webdescription;}


//////////////////////////
//
// start OUTPUT
//
//////////////////////////

echo ($doctype."\r\n"); // CONFIGZ

echo '<html lang="en">'."\r\n";
echo '<head>'."\r\n";
echo '<title>'.$webpagetitle.'</title>'."\r\n\r\n";

//if (!$inadmin && !$inupload) {include($incdir.'fbogtags.php');}

//echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
        
$metainfo = '<meta name="description" content="'.str_replace(' :: ',' ',$webpagetitle).'">'."\r\n".$metainfo;

echo $metainfo."\r\n"; // CONFIGZ
//echo $fbogtags."\r\n"; // CONFIGZ
echo $canonicallink."\r\n"; // ZHEADER
echo $styler."\r\n"; // CONFIGZ, via CONFIG

// Favorite Icons
echo $favicons."\r\n"; // CONFIG via CONFIGZ

// Scripts
echo $jscommon."\r\n"; // CONFIGZ

//if ($module!='main_menu' || 1) {
    include $rpath['js'].'zjscommon.php';
//}

echo '<script type="text/javascript" id="js_mod"></script>'."\r\n"; // loaded dynamincally


echo '</head>'."\r\n\r\n";

echo '<body>'."\r\n";
echo ($inadmin || $inupload ? '' : $schemaorgmetainfo);

echo comment('np:'.$npath.' cp:'.$contentpage.' c:'.$cat.'('.$ncat.') sc:'.$scat.'('.$nscat.') a:'.$art.'/'.count($articles));
echo comment('vip:'.$userip.' vc:'.$visitorcount.' unique:'.$visitorunique); // CONFIGZ

//echo '<div id="wrapper"><!-- BEG #wrapper -->'."\r\n";
?>
