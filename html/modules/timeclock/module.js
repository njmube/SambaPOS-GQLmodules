////////////////////////////////
//
// nav_timeclock
//
////////////////////////////////
function init_nav() {
    // do some stuff
}
spu.consoleLog('Initializing '+module.replace(/_/,' ').toUpperCase()+' ...');

$('#TC_Entities').on('click', '.TC_Entity', function(){
    var entityButton = this.id; // Employees_Jenery, Employees_Ovania, ...
    var entityName = entityButton.replace(/Employees_/g,'');
    spu.consoleLog('TC Entity Clicked:'+entityButton+' ('+entityName+')');
    
    var reportPeriod = document.getElementById('REP_PeriodPicker').value;
    var reportStart = document.getElementById('REP_DateStart').value;
        //reportStart = (reportStart!='' ? reportStart + ' 00:00:00' : '');
    var reportEnd = document.getElementById('REP_DateEnd').value;
        //reportEnd = (reportEnd!='' ? reportEnd + ' 23:59:59' : '');

    var parameters = '{name:"1",value:"Employees"}';
        parameters+=',{name:"2",value:"'+entityName+'"}';
        parameters+=',{name:"3",value:"'+reportStart+'"}';
        parameters+=',{name:"4",value:"'+reportEnd+'"}';

    if (reportPeriod!='' && reportPeriod!='ignore' && reportPeriod!='This Year' && reportPeriod!='Past Year') {
        reportStart = '';
        reportEnd = '';
    }

    
    for (var e=0; e<TC_selectedEntities.length; e++) {
        if (document.getElementById(TC_selectedEntities[e])) {
            document.getElementById(TC_selectedEntities[e]).setAttribute('isSelected','0');
            document.getElementById(TC_selectedEntities[e]).style.borderColor = '';
        }
    }
    
    TC_selectedEntities = [];
    
    if (document.getElementById(entityButton)) {
        var isSel = (document.getElementById(entityButton).getAttribute('isSelected') == '1' ? '0' : '1');
        document.getElementById(entityButton).setAttribute('isSelected',isSel);
        if (isSel == 1) {
            document.getElementById(entityButton).style.borderColor = '#FFBB00';
            TC_selectedEntities.push(entityButton);
            spu.consoleLog('Selected TC Entity: '+entityName);
            
            
            reportHeaders  = [];
            reportHeadersD = [];
            reportHeadersS = [];

            for (var e=0; e<customReports.length; e++) {
                if (customReports[e]["name"] == 'TC Employee Hours') {
                    parseReportHeaderRows(customReports[e]["template"]);
                    parseReportColumns(customReports[e]["cols"]);
                }
            }
                
            //getCustomReport(reportName,user,dateFilter,startDate,endDate,parameters);
            $('#REP_Report').empty();
            $('#REP_Report').append('<br /><br /><div class="info-message">... Generating Report ...<br /><br />'+busyWheel+'</div>');


                
            getCustomReport('TC Employee Hours',currentUser,reportPeriod,reportStart,reportEnd, parameters, function getRep(report) {
                    displayReport(report);
                }
            );
        } else {
            document.getElementById(entityButton).style.borderColor = '';
            spu.consoleLog('DE-Selected TC Entity: '+entityName);
            $('#TC_Report').empty();
        }
    }

});

$('#TC_EntityCommands').on('click', '.TC_EntityCommand', function(){
    var cmdButton = this.id; // Employees_Jenery, Employees_Ovania, ...
    var cmdName = cmdButton.replace(/TC_/g,'');
    spu.consoleLog('TC Command Clicked:'+cmdButton+' ('+cmdName+')');
    
    if (document.getElementById(cmdButton)) {
        var isSel = (document.getElementById(cmdButton).getAttribute('isSelected') == '1' ? '0' : '1');
        document.getElementById(cmdButton).setAttribute('isSelected',isSel);
        if (isSel == 1) {
            document.getElementById(cmdButton).style.borderColor = '#6666FF';
            spu.consoleLog('Selected TC Command: '+cmdButton);
        } else {
            document.getElementById(cmdButton).style.borderColor = '';
            spu.consoleLog('DE-Selected TC Command: '+cmdButton);
        }
    }

    if (TC_selectedEntities.length>0) {
        var selEnt = TC_selectedEntities[0];

        //$('#TC_Entities').html('<div class="info-message">Updating Entities, please Wait...<br /><br />'+busyWheel+'</div>');
        $('#TC_EntityCommands').hide();
        updateEmployeePunchState(selEnt,cmdButton, function refresh() {
            refreshTimeclockDisplay(TC_EntityType,TC_EntitySearch, function sel() {
                document.getElementById(selEnt).click();
                document.getElementById(selEnt).style.borderColor = '#FFBB00';
                $('#TC_EntityCommands').show();
            });
        });
    }
    document.getElementById(cmdButton).style.borderColor = '';
});

