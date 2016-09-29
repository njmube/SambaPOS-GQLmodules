<?php
function colorHexToDec($hexColor) {
    if (substr($hexColor,0,1)!="#") {
        return $hexColor;
    }
    $decA = 1;
    $hexNum = substr($hexColor,1);
    //echo 'hexFull:'.$hexNum.' ';
    $hexLen = strlen($hexNum);
    $alphaChan = ($hexLen==8 ? substr($hexNum,0,2) : '');
    if ($alphaChan!='') {
        $hexNum = substr($hexNum,2);
        //echo 'hexNoAlpha:'.$hexNum.' ';
        $decA = hexdec($alphaChan);
        $decA = $decA/255;
    }
    $hexR = substr($hexNum,0,2);
    $hexG = substr($hexNum,2,2);
    $hexB = substr($hexNum,4,2);
    //echo 'hex'.$hexR.$hexG.$hexB;
    $decR = hexdec($hexR);
    $decG = hexdec($hexG);
    $decB = hexdec($hexB);
    //echo 'dec'.$decR.$decG.$decB;
    
    $brightness = ($decR * 299) + ($decG * 587) + ($decB * 114);
    $brightness = $brightness / 255000;
    // anything greater than 0.5 should be bright enough for dark text
    if ($brightness >= 0.5) {
      $textColor = "#000000";
    } else {
      $textColor = "#FFFFFF";
    }
  
    if ($alphaChan!='') {
        $bgColor = 'rgba('.$decR.','.$decG.','.$decB.','.$decA.')';
    } else {
        $bgColor = 'rgb('.$decR.','.$decG.','.$decB.')';
    }
    return array("bgColor" => $bgColor, "txtColor" => $textColor);
}

function delfiles($whichfiles = '') {
    if (strpos($whichfiles, '*') !== false) {
        if (glob($whichfiles)) {
            foreach (@glob($whichfiles) as $fn) {
                @unlink($fn);
            }
        }
    } else {
        @unlink($whichfiles);
    }
}

function calcDateDiff($date1, $date2) {
    if ($date2 > $date1) {
        $temp = $date2;
        $date2 = $date1;
        $date1 = $date2;
    }

    $diff = $date1 - $date2;
    $seconds = 0;
    $hours = 0;
    $minutes = 0;

    if ($diff % 86400 > 0) {
        $rest = ($diff % 86400);
        $days = ($diff - $rest) / 86400;

        if ($rest % 3600 > 0) {
            $rest1 = ($rest % 3600);
            $hours = ($rest - $rest1) / 3600;

            if ($rest1 % 60 > 0) {
                $rest2 = ($rest1 % 60);
                $minutes = ($rest1 - $rest2) / 60;
                $seconds = $rest2;
            } else
                $minutes = $rest1 / 60;
        } else
            $hours = $rest / 3600;
    } else
        $days = $diff / 86400;

    return array("days" => $days, "hours" => $hours, "minutes" => $minutes, "seconds" => $seconds);
}

function timeleft($edate, $tdate) {

    // $edate = event date/time
    // $tdate = today's date/time
    // must be passed in this function in the follwoing form:
    // YYYY/MM/DD hh:mm:ss <-- slashes and colons are required
    // 0123456789 01234567
    //$tfut=mktime(20,30,00,01,30,2004); // H,m,s,Mo,D,Y

    $now = time();
    if (!$edate) {
        $edate = strftime('%y/%m/%d %H:%M:%S', $now);
    }
    if (!$tdate) {
        $tdate = strftime('%y/%m/%d %H:%M:%S', $now);
    }

    // the future event date/time
    list($date, $time) = explode(" ", $edate);
    list($y, $mo, $d) = explode("/", $date);
    list($h, $min, $s) = explode(":", $time);
    $fut = mktime($h, $min, $s, $mo, $d, $y); // H,m,s,Mo,D,Y
    $dtfut = strftime('%y/%m/%d %H:%M:%S', $fut);
    list($datefut, $timefut) = explode(' ', $dtfut);
    list($yfut, $mofut, $dfut) = explode('/', $datefut);
    list($hfut, $mfut, $sfut) = explode(':', $timefut);


    // the now date/time
    list($date, $time) = explode(" ", $tdate);
    list($y, $mo, $d) = explode("/", $date);
    list($h, $min, $s) = explode(":", $time);
    $now = mktime($h, $min, $s, $mo, $d, $y); // H,m,s,Mo,D,Y
    $dtnow = strftime('%y/%m/%d %H:%M:%S', $now);
    list($datenow, $timenow) = explode(' ', $dtnow);
    list($ynow, $monow, $dnow) = explode('/', $datenow);
    list($hnow, $mnow, $snow) = explode(':', $timenow);

    $tfutsex = ($yfut * 12 * 30 * 24 * 60 * 60) + ($mofut * 30 * 24 * 60 * 60) + ($dfut * 24 * 60 * 60) + ($hfut * 60 * 60) + ($mfut * 60) + ($sfut);
    $tnowsex = ($ynow * 12 * 30 * 24 * 60 * 60) + ($monow * 30 * 24 * 60 * 60) + ($dnow * 24 * 60 * 60) + ($hnow * 60 * 60) + ($mnow * 60) + ($snow);

    if ($yfut < $ynow) {
        $tfutsex = 0;
    }

    //$tleftsex=$tfutsex-$tnowsex;
    $tleftsex = calcDateDiff($tfutsex, $tnowsex);
    //$tleft=date("d\d H\h i\m s\s",mktime(0,0,$tleftsex));

    /*
      echo '<span class="gensmall">';
      echo '<br />';

      echo 'tfut:'.$tfutsex.'<br />';
      echo 'tnow:'.$tnowsex.'<br />';
      echo 'tleftsex:'.$tleftsex.'<br />';
      echo 'tleft:'.$tleft.'<br />';

      echo '</span>';
     */
    return $tleftsex;
}

