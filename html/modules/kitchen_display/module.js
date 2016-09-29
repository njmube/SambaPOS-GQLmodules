////////////////////////////////
//
// nav_kitchen_display
//
////////////////////////////////
function init_nav() {
    // do some stuff
}
spu.consoleLog('Initializing '+module.replace(/_/,' ').toUpperCase()+' ...');

$('#KD_Food').on('click', '.KD_TaskCard_Food', function(){
    var selectedCardList = '';
    var cardNumber = this.id; // KD_Task_1, KD_Task_2, ...
    cardNumber = cardNumber.replace(/KD_Task_/,'');
    if (isNumeric(cardNumber) && document.getElementById('KD_Task_'+cardNumber)) {
        var cardElem = document.getElementById('KD_Task_'+cardNumber);

        var taskSelected = cardElem.getAttribute('isSelected');
        if (taskSelected=='1') {
            cardElem.style.backgroundColor = '#111133';
            cardElem.setAttribute('isSelected','0');
        } else if (taskSelected=='0') {
            cardElem.style.backgroundColor = '#223322';
            cardElem.setAttribute('isSelected','1');
        }
        selectedTasks = [];
        selectedTaskIDs = [];
        selectedTaskIdents = [];
        for (var t=1; t<=taskCount; t++) {
            if (document.getElementById('KD_Task_'+t)) {
                var s = document.getElementById('KD_Task_'+t).getAttribute('isSelected');
                if (s=='1') {
                    var taskID = document.getElementById('KD_Task_'+t).getAttribute('taskID');
                    var taskIdent = document.getElementById('KD_Task_'+t).getAttribute('ident');
                    selectedTasks.push(t);
                    selectedTaskIDs.push(taskID);
                    selectedTaskIdents.push(taskIdent);
                    selectedCardList += t+':'+taskID+',';
                }
            }
        }
        spu.consoleLog('Selected Task Cards: '+selectedCardList.substr(0,selectedCardList.length-1));
    }
});

$('#BB_Buttons').on('click', '.BB_Button', function(){
    var bbButtonNumber = this.id; // BB_1, BB_2, ...
    spu.consoleLog('BB Button click ID: '+bbButtonNumber);
    bbButtonNumber = bbButtonNumber.replace(/BB_/,'');
    if (isNumeric(bbButtonNumber) && document.getElementById('KD_Task_'+bbButtonNumber)) {
        spu.consoleLog('BB Button click NUM: '+bbButtonNumber);
        var taskID = document.getElementById('KD_Task_'+bbButtonNumber).getAttribute('taskID');
        var taskIdent = document.getElementById('KD_Task_'+bbButtonNumber).getAttribute('ident');
        selectedTaskIDs = [];
        selectedTaskIDs.push(taskID);
        selectedTaskIdents = [];
        selectedTaskIdents.push(taskIdent);
        completeKDtasks(selectedTaskIDs,selectedTaskIdents,true,function cKDtsk(){
            refreshKDtaskList();
        });
    } else {
        if (bbButtonNumber=='Refresh') {
            refreshKDtaskList();
        }
        if (bbButtonNumber=='SelectAll') {
            var belem = document.getElementById('BB_'+bbButtonNumber);
            var selectToggle = belem.getAttribute('isSelected');
            selectToggle = (selectToggle=='1' ? '0' : '1');
            belem.setAttribute('isSelected', selectToggle);

            spu.consoleLog((selectToggle=='0' ? 'De-' : '')+'Selecting ALL KD Tasks...');
            selectedTasks = [];
            selectedTaskIDs = [];
            selectedTaskIdents = [];
            for (var t=1; t<=taskCount; t++) {
                var telem = document.getElementById('KD_Task_'+t);
                telem.setAttribute('isSelected',selectToggle);
                var taskID = telem.getAttribute('taskID');
                var taskIdent = telem.getAttribute('ident');
                var bgColor = (selectToggle=='1' ? '#223322' : '#111133');
                telem.style.backgroundColor = bgColor;
                if (selectToggle=='1') {
                    selectedTasks.push(t);
                    selectedTaskIDs.push(taskID);
                    selectedTaskIdents.push(taskIdent);
                }
            }
        }
        if (bbButtonNumber=='MarkCompleted') {
            if (selectedTaskIDs.length > 0) {
                completeKDtasks(selectedTaskIDs,selectedTaskIdents,true,function cKDtsk(){
                    refreshKDtaskList();
                });
            } else {
                spu.consoleLog('No Tasks Selected!');
            }
        }
    }
});