function updateEmployeePunchState(entityButtonId,cmdButton,callback) {
    if (document.getElementById(entityButtonId)) {
        var entityId = document.getElementById(entityButtonId).getAttribute('entityId');
        var entityName = entityButtonId.replace(/Employees_/g,'');
        var payRates = document.getElementById(entityButtonId).getAttribute('payRates');
        var punchStateCurrent = document.getElementById(entityButtonId).getAttribute('punchState');
        var taskId = document.getElementById(entityButtonId).getAttribute('taskId');
        var taskIdent = document.getElementById(entityButtonId).getAttribute('taskIdent');
        var taskStartUTC = document.getElementById(entityButtonId).getAttribute('taskStartUTC');
        var taskDatetimeISO = document.getElementById(entityButtonId).getAttribute('taskDatetimeISO');
        spu.consoleLog(entityButtonId+' punchState: '+punchStateCurrent);

        var punchTaskTypes = [];
            punchTaskTypes.push(TC_PunchTaskType);
        var punchControlTaskTypes = [];
            punchControlTaskTypes.push(TC_PunchControlTaskType);
        var taskIdents = [];
            taskIdents.push(taskIdent);
        var entityNames = [];
            entityNames.push(entityName);
        
        var punchStateNew = (punchStateCurrent == 'Punched Out' ? 'Punched In' : 'Punched Out');
        
        var addControlTask = (punchStateNew == 'Punched In' ? true : false);
        var completeControlTask = (punchStateNew == 'Punched Out' ? true : false);
        
        var GMToffset = getClientGMToffset();
        var dtNow = new Date();                        // DateObject: 2016-07-28T18:17:36.094Z
        var utcMilliSeconds = getDateTime(dtNow,'ms'); // 1469729856094
        var utcSeconds = getDateTime(dtNow,'s');       // 1469729856     // UNIX Timestamp (UTC) // seconds since EPOCH 1970-01-01 00:00:00 (midnight UTC/GMT)
        var utcMinutes = getDateTime(dtNow,'m');       // 24495498
        var dtISO = formatDateTime(dtNow,true,true);   // 2016-07-28T12:17:36.094
        var dtISOgmt = dtISO + GMToffset;              // 2016-07-28T12:17:36.094-06:00
        var dtISOutc = dtISO + 'Z';                    // 2016-07-28T12:17:36.094Z
        
        var myDate = Date.parse(dtISOgmt);
        var myEpoch = myDate/1000.0;

        var punchDataFOUND = (taskIdent == "" ? false : true);
        
        if (!punchDataFOUND) {
            spu.consoleLog('NO PUNCH DATA FOUND.  Setting Task Start timeStamp to NOW.');
            punchStateCurrent = 'Punched Out';
            punchStateNew = 'Punched In';
            taskStartUTC = utcSeconds;
            taskDatetimeISO = dtISOgmt;
        }
        spu.consoleLog('Task Start: taskStartUTC('+taskStartUTC+') taskDatetimeISO('+taskDatetimeISO+')');

        var taskDuration = utcSeconds - taskStartUTC;
        
        var TT_timestampPunchCreated = taskStartUTC;
        var TT_timestampPunchUpdated = utcSeconds;
        var TT_datetimePunchCreated = taskDatetimeISO;
        var TT_datetimePunchUpdated = dtISOgmt;
        
        var TT_timestampPunchControlCreated = taskStartUTC;
        var TT_timestampPunchControlUpdated = utcSeconds;
        var TT_datestamp = taskDatetimeISO.toString().substr(0,10);
        
        var ident = utcMilliSeconds + '-' + entityName + '-' + entityId;             // 1469729856094-Jenery-44
        
        if (!punchDataFOUND) {
            taskIdent = ident;
        }
        
        var punchContent = punchStateNew + ': '+entityName + ' ('+dtISOgmt+')';      // Punched In: Jenery (2016-07-28T12:17:36.094-06:00)
        var punchControlContent = 'Punch Cycle: '+ident;                             // Punch Cycle: 1469729856094-Jenery-44
        
        var customDataPunch = [];
            customDataPunch.push({name:"entityType",value:"Employees"});
            customDataPunch.push({name:"entityId",value:entityId});
            customDataPunch.push({name:"entityName",value:entityName});
            customDataPunch.push({name:"payRates",value:payRates});
            customDataPunch.push({name:"stateName",value:"TC Punch Status"});
            customDataPunch.push({name:"state",value:punchStateNew});
            customDataPunch.push({name:"startState",value:punchStateCurrent});
            customDataPunch.push({name:"endState",value:punchStateNew});
            // TimeTrex Data
            customDataPunch.push({name:"TT_type_id",value:punchStateNew});              // punch type (Punched In or Punched Out)
/*
            customDataPunch.push({name:"TT_deleted_date",value:0});         // UTC seconds placeholder for future use
            customDataPunch.push({name:"TT_created_by",value:currentUser}); // placeholder for future use
            customDataPunch.push({name:"TT_updated_by",value:currentUser}); // placeholder for future use
            customDataPunch.push({name:"TT_deleted_by",value:0});           // placeholder for future use
            customDataPunch.push({name:"TT_station_id",value:0});           // placeholder for future use
            customDataPunch.push({name:"TT_transfer",value:0});             // placeholder for future use
            customDataPunch.push({name:"TT_longitude",value:0});            // placeholder for future use
            customDataPunch.push({name:"TT_latitude",value:0});             // placeholder for future use
*/


        var customDataPunchControl = [];
            customDataPunchControl.push({name:"Id",value:ident});                      // Id = Identifier = link between Punch data and PunchControl data
            // TimeTrex Data
            customDataPunchControl.push({name:"TT_punch_control_id",value:ident});     // punch_control_id (we use the Task Identifier)
            customDataPunchControl.push({name:"TT_user_id",value:entityId});              // user_id (we use the Employee Entity Id)
            customDataPunchControl.push({name:"TT_user_name",value:entityName});              // user_id (we use the Employee Entity Name)
            customDataPunchControl.push({name:"TT_date_stamp",value:TT_datestamp});              // the date ONLY, no time // 2016-07-28
            customDataPunchControl.push({name:"TT_total_time",value:taskDuration});           // difference of (updated_date - created_date) = seconds rounded to minute  // (12999)     rounded      13020
            customDataPunchControl.push({name:"TT_actual_total_time",value:taskDuration});    // difference of (updated_date - created_date) = seconds non-rounded        // 12999      (rounded      13020)
            customDataPunchControl.push({name:"TT_created_date",value:TT_timestampPunchControlCreated});         // UTC seconds Punch IN date  // 1469729856 (rounded 1469729880)
            customDataPunchControl.push({name:"TT_updated_date",value:TT_timestampPunchControlUpdated});         // UTC seconds Punch OUT date // 1469742855 (rounded 1469742840)
/*
            customDataPunchControl.push({name:"TT_deleted_date",value:0});         // UTC seconds placeholder for future use
            customDataPunchControl.push({name:"TT_pay_period_id",value:0});        // placeholder for future use
            customDataPunchControl.push({name:"TT_created_by",value:currentUser}); // placeholder for future use
            customDataPunchControl.push({name:"TT_updated_by",value:currentUser}); // placeholder for future use
            customDataPunchControl.push({name:"TT_deleted_by",value:""});          // placeholder for future use
            customDataPunchControl.push({name:"TT_deleted",value:0});              // placeholder for future use
            customDataPunchControl.push({name:"TT_branch_id",value:0});            // placeholder for future use
            customDataPunchControl.push({name:"TT_department_id",value:0});        // placeholder for future use
            customDataPunchControl.push({name:"TT_job_id",value:0});               // placeholder for future use
            customDataPunchControl.push({name:"TT_job_item_id",value:0});          // placeholder for future use
            customDataPunchControl.push({name:"TT_quantity",value:0});             // placeholder for future use
            customDataPunchControl.push({name:"TT_bad_quantity",value:0});         // placeholder for future use
*/



        if (punchStateCurrent != cmdButton.replace(/TC_Clock_/g,'Punched ')) {

            if (punchDataFOUND) {
                
                spu.consoleLog('Completing Punch Task ('+TC_PunchTaskType+') ['+punchStateCurrent+']: ' + taskIdents);
                // when we UPDATE a Punch Task, we use Original Dates
                if (punchStateCurrent=='Punched Out') {
                    customDataPunch.push({name:"Id",value:taskIdent});                      // Id = Identifier = link between Punch data and PunchControl data
                    // TimeTrex Data
                    customDataPunch.push({name:"TT_punch_control_id",value:taskIdent});     // punch_control_id (we use the Task Identifier)
                } else {
                    customDataPunch.push({name:"Id",value:ident});                      // Id = Identifier = link between Punch data and PunchControl data
                    // TimeTrex Data
                    customDataPunch.push({name:"TT_punch_control_id",value:ident});     // punch_control_id (we use the Task Identifier)
                }
                customDataPunch.push({name:"TT_original_time_stamp",value:TT_datetimePunchCreated});  // date/time rounded to minute with Timezone                           // 2016-07-28T12:18:00-06:00
                customDataPunch.push({name:"TT_time_stamp",value:TT_datetimePunchCreated});           // date/time rounded to minute with Timezone                           // 2016-07-28T12:18:00-06:00
                customDataPunch.push({name:"TT_actual_time_stamp",value:TT_datetimePunchCreated});    // date/time non-rounded including seconds with Timezone               // 2016-07-28T12:17:36-06:00
                customDataPunch.push({name:"TT_created_date",value:TT_timestampPunchCreated});         // UTC seconds Punch IN/OUT date                                       // 1469729856
                customDataPunch.push({name:"TT_updated_date",value:TT_timestampPunchCreated});         // UTC seconds Punch IN/OUT date (same as created_date unless modified // 1469729856
                updateTasksByIdentifier(punchTaskTypes, taskIdents, true, punchStateCurrent+' Complete', customDataPunch, '', true, function completeP() {
                    // remove TT Date data from Array
                    for (var p=0; p<5; p++) {
                        customDataPunch.pop();
                    }
                    // remove identifiers from Array
                    for (var p=0; p<2; p++) {
                        customDataPunch.pop();
                    }


                    // Complete Control Task only if Punching OUT (completeControlTask==true)
                    if (completeControlTask) {
                        spu.consoleLog('Completing Punch Control Task ('+TC_PunchControlTaskType+') ['+punchStateCurrent+']: ' + taskIdents);
                    } else {
                        spu.consoleLog('Skipping Punch Control Task completion ('+TC_PunchControlTaskType+') ['+punchStateCurrent+']: ' + taskIdents);
                    }
                    updateTasksByIdentifier(punchControlTaskTypes, taskIdents, true, 'Punch Cycle Complete', customDataPunchControl, punchControlContent+' ['+taskStartUTC+'~'+utcSeconds+']', completeControlTask, function completeC() {


                        spu.consoleLog('Creating Punch Task ('+TC_PunchTaskType+') ['+punchStateNew+']: ' + ident);
                        // when we CREATE a Punch Task, we use NOW Dates
                        customDataPunch.push({name:"Id",value:ident});                      // Id = Identifier = link between Punch data and PunchControl data
                        // TimeTrex Data
                        customDataPunch.push({name:"TT_punch_control_id",value:ident});     // punch_control_id (we use the Task Identifier)

                        customDataPunch.push({name:"TT_original_time_stamp",value:TT_datetimePunchUpdated});  // date/time rounded to minute with Timezone                           // 2016-07-28T12:18:00-06:00
                        customDataPunch.push({name:"TT_time_stamp",value:TT_datetimePunchUpdated});           // date/time rounded to minute with Timezone                           // 2016-07-28T12:18:00-06:00
                        customDataPunch.push({name:"TT_actual_time_stamp",value:TT_datetimePunchUpdated});    // date/time non-rounded including seconds with Timezone               // 2016-07-28T12:17:36-06:00
                        customDataPunch.push({name:"TT_created_date",value:TT_timestampPunchUpdated});         // UTC seconds Punch IN/OUT date                                       // 1469729856
                        customDataPunch.push({name:"TT_updated_date",value:TT_timestampPunchUpdated});         // UTC seconds Punch IN/OUT date (same as created_date unless modified // 1469729856
                        addTasks(punchTaskTypes, entityNames, punchContent, false, currentUser, customDataPunch, punchStateNew, true, function addP() {
                            // remove TT Date data from Array
                            for (var p=0; p<5; p++) {
                                customDataPunch.pop();
                            }


                            // Add Control Task only if Punching IN (addControlTask==true)
                            if (addControlTask) {
                                spu.consoleLog('Creating Punch Control Task ('+TC_PunchControlTaskType+') ['+punchStateNew+']: ' + ident);
                            } else {
                                spu.consoleLog('Skipping Punch Control Task creation ('+TC_PunchControlTaskType+') ['+punchStateNew+']: ' + ident);
                            }
                            addTasks(punchControlTaskTypes, entityNames, punchControlContent, false, currentUser, customDataPunchControl, 'Punch Cycle', addControlTask, function addC() {

                                spu.consoleLog('Updating Entity Punch State: ' + punchStateCurrent + ' > ' + punchStateNew);
                                updateEntityState('Employees',entityName,'TC Punch Status',punchStateNew,function es(){
                                    var msg = '{"eventName":"TIMECLOCK_REFRESH","terminal":"'+currentTerminal+'","userName":"'+currentUser+'","sid":"'+sessionId+'"}';
                                    broadcastMessage(msg);
                                    if (callback) {
                                        callback();
                                    }
                                });
                           });
                        });
                        
                    });
                });

            } else {

                // if we have no Punch data, we skip Task Completion.  This should only ever occur ONCE per Entity, then they will have Punch Data.
                
                spu.consoleLog('NO PUNCH DATA FOUND.  Creating initial Punch Tasks...');

                punchStateCurrent = 'Punched Out';
                punchStateNew = 'Punched In';
                addControlTask = true;

                        spu.consoleLog('Creating Punch Task ('+TC_PunchTaskType+') ['+punchStateNew+']: ' + ident);
                        // when we CREATE a Punch Task, we use NOW Dates
                        if (punchStateCurrent=='Punched Out') {
                            customDataPunch.push({name:"Id",value:taskIdent});                      // Id = Identifier = link between Punch data and PunchControl data
                            // TimeTrex Data
                            customDataPunch.push({name:"TT_punch_control_id",value:taskIdent});     // punch_control_id (we use the Task Identifier)
                        } else {
                            customDataPunch.push({name:"Id",value:ident});                      // Id = Identifier = link between Punch data and PunchControl data
                            // TimeTrex Data
                            customDataPunch.push({name:"TT_punch_control_id",value:ident});     // punch_control_id (we use the Task Identifier)
                        }
                        customDataPunch.push({name:"TT_original_time_stamp",value:TT_datetimePunchUpdated});  // date/time rounded to minute with Timezone                           // 2016-07-28T12:18:00-06:00
                        customDataPunch.push({name:"TT_time_stamp",value:TT_datetimePunchUpdated});           // date/time rounded to minute with Timezone                           // 2016-07-28T12:18:00-06:00
                        customDataPunch.push({name:"TT_actual_time_stamp",value:TT_datetimePunchUpdated});    // date/time non-rounded including seconds with Timezone               // 2016-07-28T12:17:36-06:00
                        customDataPunch.push({name:"TT_created_date",value:TT_timestampPunchUpdated});         // UTC seconds Punch IN/OUT date                                       // 1469729856
                        customDataPunch.push({name:"TT_updated_date",value:TT_timestampPunchUpdated});         // UTC seconds Punch IN/OUT date (same as created_date unless modified // 1469729856
                        addTasks(punchTaskTypes, entityNames, punchContent, false, currentUser, customDataPunch, punchStateNew, true, function addP() {

                            if (addControlTask) {
                                spu.consoleLog('Creating Punch Control Task ('+TC_PunchControlTaskType+') ['+punchStateNew+']: ' + ident);
                            } else {
                                spu.consoleLog('Skipping Punch Control Task creation ('+TC_PunchControlTaskType+') ['+punchStateNew+']: ' + ident);
                            }
                            addTasks(punchControlTaskTypes, entityNames, punchControlContent, false, currentUser, customDataPunchControl, 'Punch Cycle', addControlTask, function addC() {

                                spu.consoleLog('Updating Entity Punch State: ' + punchStateCurrent + ' > ' + punchStateNew);
                                updateEntityState('Employees',entityName,'TC Punch Status',punchStateNew,function es(){
                                    var msg = '{"eventName":"TIMECLOCK_REFRESH","terminal":"'+currentTerminal+'","userName":"'+currentUser+'","sid":"'+sessionId+'"}';
                                    broadcastMessage(msg);
                                    if (callback) {
                                        callback();
                                    }
                                });

                                
                           });
                        });

            }
            
        } else {
            spu.consoleLog('Punch State has not changed ('+entityName+'):' + punchStateCurrent);
            $('#TC_EntityCommands').show();
//            if (callback) {
//                callback();
//            }
        }
        
    }
//    if (callback) {
//        callback(entityButtonId);
//    }
}