function mkdirs($strPath, $mode) {
    if (is_dir($strPath))
        return true;

    $pStrPath = dirname($strPath);
    if (!mkdirs($pStrPath, $mode))
        return false;
    return mkdir($strPath);
}

function GetFileList($dir, $ftype1 = 'gif', $ftype2 = 'jpg', $ftype3 = 'png') {
    if (!$dir) {
        $dir = ".";
    }
    $file_array = array();
    if (file_exists($dir) && $dir != '.' && $dir != '..') {
        $dir_handle = opendir($dir);
        $a = 1;
        while ($file = readdir($dir_handle)) {
            $fileinfo = pathinfo($file);
            if (strtolower($fileinfo['extension']) == strtolower($ftype1) || strtolower($fileinfo['extension']) == strtolower($ftype2) || strtolower($fileinfo['extension']) == strtolower($ftype3)) {
                $file_array[$a]['Filename'] = $fileinfo['basename']; //$file;
                $file_array[$a]['ext'] = $fileinfo['extension'];
                $file_array[$a]['bytes'] = filesize($dir . $file);
                $file_array[$a]['datemod'] = filemtime($dir . $file);
                $a++;
            }
        }
    }
    return $file_array;
}

function GetFileListAny($dir) {
    if (!$dir) {
        $dir = ".";
    }
    $file_array = array();
    if (file_exists($dir) && $dir != '.' && $dir != '..') {
        $dir_handle = opendir($dir);
        $a = 1;
        while ($file = readdir($dir_handle)) {
            if ($file != "." && $file != "..") {
                $fileinfo = pathinfo($file);
                $file_array[$a]['Filename'] = $file;
                $file_array[$a]['ext'] = $fileinfo['extension'];
                $file_array[$a]['isDIR'] = (is_dir($file) ? true : false);
                $file_array[$a]['bytes'] = filesize($dir . $file);
                $file_array[$a]['datemod'] = filemtime($dir . $file);
                $a++;
            }
        }
    }
    return $file_array;
}

function getFolList($folarr, $dirname, $z = 1, $pathlimit = '') {
    global $siteroot;
    global $z;
    global $folarr;
    global $pathlimit;
    //$dirname = $siteroot . '/' . $dirname;
    $dirname = str_replace('//', '/', $dirname);
    if (!$z) {
        $z = 1;
    }
    if (substr($dirname, -1) == '/') {
        $dirname = substr($dirname, 0, strlen($dirname) - 1);
    }
    $d = dir($dirname);
    while (false !== ($entry = $d->read())) {
        //while($entry = $d->read()) {
        if ($pathlimit && strpos($entry, $pathlimit) !== false) {
            if ($entry != "." && $entry != "..") {
                if (is_dir($dirname . "/" . $entry)) {
                    $temparr = $folarr;
                    $folarr[$z] = ($dirname . "/" . $entry);
                    $z++;
                    getFolList($temparr, ($dirname . "/" . $entry), $z, $pathlimit);
                }
            }
        } else {
            getFolList($temparr, ($dirname . "/" . $entry), $z, $pathlimit);
        }
    }
    $d->close();
    return ($folarr);
}

