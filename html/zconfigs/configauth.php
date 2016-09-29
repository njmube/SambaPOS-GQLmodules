<?php
// authentication will be bypassed if client IP matches any of these
$bip = 0;
$bypassips[++$bip] = '::1';
$bypassips[++$bip] = '127.0.0.1';

$matchip = false;
for ($b=1; $b<=count($bypassips); $b++) {
    $matchip = strpos($bypassips[$b],$userip)!==false ? true : false;
    if ($matchip===true) {
        break;
    }
}

$bypassauth = $matchip;