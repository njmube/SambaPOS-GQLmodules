////////////////////////////////
//
// nav_timeclock_policies
//
////////////////////////////////
function init_nav() {
    // do some stuff
}
spu.consoleLog('Initializing '+module.replace(/_/,' ').toUpperCase()+' ...');

//updateTaskMessage('Loading...');

$('#TSK_Tasks').on('click', '.TSK_Task', function(){
    var btn = this.id; // Employees_Jenery, Employees_Ovania, ...
    var btnName = btn.replace(/Tasks_/g,'');
    var taskId = btn.replace(/Tasks_/g,'');
    spu.consoleLog('TSK Task Clicked:'+btn+' ('+btnName+')');
    
    for (var e=0; e<TSK_Tasks.length; e++) {
        var tsk = 'Tasks_' + TSK_Tasks[e].id;

        if (document.getElementById(tsk)) {
            document.getElementById(tsk).setAttribute('isSelected','0');
            document.getElementById(tsk).style.borderColor = '';
        }
    }
    
    TSK_selectedTasks = [];
    
    if (document.getElementById(btn)) {
        var isSel = (document.getElementById(btn).getAttribute('isSelected') == '1' ? '0' : '1');
        document.getElementById(btn).setAttribute('isSelected',isSel);
        if (isSel == 1) {
            document.getElementById(btn).style.borderColor = '#FFBB00';
            for (var e=0; e<TSK_Tasks.length; e++) {
                if (taskId == TSK_Tasks[e].id) {
                    TSK_selectedTasks.push(taskId);
                    break;
                }
            }
            spu.consoleLog('Selected TSK Task: '+btnName);
            
            // displayTaskDetails(taskId)
            displayTaskDetails(btnName);
            updateTaskMessage('Click Save to apply changes.');
            //jumpTop();

            
        } else {
            document.getElementById(btn).style.borderColor = '';
            spu.consoleLog('DE-Selected TSK Task: '+btnName);
            $('#TSK_Detail').empty();
        }
    }

});