function getFileListnew($dir, $recurse = false) {
    $retval = array();

    // add trailing slash if missing
    if (substr($dir, -1) != "/")
        $dir .= "/";

    // open pointer to directory and read list of files
    $d = @dir($dir) or die("getFileList: Failed opening directory $dir for reading");
    while (false !== ($entry = $d->read())) {
        // skip hidden files
        if ($entry[0] == ".")
            continue;
        if (is_dir("$dir$entry")) {
            $retval[] = array(
                "name" => "$dir$entry/",
                "type" => filetype("$dir$entry"),
                "size" => 0,
                "lastmod" => filemtime("$dir$entry")
            );
            if ($recurse && is_readable("$dir$entry/")) {
                $retval = array_merge($retval, getFileList("$dir$entry/", true));
            }
        } elseif (is_readable("$dir$entry")) {
            $retval[] = array(
                "name" => "$dir$entry",
                "type" => mime_content_type("$dir$entry"),
                "size" => filesize("$dir$entry"),
                "lastmod" => filemtime("$dir$entry")
            );
        }
    }
    $d->close();

    return $retval;
}

function getPathObjects($path, $extensions = '', $excludeextensions='', $recurse = false) {
    //$path = $updir.'./'.$path;
    $path = str_replace('//', '/', $path);

    if ($recurse) {
        try {
            //$directory = new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS);
            $directory = new RecursiveDirectoryIterator($path);
            $iterator = new RecursiveIteratorIterator($directory, RecursiveIteratorIterator::SELF_FIRST, RecursiveIteratorIterator::CATCH_GET_CHILD);
            //$iterator = new RecursiveIteratorIterator($directory);
        } catch (Exception $e) {
            return 0;//$e->getMessage();
        }
    } else {
        try {
            //$iterator = new RecursiveDirectoryIterator($path,RecursiveDirectoryIterator::SKIP_DOTS);
            $iterator = new RecursiveDirectoryIterator($path);
        } catch (Exception $e) {
            return 0;//$e->getMessage();
        }
    }

    //$extensions = array("png", "jpg", "jpeg", "gif", "gifgif");

    $o=0;
    foreach ($iterator as $fileinfo) {
        $nodots = $fileinfo->getFilename();
        $nodots = ($nodots[0] == '.' ? false : true);
        if ($nodots) {
            if (!$excludeextensions && $extensions && $extensions[0] != 'dir' && !$fileinfo->isDir() && in_array($fileinfo->getExtension(), $extensions)) {
                $o++;
                $pathEntry[$o]['Filename'] = $fileinfo->getFilename();
                $pathEntry[$o]['ext'] = $fileinfo->getExtension();
                $pathEntry[$o]['bytes'] = $fileinfo->getSize();
                $pathEntry[$o]['datemod'] = $fileinfo->getMTime();
                $pathEntry[$o]['dateacc'] = $fileinfo->getATime();
                //$pathEntry[$o]['isDIR'] = 0;
            }
            if ($excludeextensions && !$fileinfo->isDir() && !in_array($fileinfo->getExtension(), $excludeextensions)) {
                $o++;
                $pathEntry[$o]['Filename'] = $fileinfo->getFilename();
                $pathEntry[$o]['ext'] = $fileinfo->getExtension();
                $pathEntry[$o]['bytes'] = $fileinfo->getSize();
                $pathEntry[$o]['datemod'] = $fileinfo->getMTime();
                $pathEntry[$o]['dateacc'] = $fileinfo->getATime();            }
                //$pathEntry[$o]['isDIR'] = 0;
            if (!$excludeextensions && !$extensions && !$fileinfo->isDir()) {
                $o++;
                //$pathEntry[$o] = str_replace("\\", "/", $fileinfo->getPathname());
                $pathEntry[$o]['Filename'] = $fileinfo->getFilename();
                $pathEntry[$o]['ext'] = $fileinfo->getExtension();
                $pathEntry[$o]['bytes'] = $fileinfo->getSize();
                $pathEntry[$o]['datemod'] = $fileinfo->getMTime();
                $pathEntry[$o]['dateacc'] = $fileinfo->getATime();
                //$pathEntry[$o]['isDIR'] = 0;
                continue;
            }
            if (!$excludeextensions && $extensions && $extensions[0] == 'dir' && $fileinfo->isDir()) {
                $o++;
                $pathEntry[$o] = str_replace("\\", "/", $fileinfo->getPathname());
                continue;
            }
//            if (!$excludeextensions && !$extensions) {
//                $o++;
//                $pathEntry[$o] = str_replace("\\", "/", $fileinfo->getPathname());
//            }
        }
    }
    return $pathEntry;
}

