<?php
// if this var is not set, we have no config, so get out
if ($webdom=='') {
    header("Location: ../");
    die();
}

$formname='auth';
$formaction = 'http://'.$webdom;

$username = $_POST['username'];
$pword = $_POST['pword'];

//echo '<br />host:'.$webdom."\r\n";
//echo '<br />aldom:'.$autologinDomain."\r\n";
//echo '<br />s_currentuser:'.$_SESSION['s_currentuser']."\r\n";
//echo '<br />currentSambaUser:'.$currentSambaUser."\r\n";
//echo '<br />autologin:'.($autologin==true ? '1' : '0')."\r\n";
//echo '<br />username:'.$username."\r\n";
//echo '<br />pword:'.$pword."\r\n";

if ($logout==1) {
    $_SESSION['s_currentuser']=null;
    unset($_SESSION['s_currentuser']);
    
    $username=null;
    $pword=null;

    echo '<script language="Javascript">'.'location.href="http://'.$webdom.'";'.'</script>';
}
    
$dbconn = dbconnect();

$qry = "
SELECT
 u.[Id] as [uId]
,u.[Name] as [uName]
,u.[PinCode] as [uPin]
,ur.[Id] as [urId]
,ur.[Name] as [urName]
,ur.[IsAdmin]
FROM [Users] u
left join [UserRoles] ur on ur.[Id]=u.[UserRole_Id]
WHERE 1=1
";

$oqry="order by u.[Name]"."\r\n";

// all users
$users = dbquery($qry.$oqry);
$userscount = count($users);

// specific User
//$wqry = "AND u.[Name]='".$username."'";
$wqry = "AND u.[Name] = ?"."\r\n";
$qryparms = array($username);
$dbuser = dbquery($qry.$wqry.$oqry,$qryparms);
$dbusercount = count($dbuser);


dbclose();

$dbuser = $dbusercount>0 ? $dbuser[1] : NULL;

//echo '<br />dbuser:'.$dbuser['uName']."\r\n";
//echo '<br />dbpin:'.$dbuser['uPin']."\r\n";

if ($autologin==true) {
    $pword = $dbuser['uPin'];
}

if($pword!='' && $pword==$dbuser['uPin']) {
    $_SESSION['s_currentuser']=$username;
	echo '<script language="Javascript">'.'location.href="'.$formaction.'";'.'</script>';
}



echo comment('Display the Form');

echo '<FORM name="'.$formname.'" method="POST" action="'.$formaction.'" onSubmit="proc_form(document.'.$formname.'.pword.value);">'."\r\n\r\n";

echo '<div style="width:100%;text-align:center;">'."\r\n\r\n";

    echo '<div style="padding:5px;">'."\r\n\r\n";
    
        echo '<br />'."\r\n\r\n";

        echo '<div style="display:inline-block;">'."\r\n";
        
        echo '<INPUT TYPE="hidden" NAME="username" ID="username" VALUE="'.($autologin==true ? $dbuser['uName'] : $username).'">'."\r\n\r\n";

        echo 'User<br />';
        echo '<SELECT size="1" style="font-size:20px;" name="selecteduser" title="User" ID="selecteduser" onchange="setfocus(\'pword\');">'."\r\n";
        for ($s=1; $s<=$userscount; $s++) {
            echo '<OPTION VALUE="'.$users[$s]['uName'].'"';
            echo ($username==$users[$s]['uName'] ? ' selected' : '');
            echo '>';
            echo $users[$s]['uName'].'</OPTION>'."\r\n";
        }
        echo '</SELECT>'."\r\n\r\n";

        echo '</div>'."\r\n\r\n";
        
        echo '<div style="display:inline-block;margin-left:10px;">'."\r\n";
        echo 'PIN<br />';
        echo '<INPUT style="font-size:20px;" TYPE="password" NAME="pword" ID="pword" size="8" title="PIN" VALUE="">'."\r\n";
        echo '</div>'."\r\n\r\n";
        
        echo '<br /><br />'."\r\n\r\n";

        include('numpad.php');
      
        echo '<br />'."\r\n\r\n";

        echo '<div id="pinpad-button" style="background-color:#006600;padding:15px;margin:3px;" onclick="proc_form(document.'.$formname.'.pword.value);">'."\r\n";
        echo 'LOGIN';
        echo '</div>'."\r\n";
        

    echo '</div>'."\r\n\r\n";

echo '</div>'."\r\n\r\n";

echo '</FORM>'."\r\n\r\n";
?>

<!-- Form Submit Control -->
<SCRIPT language="Javascript" type="text/javascript">
var oper;

function proc_form(oper) {
	var errmsg='';
    if (oper!='') {
        document.<?php echo $formname; ?>.pword.value=oper;
    }
        
    if(document.getElementById('selecteduser')) {
        var uname=document.getElementById('selecteduser').value;
        document.<?php echo $formname; ?>.username.value=uname;
    }

	if(document.<?php echo $formname; ?>.username.value=='') {
		errmsg+="Username\r\n";
	}
	if(document.<?php echo $formname; ?>.pword.value=='') {
		errmsg+="Password\r\n";
	}
	if(!errmsg) {
		document.<?php echo $formname; ?>.submit();
	} else {
		alert("The following missing information is required:\r\n\r\n"+errmsg);
	}
}

function enterdigit(but) {
    if(document.getElementById('pword')) {
        var fieldval=document.getElementById('pword').value;
        if (but=='back') {
            fieldval=fieldval.substr(0,fieldval.length-1);
        } else if (but=='clear') {
            fieldval='';
        } else {
            fieldval+=but;
        }
        
        document.<?php echo $formname; ?>.pword.value=fieldval;
    }

}

function setfocus(elem) {
    if(document.getElementById(elem)) {
        document.getElementById(elem).focus();
    }
    if (elem=='pword') {
        enterdigit('clear');
    }
}

setfocus('pword');
</SCRIPT>

<?php
if($autologin==true) {
	echo '<script language="JavaScript">';
	echo 'if(document.'.$formname.'.pword.value!="") {';
    echo 'proc_form();';
	echo '}';
    echo '</script>';
}
?>