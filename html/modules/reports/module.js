////////////////////////////////
//
// nav_reports
//
////////////////////////////////
function init_nav() {
    // do some stuff
}
spu.consoleLog('Initializing '+module.replace(/_/,' ').toUpperCase()+' ...');

var selectedTemplate = '';

$('#REP_Reports').on('click', '.REP_Report', function(){
    var reportButton = this.id; // Employees_Jenery, Employees_Ovania, ...
    var reportName = reportButton.replace(/Reports_/g,'');
        reportName = reportName.replace(/_/g,' ');
    var hasParms = document.getElementById(reportButton).getAttribute('hasParms');
    
    spu.consoleLog('Report Clicked:'+reportButton+' ('+reportName+')');
    
    var reportPeriod = document.getElementById('REP_PeriodPicker').value;
    var reportStart = document.getElementById('REP_DateStart').value;
        reportStart = (reportStart!='' ? reportStart + ' 00:00:00' : '');
    var reportEnd = document.getElementById('REP_DateEnd').value;
        reportEnd = (reportEnd!='' ? reportEnd + ' 23:59:59' : '');
    var reportParameters = document.getElementById('REP_Parms').value;
    
    if (hasParms=='1') {
        document.getElementById('REP_Parms').style.borderColor = '#55FFBB';
        document.getElementById('REP_Parms').style.backgroundColor = '#55FFBB';
        //$('#REP_Parameters').show();
    } else {
        document.getElementById('REP_Parms').style.borderColor = '';
        document.getElementById('REP_Parms').style.backgroundColor = '';
        //$('#REP_Parameters').hide();
    }
    
    if (reportPeriod!='' && reportPeriod!='ignore' && reportPeriod!='This Year' && reportPeriod!='Past Year') {
        reportStart = '';
        reportEnd = '';
    }
    
    if (reportParameters.length>0){
        var parmList = reportParameters.replace(/, /g,',').split(',');
        reportParameters = '';
        for (var p=0; p<parmList.length; p++) {
            reportParameters += '{name:"'+(p+1)+'",value:"'+parmList[p]+'"}';
            reportParameters += (p===parmList.length-1 ? '' : ',');
        }
    }
    
    reportHeaders  = [];
    reportHeadersD = [];
    reportHeadersS = [];

    selectedTemplate = '';
    
    $('#helpMessage').hide();
    
    for (var e=0; e<customReports.length; e++) {
        var rb = 'Reports_' + customReports[e]["name"].replace(/ /g,'_');
        if (document.getElementById(rb)) {
            document.getElementById(rb).setAttribute('isSelected','0');
            document.getElementById(rb).style.borderColor = '';
        }
        
        if (rb == reportButton) {
            parseReportHeaderRows(customReports[e]["template"]);
            parseReportColumns(customReports[e]["cols"]);
            
            selectedTemplate = customReports[e]["template"];
        }
    }
    
    if (document.getElementById(reportButton)) {
        var isSel = (document.getElementById(reportButton).getAttribute('isSelected') == '1' ? '0' : '1');
        document.getElementById(reportButton).setAttribute('isSelected',isSel);
        if (isSel == 1) {
            document.getElementById(reportButton).style.borderColor = '#FFBB00';
            //TC_selectedEntities.push(reportButton);
            spu.consoleLog('Selected Report: '+reportName);
            
            //getCustomReport(reportName,user,dateFilter,startDate,endDate,parameters);
            $('#REP_Report').empty();
            $('#REP_Report').append('<br /><br /><div class="info-message"">... Generating Report ...<br /><br />'+busyWheel+'</div>');

            jumpTop();

            getCustomReport(reportName,currentUser,reportPeriod,reportStart,reportEnd, reportParameters, function getRep(report) {
                    displayReport(report,reportName);
                }
            );
        } else {
            document.getElementById(reportButton).style.borderColor = '';
            spu.consoleLog('DE-Selected Report: '+reportName);
            $('#REP_Report').empty();
        }
    }

});

$('#REP_Parameters').on('click', '.REP_Help', function(){
    var noTemplate = '<span style="color:#FFDD00;">No Template to show.  Select a Report first, then try again.</span>';
    var msg = (selectedTemplate!='' ? selectedTemplate.replace(/LINEBREAK/g,'<br />') : noTemplate);
        msg = '<span style="font-family:Consolas,Lucida;line-height:1.3;">' + msg + '</span>';
    showHelpMessage(msg);
});