$('#TSK_Commands').on('click', '.TSK_TaskCommand', function(){
    var cmdButton = this.id; // Employees_Jenery, Employees_Ovania, ...
    var cmdName = cmdButton.replace(/TSK_/g,'');
    spu.consoleLog('Task Command Clicked:'+cmdButton+' ('+cmdName+')');
    
    if (document.getElementById(cmdButton)) {
        var isSel = (document.getElementById(cmdButton).getAttribute('isSelected') == '1' ? '0' : '1');
        document.getElementById(cmdButton).setAttribute('isSelected',isSel);
        if (isSel == 1) {
            document.getElementById(cmdButton).style.borderColor = '#6666FF';
            spu.consoleLog('Selected Task Command: '+cmdButton);
        } else {
            document.getElementById(cmdButton).style.borderColor = '';
            spu.consoleLog('DE-Selected Task Command: '+cmdButton);
        }
    }

    if (cmdName == 'Clone') {
        if (document.getElementById('taskName') && TSK_selectedTasks.length>0) {
            var taskTypes = [document.getElementById('TSK_TaskTypePicker').value];
            var taskIdents = [document.getElementById('taskIdent').value];
            var isCompleted = document.getElementById('taskCompleted').value.toString().toLowerCase();
                isCompleted = ((isCompleted=='1' || isCompleted=='true') ? 'true' : 'false');
            var name = document.getElementById('taskName').value + ' CLONE';
            var state = document.getElementById('taskState').value;
            var content = document.getElementById('taskContent').value;
            var customData = getTaskCustomDataInput();

            var taskNames = [name];
            var userName = currentUser;
            spu.consoleLog('Cloning Task...');
            updateTaskMessage('Cloning Task...');
            addTasks(taskTypes,taskNames,content,isCompleted,userName,customData,state, confirm, function refreshAfterAdd(response) {
                spu.consoleLog('Cloned Task, refreshing...');
                var selTask = response.data.m0.id;
                refreshTaskEditorDisplay('','', function reselTask() {
                    document.getElementById(('Tasks_'+selTask)).click();
                    updateTaskMessage('Task Cloned and Saved.');
                });

            });

        } else {
            spu.consoleLog('No Task to Clone.');
            updateTaskMessage('No Task to Clone.');
        }

    }

    if (cmdName == 'Save') {
        if (document.getElementById('taskName')) {
            var taskTypes = [document.getElementById('TSK_TaskTypePicker').value];
            var taskIdents = [document.getElementById('taskIdent').value];
            var isCompleted = document.getElementById('taskCompleted').value.toString().toLowerCase();
                isCompleted = ((isCompleted=='1' || isCompleted=='true') ? 'true' : 'false');
            var name = document.getElementById('taskName').value;
            var state = document.getElementById('taskState').value;
            var content = document.getElementById('taskContent').value;
            var customData = getTaskCustomDataInput();
            var confirm = true;

            if (TSK_selectedTasks.length>0) {
                var selTask = TSK_selectedTasks[0];
                var taskIDs = [selTask];
                spu.consoleLog('Updating Task...');
                updateTaskMessage('Updating Task...');
                //updateTasks(taskTypes, taskIDs, taskIdents, isCompleted, state, customData, content, confirm, callback)
                updateTasks(taskTypes, taskIDs, taskIdents, isCompleted, state, customData, content, name, confirm, function refreshAfterUpdate(response) {
                    spu.consoleLog('Updated Task, refreshing...');
                    // refreshTaskEditorDisplay(taskType,isCompleted,callback)
                    refreshTaskEditorDisplay('','', function reselTask() {
                        document.getElementById(('Tasks_'+selTask)).click();
                        updateTaskMessage('Task Updated.');
                    });
                });
            } else {
                var taskNames = [name];
                var userName = currentUser;
                spu.consoleLog('Adding Task...');
                updateTaskMessage('Adding Task...');
                addTasks(taskTypes,taskNames,content,isCompleted,userName,customData,state, confirm, function refreshAfterAdd(response) {
                    spu.consoleLog('Added Task, refreshing...');
                    var selTask = response.data.m0.id;
                    refreshTaskEditorDisplay('','', function reselTask() {
                        document.getElementById(('Tasks_'+selTask)).click();
                        updateTaskMessage('Task Added.');
                    });
                    
                });
            }
        } else {
            spu.consoleLog('No Task to Save.');
            updateTaskMessage('No Task to Save.');
        }
    }

    if (cmdName == 'New') {
        TSK_selectedTasks = [];
        for (var e=0; e<TSK_Tasks.length; e++) {
            var tsk = 'Tasks_' + TSK_Tasks[e].id;
            if (document.getElementById(tsk)) {
                document.getElementById(tsk).setAttribute('isSelected','0');
                document.getElementById(tsk).style.borderColor = '';
            }
        }
        displayTaskDetails(0);
        //clearTaskFields();
        updateTaskMessage('Click Save when done.');
    }

    if (cmdName == 'Delete') {
        if (document.getElementById('taskName') && TSK_selectedTasks.length>0) {
            var selTask = TSK_selectedTasks[0];
            var taskIDs = [selTask];
            updateTaskMessage('Deleting Task...');
            deleteTasks(taskIDs, confirm, function refreshAfterAdd(response) {
                spu.consoleLog('Deleted Task, refreshing...');
                refreshTaskEditorDisplay('','');
                TSK_selectedTasks = [];
                updateTaskMessage('Task Deleted.');
            });
        } else {
            spu.consoleLog('No Task to Delete.');
            updateTaskMessage('No Task to Delete.');
        }
    }
    document.getElementById(cmdButton).style.borderColor = '';
});