function eregi_replace_alt($pat_alt, $repl_alt, $in_alt) {
    $out_alt = $in_alt;
    $out_alt = preg_replace('(' . $pat_alt . ')', $repl_alt, $in_alt);
    return $out_alt;
}

function comment($intext) {
    $outtext = "\r\n<!-- " . $intext . " -->\r\n";
    Return $outtext;
}

function FormatTextOutput($intext) {
    global $imgpath;
    $outtext = $intext;

    if (strpos(strtolower($outtext), '<html>') === FALSE) {
        //$outtext=str_replace("  ","&nbsp;&nbsp;",$outtext);
        $outtext = str_replace("\r\n", "<br />", $outtext);
        $outtext = str_replace("\n\r", "<br />", $outtext);
        $outtext = str_replace("\r", "<br />", $outtext);
        $outtext = str_replace("\n", "<br />", $outtext);
        $outtext = str_replace('src="images/', 'src="' . $imgpath, $outtext);
    } else {
        $outtext = eregi_replace_alt("<html>", '', $outtext);
        $outtext = eregi_replace_alt("</html>", '', $outtext);
    }
    Return $outtext;
}

function bbcode($intext) {
    $outtext = $intext;

    $outtext = str_replace('&#58;', ':', $outtext);
    $outtext = str_replace('&#46;', '.', $outtext);
    $outtext = str_replace('&lt;', '<', $outtext);
    $outtext = str_replace('&gt;', '>', $outtext);

    $outtext = eregi_replace_alt('(\[b:)+[a-z0-9]*\]+', '<b>', $outtext);
    $outtext = eregi_replace_alt('(\[/b:)+[a-z0-9]*\]+', '</b>', $outtext);

    $outtext = str_replace('[url=http://', '[url=http', $outtext);

    $pat = "(\[url=http)+([a-z0-9]|\.)*(:)*([a-z0-9])+\]+";
    $outtext = eregi_replace_alt($pat, '', $outtext);
    $outtext = eregi_replace_alt('(\[/url:)+[a-z0-9]*\]+', '', $outtext);

    $pat = "(\[size=)+([a-z0-9])*(:)+([a-z0-9])*\]+";
    $outtext = eregi_replace_alt($pat, '', $outtext);
    $outtext = eregi_replace_alt('(\[/size:)+[a-z0-9]*\]+', '', $outtext);

    $pat = "(\[color=)+([a-z0-9])*(:)+([a-z0-9])*\]+";
    $outtext = eregi_replace_alt($pat, '', $outtext);
    $outtext = eregi_replace_alt('(\[/color:)+[a-z0-9]*\]+', '', $outtext);

    $outtext = eregi_replace_alt('(\[img:)+[a-z0-9]*\]+', '<img src = "', $outtext);
    $outtext = eregi_replace_alt('(\[/img:)+[a-z0-9]*\]+', '" />', $outtext);

    Return $outtext;
}

function AutoLink($intext) {
    global $weburl;
    global $alinks;
    $outtext = $intext;

    for ($i = 1; $i <= count($alinks); $i++) {
        $kw = explode(',', $alinks[$i]['Link_Keywords']);
        for ($k = 0; $k < count($kw); $k++) {
            //echo $kw[$k];
            $repl = '<a';
            $repl.=' href="' . (strpos($alinks[$i]['Link_URL'], 'http://') === 0 ? '' : $weburl);
            $repl.=$alinks[$i]['Link_URL'] . '"';
            $repl.=(strpos($alinks[$i]['Link_URL'], 'http://') === 0 ? ' target="_blank"' : '');
            $repl.=' title="' . $kw[$k] . '"';
            $repl.='>';
            $repl.=$kw[$k];
            $repl.='</a>';
            $outtext = str_replace($kw[$k], $repl, $outtext);
        }
    }
    Return $outtext;
}

