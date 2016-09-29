<?php
// if this var is not set, we have no config, so get out
if ($webdom=='') {
    header("Location: ../");
    die();
}

/**
 * The JavaScript function for enterdigit() is
 * located in file /zincludes/auth.php
 */
 
for ($b=1; $b<4; $b++) {
    $but=$b;
    echo '<div id="pinpad-button" style="background-color:#000066;padding:15px;margin:3px;" onclick="enterdigit(\''.$but.'\')">'."\r\n";
    echo $but;
    echo '</div>'."\r\n";
}
echo '<br />'."\r\n\r\n";
for ($b=4; $b<7; $b++) {
    $but=$b;
    echo '<div id="pinpad-button" style="background-color:#000066;padding:15px;margin:3px;" onclick="enterdigit(\''.$but.'\')">'."\r\n";
    echo $but;
    echo '</div>'."\r\n";
}
echo '<br />'."\r\n\r\n";
for ($b=7; $b<10; $b++) {
    $but=$b;
    echo '<div id="pinpad-button" style="background-color:#000066;padding:15px;margin:3px;" onclick="enterdigit(\''.$but.'\')">'."\r\n";
    echo $but;
    echo '</div>'."\r\n";
}
echo '<br />'."\r\n\r\n";

$but='back';
echo '<div id="pinpad-button" style="background-color:#660000;padding:15px;margin:3px;" onclick="enterdigit(\''.$but.'\')">'."\r\n";
echo '&lt;';
echo '</div>'."\r\n";

$but='0';
echo '<div id="pinpad-button" style="background-color:#000066;padding:15px;margin:3px;" onclick="enterdigit(\''.$but.'\')">'."\r\n";
echo $but;
echo '</div>'."\r\n";

$but='clear';
echo '<div id="pinpad-button" style="background-color:#000000;padding:15px;margin:3px;" onclick="enterdigit(\''.$but.'\')">'."\r\n";
echo 'X';
echo '</div>'."\r\n";
?>