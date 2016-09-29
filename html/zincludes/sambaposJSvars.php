<?php
// start JS Arrays
$btnArrayTicket = '[';
$btnArrayOrder  = '[';
$btnArrayRow1   = '[';
$btnArrayRow2   = '[';
// loop through SQL Rows for Automation Command Buttons
for ($b=1; $b<=count($amcButtons); $b++) {
    // if the Button has no Header, skip it
    if ($amcButtons[$b]["ButtonHeader"]) {
        $amcButton    = $amcButtons[$b];
        $buttonID     = str_replace(" ", "_",$amcButton["Name"]);
        $buttonName   = $amcButton["Name"];
        $buttonHeader = $amcButton["ButtonHeader"];
        $buttonHeader = str_replace("\\r","<br />",$buttonHeader);
        $buttonColors = colorHexToDec($amcButton["Color"]);
        $btnBGcolor   = $buttonColors["bgColor"];
        $btnTextColor = $buttonColors["txtColor"];
        
        // build JS Button Object
        $btnProps = '{';
        $btnProps.= '"buttonID":"' . $buttonID . '"';
        $btnProps.= ',"buttonName":"' . $buttonName . '"';
        $btnProps.= ',"btnBGcolor":"' . $btnBGcolor . '"';
        $btnProps.= ',"btnTextColor":"' . $btnTextColor . '"';
        $btnProps.= ',"buttonHeader":"' . $buttonHeader . '"';
        $btnProps.= '}';
        $btnProps.= ', ';

        // add JS Button Object to applicable JS Array
        if ($amcButtons[$b]["DisplayOnTicket"]==1) {
            $btnArrayTicket .= $btnProps;
        }
        if ($amcButtons[$b]["DisplayOnOrders"]==1) {
            $btnArrayOrder .= $btnProps;
        }
        if ($amcButtons[$b]["DisplayUnderTicket"]==1) {
            $btnArrayRow1 .= $btnProps;
        }
        if ($amcButtons[$b]["DisplayUnderTicket2"]==1) {
            $btnArrayRow2 .= $btnProps;
        }
    }
}
// trim trailing comma and terminate JS Array
$btnArrayTicket = substr($btnArrayTicket,0,-2) . ']';
$btnArrayOrder  = substr($btnArrayOrder,0,-2) . ']';
$btnArrayRow1   = substr($btnArrayRow1,0,-2) . ']';
$btnArrayRow2   = substr($btnArrayRow2,0,-2) . ']';
// write the JS Arrays into document
echo 'var amcBtns_ticketCommands = '.$btnArrayTicket.';'."\r\n\r\n";
echo 'var amcBtns_orderCommands = ' .$btnArrayOrder.';'."\r\n\r\n";
echo 'var amcBtns_ticketRow1 = '.$btnArrayRow1.';'."\r\n\r\n";
echo 'var amcBtns_ticketRow2 = '.$btnArrayRow2.';'."\r\n\r\n";


$reports = '[';
for ($r=1; $r<=count($customReports); $r++) {
    if ($customReports[$r]['DisplayInExplorer']=='1') {
        // escape Template
        $template = $customReports[$r]['Template'];
        $template = str_replace("\r\n",'LINEBREAK',$template);
        $template = str_replace('"','\"',$template);
        // get columnCount and ColWidths
        $headEnd = strpos($template,']');
        $head = substr($template,0,$headEnd+1);
        $colStart = strpos($head,':');
        $cols = substr($head,$colStart+1,(strlen($head)-$colStart-2));
        $hasParms = (strpos($template,'$') > -1 ? '1' : '0');
        
        // build JS Object
        $reports .= '{';
        $reports .= '"id":"' . $customReports[$r]['Id'] . '"';
        $reports .= ',"hasParms":"' . $hasParms . '"';
        $reports .= ',"name":"' . $customReports[$r]['Name'] . '"';
        $reports .= ',"head":"' . $head . '"';
        $reports .= ',"cols":"' . $cols . '"';
        $reports .= ',"template":"' . $template . '"';
        $reports .= '}';
        $reports .= ($r<count($customReports) ? ',' : '');
    }
}
$reports .= ']';
echo 'var customReports = '.$reports.';'."\r\n\r\n";


$ttypes = '[';
for ($t=1; $t<=count($taskTypes); $t++) {
    $ttypes .= '{';
    $ttypes .= 'id:' . $taskTypes[$t]["Id"];
    $ttypes .= ',name:"' . $taskTypes[$t]["Name"] . '"';
    $ttypes .= ',customFields:[';
    $cf = '';
    for ($c=1; $c<=count($taskTypeCustomFields); $c++) {
        if ($taskTypeCustomFields[$c]["TaskTypeId"] == $taskTypes[$t]["Id"]) {
            $cf .= '{name:"' . $taskTypeCustomFields[$c]["Name"] . '"';
            $cf .= ',fieldType:"' . $taskTypeCustomFields[$c]["FieldType"] . '"';
            $cf .= ',editingFormat:"' . $taskTypeCustomFields[$c]["EditingFormat"] . '"';
            $cf .= ',displayFormat:"' . $taskTypeCustomFields[$c]["DisplayFormat"] . '"';
            $cf .= '}';
            $cf .= ',';
        }
    }
    $ttypes .= (strlen($cf)>0 ? substr($cf,0,-1) : '');
    $ttypes .= ']';
    $ttypes .= '}';
    $ttypes .= ($t<count($taskTypes) ? ',' : '');
}
$ttypes .= ']';
echo 'var taskTypes = '.$ttypes.';'."\r\n\r\n";