function AutoLink2($intext) {
    global $weburl;
    global $alinks;
    $outtext = $intext;

    for ($i = 1; $i <= count($alinks); $i++) {
        $kw = explode(',', $alinks[$i]['Link_Keywords']);
        for ($k = 0; $k < count($kw); $k++) {
            //echo $kw[$k];
            $repl = '';
            $repl.=($alinks[$i]['Link_Bold'] ? '<b>' : '');
            $repl.='<a';
            $repl.=' href="' . (strpos($alinks[$i]['Link_URL'], 'http://') === 0 ? '' : $weburl . '/');
            $repl.=$alinks[$i]['Link_URL'] . '"';
            $repl.=(strpos($alinks[$i]['Link_URL'], 'http://') === 0 ? ' target="_blank"' : '');
            $repl.=' title="' . $kw[$k] . '"';
            $repl.='>';
            $repl.=$kw[$k];
            $repl.='</a>';
            $repl.=($alinks[$i]['Link_Bold'] ? '</b>' : '');
            $outtext = str_replace($kw[$k], $repl, $outtext);
        }
    }
    Return $outtext;
}

function ImageInfo($imgrel = '', $imgtitle = '') {
    global $imgnotfound;
    $imgattr = $imgrel;
    $img = NULL;
    if (!file_exists($imgrel)) {
        $imgrel = $imgnotfound;
    }
    $img['src'] = $imgrel;
    $img['href'] = str_replace(' ', '%20', 'http://' . $_SERVER["HTTP_HOST"] . '/' . str_replace('../','',$imgrel));
    $img['alt'] = strip_tags($imgrel);
    
    $pp = pathinfo($imgrel);
    $img['folder'] = $pp['dirname'] . '/';
    $img['file'] = $pp['basename'];
    $img['ext'] = $pp['extension'];

    $img['atts'] = getimagesize($imgrel);
    $img['width'] = $img['atts'][0];
    $img['height'] = $img['atts'][1];

    $img['title'] = $imgtitle ? $imgtitle : $imgrel;

    return $img;
}

function imgcontrol($fldr, $fil, $maxwidth = 100000, $maxheight = 100000) {
    global $imgnotfound;
    $img['list'] = GetFileList($fldr, 'gif', 'jpg');
    $img['alt'] = $fldr . $fil;
    while (substr($img['alt'], 0, 3) == '../') {
        $img['alt'] = substr($img['alt'], 3);
    }
    $img['title'] = $img['alt'];

    // build url path for image if it exists otherwise use the noimage.jpg image from the root of the images directory
    if (file_exists(str_replace('/', '\\', $fldr)) && $fil != '') {
        $img['src'] = 'http://' . $_SERVER["HTTP_HOST"] . '/' . $img['alt'];
    } else {
        $img['src'] = $imgnotfound;
    }

    // get Image Attributes
    if (file_exists(str_replace('/', '\\', $fldr)) && $fil != '') {
        $img['atts'] = getimagesize(str_replace(' ', '%20', str_replace('/', '\\', $fldr) . $fil));
    } else {
        $img['atts'] = getimagesize(str_replace(' ', '%20', $img['src']));
    }

    $img['width'] = $img['atts'][0];
    $img['height'] = $img['atts'][1];

    $img['folder'] = $fldr;
    $img['file'] = $fil;

    Return $img;
}

function writefile($filename, $fileline, $writemode) {
    clearstatcache();
    ignore_user_abort(true);    ## prevent refresh from aborting file operations and hosing file
    if (file_exists($filename)) {
        $fh = fopen($filename, $writemode); // w+=r/w/bof/trunc a+=r/w/eof +r=r/w/bof
        while (1) {
            if (flock($fh, LOCK_EX)) {
                #$buffer = chop(fgets($fh, 2));
                //$buffer = chop(fread($fh, filesize($$filename)));
                $buffer = fread($fh, filesize($filename));
                //$buffer++;
                $buffer .= $fileline;
                rewind($fh);
                fwrite($fh, $buffer);
                fflush($fh);
                ftruncate($fh, ftell($fh));
                flock($fh, LOCK_UN);
                break;
            }
        }
    } else {
        $fh = fopen($filename, 'w+'); // w+=r/w/bof/trunc a+=r/w/eof +r=r/w/bof
        fwrite($fh, "");
        //$buffer="1";
    }
    if ($fh) {
        fclose($fh);
    }

    //print "Count is $buffer";
    //echo $sname."<br>";
    return $buffer;
}

function readfromfile($filename) {
    // get contents of a file into a string
    $filecontents = '';
    if (file_exists($filename)) {
        $fh = fopen($filename, "r");
        $filecontents = fread($fh, filesize($filename));
        fclose($fh);
    } else {
        $filecontents = 'ERROR - file not found [' . $filename . ']';
    }
    Return $filecontents;
}