function displayTaskDetails(taskId) {
    var taskDefaults = getTaskTypeDefaultFields();

    if (taskId==0) {
        var task = taskDefaults;
    } else {
        var task = [];
        for (var t=0; t<TSK_Tasks.length; t++) {
            if (taskId == TSK_Tasks[t].id) {
                task.push(TSK_Tasks[t]);
                break;
            }
        }
        task = task[0];
    }
    
    var tskstuff = '';
    
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">id:</div>';
    tskstuff += '<div class="TSK_FieldValue" id="taskId">' + task.id + '</div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">ident:</div>';
    tskstuff += '<div class="TSK_FieldValue"><input id="taskIdent" type="text" class="TSK_InputText" value="' + task.identifier + '"></div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName" style="color:#FFBB00;">name:</div>';
    tskstuff += '<div class="TSK_FieldValue"><input id="taskName" type="text" class="TSK_InputText" style="color:#FFBB00;" value="' + task.name + '"></div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">complete:</div>';
    tskstuff += '<div class="TSK_FieldValue"><input id="taskCompleted" type="text" class="TSK_InputText" value="' + task.isCompleted + '"></div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">state:</div>';
    tskstuff += '<div class="TSK_FieldValue"><input id="taskState" type="text" class="TSK_InputText" value="' + task.state + '"></div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">user:</div>';
    tskstuff += '<div class="TSK_FieldValue"><input id="taskUsername" type="text" class="TSK_InputText" value="' + task.userName + '"></div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">start:</div>';
    tskstuff += '<div class="TSK_FieldValue"><input id="taskStart" type="text" class="TSK_InputText" value="' + task.startDate + '" onChange="calculateTaskDuration();"></div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">end:</div>';
    tskstuff += '<div class="TSK_FieldValue"><input id="taskEnd" type="text" class="TSK_InputText" value="' + task.endDate + '" onChange="calculateTaskDuration();"></div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">duration:</div>';
    tskstuff += '<div class="TSK_FieldValue"><input id="taskDuration" type="text" class="TSK_InputText" style="color:#FFFF00;" value="" disabled> <input type="button" value="reCalc"></div>';
    tskstuff += '</div>';
    tskstuff += '<div class="TSK_DataRow">';
    tskstuff += '<div class="TSK_FieldName">content:</div>';
    tskstuff += '<div class="TSK_FieldValue"><textarea id="taskContent" cols="50" rows="5" class="TSK_InputText">' + task.content + '</textarea></div>';
    tskstuff += '</div>';

    if (taskDefaults.customData.length>0) {
        tskstuff += '<div style="padding-top:5px;padding-bottom:5px;margin-bottom:5px;border-color:#DDDDDD;border-style:dotted;border-bottom-width:1px;">Custom Data</div>';
        
        for (var d=0; d<taskDefaults.customData.length; d++) {
            var cd = taskDefaults.customData[d];
            for (var st=0; st<task.customData.length; st++) {
                if (taskDefaults.customData[d].name == task.customData[st].name) {
                    var cd = task.customData[st];
                    break;
                }
            }
            //var cd = task.customData[d];
            var cdVal = (cd.value ? cd.value : '');
            tskstuff += '<div class="TSK_DataRow">';
            tskstuff += '<div class="TSK_FieldName">' + cd.name + ':</div>';
            tskstuff += '<div class="TSK_FieldValue"><input id="customData_' + cd.name + '" name="customData_' + cd.name + '" type="text" class="TSK_CustomDataInputText" value="' + cdVal + '"></div>';
            tskstuff += '</div>';

        }
    }
    
    tskstuff += '</div>';
    
    $('#TSK_Detail').empty();
    $('#TSK_Detail').append(tskstuff);
    calculateTaskDuration();
}

function clearTaskFields() {
    if (document.getElementById('taskName')) {
        spu.consoleLog('Clearing Task Fields...');
        var elements = document.getElementsByTagName("input");
        for (var ii=0; ii < elements.length; ii++) {
          if (elements[ii].type == "text") {
            elements[ii].value = "";
          }
        }
        var elements = document.getElementsByTagName("textarea");
        for (var ii=0; ii < elements.length; ii++) {
          if (elements[ii].type == "textarea") {
            elements[ii].innerHTML = "";
          }
        }
        document.getElementById('taskId').innerHTML = '(auto-generated)';
    } else {
        spu.consoleLog('Cannot clear Task Fields.');
    }
}

function getTaskCustomDataInput() {
    if (document.getElementById('taskName')) {
        spu.consoleLog('Getting Task Custom Data Fields...');
        var customData = [];
        
        var cdVal = document.getElementById('taskIdent').value;
        var cd = {name:"Id",value:cdVal}; // task identifier is part of Custom Data, as "Id"
        customData.push(cd);

        var elements = document.getElementsByClassName('TSK_CustomDataInputText');
        for (var ii=0; ii < elements.length; ii++) {
            var cdName = elements[ii].getAttribute('name').replace(/customData_/g,'');
            var cdVal = '';
            if (elements[ii].type == "text") {
                cdVal = elements[ii].value;
            }
            if (elements[ii].type == "textarea") {
              cdVal = elements[ii].innerHTML;
            }
            
            var cd = {name:cdName,value:cdVal};
            customData.push(cd);
        }
        return customData;
    } else {
        spu.consoleLog('Cannot get Task Custom Data Fields.');
    }
    
}

function getTaskTypeDefaultFields() {
    var taskType = $('#TSK_TaskTypePicker').val();
    var task = { };
    for (var tt=0; tt<taskTypes.length; tt++) {
        if (taskTypes[tt].name == taskType) {
            
            var now = moment().format("YYYY-MM-DD HH:mm:ss");;
            
            task.type = taskTypes[tt].name;
            task.id = 0;
            task.identifier = '';
            task.name = '';
            task.isCompleted = false;
            task.state = '';
            task.userName = currentUser;
            task.startDate = now;
            task.endDate = now;
            task.content = '';
            task.customData = taskTypes[tt].customFields;
            break;
        }
    }
    return task;
}

function calculateTaskDuration2() {
    var start = document.getElementById('taskStart').value;
    var end   = document.getElementById('taskEnd').value;
    
    var hours = datediff(start,end,'h').toFixed(2);
    var mins  = datediff(start,end,'m').toFixed(2);
    var secs  = datediff(start,end,'s').toFixed(2);

    var out = hours+' h / ' + mins+' m / ' + secs+' s';
    
    document.getElementById('taskDuration').value = out;
    return out;
}