function ReadCSV($csvfile) {
    clearstatcache();
    ignore_user_abort(true);    ## prevent refresh from aborting file operations and hosing file

    if (file_exists($csvfile)) {
        $fh = fopen($csvfile, 'r');
        if ($fh) {
            while (1) {
                if (flock($fh, LOCK_EX)) {
                    $lv = 1;
                    $lt = 1;
                    while (!feof($fh)) {
                        $temp = fgets($fh);
                        if (substr($temp, 0, 1) == '"') {
                            $buffer[$lv] = $temp;
                            $lv++;
                        }
                        $lt++;
                    }
                    flock($fh, LOCK_UN);
                    break;
                }
            }
        }
    }

    if ($fh) {
        fclose($fh);
    }

    $buffer[0] = ($lv - 1) . '/' . ($lt - 1);
    return $buffer;
}

function getBrowser() {
    $u_agent = $_SERVER['HTTP_USER_AGENT'];
    $bname = 'Unknown';
    $platform = 'Unknown';
    $version = "";

    //First get the platform?
    if (preg_match('/linux/i', $u_agent)) {
        $platform = 'linux';
    } elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
        $platform = 'mac';
    } elseif (preg_match('/windows|win32/i', $u_agent)) {
        $platform = 'windows';
    }

    // Next get the name of the useragent yes seperately and for good reason
    if (preg_match('/MSIE/i', $u_agent) && !preg_match('/Opera/i', $u_agent)) {
        $bname = 'Internet Explorer';
        $ub = "MSIE";
    } elseif (preg_match('/Trident/i', $u_agent) && !preg_match('/Opera/i', $u_agent)) {
        $bname = 'Internet Explorer';
        $ub = "Trident";
    } elseif (preg_match('/Firefox/i', $u_agent)) {
        $bname = 'Mozilla Firefox';
        $ub = "Firefox";
    } elseif (preg_match('/Chrome/i', $u_agent)) {
        $bname = 'Google Chrome';
        $ub = "Chrome";
    } elseif (preg_match('/Safari/i', $u_agent)) {
        $bname = 'Apple Safari';
        $ub = "Safari";
    } elseif (preg_match('/Opera/i', $u_agent)) {
        $bname = 'Opera';
        $ub = "Opera";
    } elseif (preg_match('/Netscape/i', $u_agent)) {
        $bname = 'Netscape';
        $ub = "Netscape";
    }

    // finally get the correct version number
    $known = array('Version', $ub, 'other');
    $pattern = '#(?<browser>' . join('|', $known) .
            ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
    if (!preg_match_all($pattern, $u_agent, $matches)) {
        // we have no matching number just continue
    }

    // see how many we have
    $i = count($matches['browser']);
    if ($i != 1) {
        //we will have two since we are not using 'other' argument yet
        //see if version is before or after the name
        if (strripos($u_agent, "Version") < strripos($u_agent, $ub)) {
            $version = $matches['version'][0];
        } else {
            $version = $matches['version'][1];
        }
    } else {
        $version = $matches['version'][0];
    }

    // check if we have a number
    if ($version == null || $version == "") {
        $version = "?";
    }

    return array(
        'userAgent' => $u_agent,
        'name' => $bname,
        'version' => $version,
        'platform' => $platform,
        'pattern' => $pattern
    );
}

//// now try it
//$ua=getBrowser();
//$yourbrowser= "Your browser: " . $ua['name'] . " " . $ua['version'] . " on " .$ua['platform'] . " reports: <br >" . $ua['userAgent'];
//print_r($yourbrowser);


// *** the resize_image function uses the following class
/*
include $bpath['inc'] . ("resizer_class.php");

function resize_image($isource, $idest, $iwidth, $iheight, $rmode, $iquality, $ioverwrite=false) {

    if (!$ioverwrite && file_exists($idest)) {
        return 'thumb exists:'.$idest;
    }
    if (!file_exists($isource)) {
        return 'source not exist:'.$isource;
    }


    // *** Include the class
    //include $bpath['inc'].("resizer_class.php");
    // *** 1) Initialise / load image
    $resizeObj = new resizer($isource);

    // *** 2) Resize image (width, height, mode: exact, portrait (height), landscape (width), auto, crop)
    $rresult = $resizeObj->resizeImage($iwidth, $iheight, $rmode);

    // *** 3) Save image (filename, quality)
    $sresult = $resizeObj->saveImage($idest, $iquality);

    $resizeObj = null;
    unset($resizeObj);

    //echo 'r:'.$rresult.' s:'.$sresult;

    return 0;
}
*/
?>