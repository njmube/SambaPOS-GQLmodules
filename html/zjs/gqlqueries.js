// define Object for all GraphQL stuff
var gql = { };

gql.EXEC = function (query, callback) {
    spu.consoleLog('EXEC GQL:' +query);
    var data = JSON.stringify({ query: query });
    countTrafficBytes(data,'gql','sent');
    return jQuery.ajax({
    'type': 'POST',
    'url': GQLurl,
    'contentType': 'application/json',
    'data': data,
    'dataType': 'json',
//    'success': callback,

    'error': function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                spu.consoleLog('!!! AJAX ERROR !!! ['+jqXHR.status+'] Could not connect. Verify Network.');
            } else if (jqXHR.status == 404) {
                spu.consoleLog('!!! AJAX ERROR !!! ['+jqXHR.status+'] Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                spu.consoleLog('!!! AJAX ERROR !!! ['+jqXHR.status+'] Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else if (jqXHR.status == 400) {
                spu.consoleLog('!!! BAD REQUEST !!! ['+jqXHR.status+'] Bad Request [400].' + jqXHR.responseText);
                showErrorMessage('!!! BAD REQUEST !!! ['+jqXHR.status+'] Bad Request [400].' + "\r\n\r\n" + jqXHR.responseText);
            } else {
                spu.consoleLog('Uncaught Error: ['+jqXHR.status+']' + jqXHR.responseText);
                showErrorMessage('Uncaught Error: ['+jqXHR.status+']' + "\r\n\r\n" + jqXHR.responseText);
            }
        }
    })
            .done(
            function(response){
                var payload = JSON.stringify(response.data);
                countTrafficBytes(payload,'gql','rcvd');
            }).then(callback);
};

gql.getLocalSetting = function(settingName) {
    return '{setting: getLocalSetting(name:"'+settingName+'"){name,value}}';
};
gql.getGlobalSetting = function(settingName) {
    return '{setting: getGlobalSetting(name:"'+settingName+'"){name,value}}';
};
gql.postBroadcastMessage = function(msg, callback) {
    // JSON TEST
    //msg = '{"orders":[{"orderID":"124","orderTime":"12:54"},{"orderID":"125","orderTime":"12:55"}]}';
    msg = msg.replace(/"/g,'\\"');
    return 'mutation m {postBroadcastMessage(message:"'+msg+'"){message}}';
};
gql.getCustomReport = function(reportName,user,dateFilter,startDate,endDate,parameters) {
    var q = '{report: getCustomReport(';
        q+= 'name:"'+reportName+'"';
        q+= (user ?  ',user:"'+user+'"' : '');
        q+= (dateFilter ? ',date:"'+dateFilter+'"' : '');
        q+= (startDate ? ',startDate:"'+startDate+'"' : '');
        q+= (endDate ? ',endDate:"'+endDate+'"' : '');
        q+= (parameters ? ',parameters:['+parameters+']' : '');
        q+= ')';
        q+= '{name,header,startDate,endDate,tables{name,maxHeight,columns{header},rows{cells}}}';
        q+= '}';
    return q;
};
gql.getTickets = function(startDate,endDate,isClosed,orderBy,take,skip) {
    startDate = (startDate!='' ? startDate : moment().format("YYYY-MM-DD"));
    endDate = (endDate!='' ? endDate : moment().add(1,'days').format("YYYY-MM-DD"));
    var q = '{tickets: getTickets(';
        q+= (startDate!='' ? 'start:"'+startDate+'"' : '');
        q+= (endDate!=''   ? ',end:"'+endDate+'"' : '');
        q+= (isClosed!=''  ? ',isClosed:'+isClosed : '');
        q+= (orderBy!=''   ? ',orderBy:'+orderBy : '');
        q+= (take!=''      ? ',take:'+take : '');
        q+= (skip!=''      ? ',skip:'+skip : '');
        q+= ')';
        q+= '{id,uid,number,date,type,totalAmount,remainingAmount,states{stateName,state},tags{tagName,tag},entities{name,type,id,typeId},orders{id,uid,quantity,name,productId,portion,price,priceTag,calculatePrice,decreaseInventory,increaseInventory,tags{tagName,tag,price,quantity,rate,userId},states{stateName,state,stateValue}}}';
        q+= '}';
    return q;
};
gql.addTasks = function(taskTypes,taskNames,content,isCompleted,userName,customData,state) {
    var q = '';
        q+= 'mutation m{';
        for (var t=0; t<taskNames.length; t++) {
            var taskType = taskTypes[t];
            var taskName = taskNames[t];
            q += 'm'+t+': ';
            q+= 'addTask(';
            q+= 'task:{';
            q+= 'taskType:"'+taskType+'"';
            q+= ',name:"'+taskName+'"';
            q+= ',content:"'+content+'"';
            q+= ',isCompleted:'+isCompleted;
            q+= ',userName:"'+userName+'"';
            q+= (state ? ',state:"'+state+'"' : '');
            q+= ',customData:[';
            if (customData) {
                for (var d=0; d<customData.length; d++) {
                    q+= (d==0 ? '' : ',');
                    q+= '{name:"'+customData[d].name+'",value:"'+customData[d].value+'"}';
                }
            }
            q+= ']';
            q+= '}';
            q+= ')';
            q+= '{id,name,identifier,content,isCompleted,userName,customData{name,value}}';
            q += ((t+1) != taskNames.length ? ', ' : '');
        }
        q+= '}';
    return q;
};
//mutation {addTask(taskType:"TC Punch Task",name:"Punched In",content:"content",isCompleted:false,userName:"Q",customData:[{name:"entityType",value:"Employees"},{name:"entityId",value:""},{name:"entityName",value:"Jenery"},{name:"stateName",value:"TC Punch Status"},{name:"state",value:"Punched In"},{name:"startState",value:"Punched Out"},{name:"endState",value:"Punched In"},{name:"holidayFlag",value:"0"},{name:"Id",value:"2016-07-20T23:55:54.842Z--Punched In-Jenery-undefined"}]){id,name,identifier,content,isCompleted,userName,customData{name,value}}}
gql.getTasks = function(taskType, completedFilter, nameLike, contentLike, fieldFilter, stateFilter, callback) {
    var q = '';
        q+= '{tasks:getTasks(';
        q+= 'taskType:"'+taskType+'"';
        q+= (completedFilter ? ',isCompleted:'+completedFilter : '');
        q+= (nameLike ? ',nameLike:"'+nameLike+'"' : '');
        q+= (contentLike ? ',contentLike:"'+contentLike+'"' : '');
        q+= (stateFilter ? ',state:"'+stateFilter+'"' : '');
        q+= (fieldFilter ? ',customFields:[{name:"'+fieldFilter.name+'",value:"'+fieldFilter.value+'"}]' : '');
        q+= ')';
        q+= '{id,isCompleted,identifier,name,state,content,contentText,customData{name,value},stateLog{state,start,end},stateDuration{state,duration},startDate,endDate,userName}';
        q+= '}';
    return q;
    //return '{tasks:getTasks(taskType:"'+taskTypeName+'",isCompleted:false){id,isCompleted,identifier,name,content,contentText,customData{name,value},startDate,endDate,userName}}';
};
gql.getTasks2 = function(taskType, startFilter, endFilter, completedFilter, nameLike, contentLike, fieldFilter, stateFilter, callback) {
    var q = '';
        q+= '{tasks:getTasks(';
        q+= 'taskType:"'+taskType+'"';
        q+= (startFilter ? ',startDate:"'+startFilter+'"' : '');
        q+= (endFilter ? ',endDate:"'+endFilter+'"' : '');
        q+= (completedFilter ? ',isCompleted:'+completedFilter : '');
        q+= (nameLike ? ',nameLike:"'+nameLike+'"' : '');
        q+= (contentLike ? ',contentLike:"'+contentLike+'"' : '');
        q+= (stateFilter ? ',state:"'+stateFilter+'"' : '');
        q+= (fieldFilter ? ',customFields:[{name:"'+fieldFilter.name+'",value:"'+fieldFilter.value+'"}]' : '');
        q+= ')';
        q+= '{id,isCompleted,identifier,name,state,content,contentText,customData{name,value},stateLog{state,start,end},stateDuration{state,duration},startDate,endDate,userName}';
        q+= '}';
    return q;
    //return '{tasks:getTasks(taskType:"'+taskTypeName+'",isCompleted:false){id,isCompleted,identifier,name,content,contentText,customData{name,value},startDate,endDate,userName}}';
};
gql.updateTask = function(taskTypes, taskIDs, taskIdents, isCompleted, state, customData, content, name){
    var idList='';
    updatedTasks = [];
    var q = 'mutation m {';
    for (var t=0; t<taskIDs.length; t++) {
        var taskID = taskIDs[t];
        var taskIdent = taskIdents[t];
        var taskType = taskTypes[t];
        q += 'm'+t+': updateTask(';
        q += 'id:'+taskID;
        q += ', task:{';
        q += 'taskType:"'+taskType+'"';
        q += ', isCompleted:'+isCompleted;
        q += (name ? ', name:"'+name+'"' : '');
        q += (state ? ', state:"'+state+'"' : '');
        q += (content ? ', content:"'+content+'"' : '');
        q += ',customData:[';
        if (customData) {
            for (var d=0; d<customData.length; d++) {
                q+= (d==0 ? '' : ',');
                q+= '{name:"'+customData[d].name+'",value:"'+customData[d].value+'"}';
            }
        }
        q += ']';
        q += (taskIdent!='' ? ', identifier:"'+taskIdent+'"' : '');
        q += '}';
        q += ')';
        q+= '{id,isCompleted,identifier,name,state,content,contentText,customData{name,value},stateLog{state,start,end},stateDuration{state,duration},startDate,endDate,userName}';
        //q += '}';
        q += ((t+1) != taskIDs.length ? ', ' : '');

        idList += taskID + ((t+1) != taskIDs.length ? ', ' : '');
        
        var pushVal = { }; // new Object()
        pushVal["id"] = taskID;
        pushVal["completed"] = (isCompleted ? '1' : '0');
        pushVal["identifier"] = taskIdent;
        updatedTasks.push(JSON.stringify(pushVal));
    }
    q += '}';
    spu.consoleLog('Updating Tasks by id: '+idList);
    return q; //'mutation m {updateTask(id:'+taskID+',task:{taskType:"BB Bump Bar Task",isCompleted:true}){id}}';
};
gql.updateTaskByIdentifier = function(taskTypes, taskIdents, isCompleted, state, customData, content, name){
    var idList='';
    var q = 'mutation m {';
    for (var t=0; t<taskIdents.length; t++) {
        var taskIdent = taskIdents[t];
        var taskType = taskTypes[t];
        q += 'm'+t+': updateTask(';
        q += 'identifier:"'+taskIdent+'"';
        q += ', taskType:"'+taskType+'"';
        q += ', task:{';
        q += 'taskType:"'+taskType+'"';
        q += ', isCompleted:'+isCompleted;
        q += (name ? ', name:"'+name+'"' : '');
        q += (state ? ', state:"'+state+'"' : '');
        q += (content ? ', content:"'+content+'"' : '');
        q+= ',customData:[';
        if (customData) {
            for (var d=0; d<customData.length; d++) {
                q+= (d==0 ? '' : ',');
                q+= '{name:"'+customData[d].name+'",value:"'+customData[d].value+'"}';
            }
        }
        q+= ']';
        q += '}';
        q += ')';
        q+= '{id,isCompleted,identifier,name,state,content,contentText,customData{name,value},stateLog{state,start,end},stateDuration{state,duration},startDate,endDate,userName}';
        //q += '}';
        q += ((t+1) != taskIdents.length ? ', ' : '');

        idList += taskIdent + ((t+1) != taskIdents.length ? ', ' : '');
        
        var pushVal = { }; // new Object()
        //pushVal["id"] = taskID;
        pushVal["completed"] = (isCompleted ? '1' : '0');
        pushVal["identifier"] = taskIdent;
        updatedTasks.push(JSON.stringify(pushVal));
    }
    q += '}';
    spu.consoleLog('Updating Tasks by identifier: '+idList);
    return q; //'mutation m {updateTask(id:'+taskID+',task:{taskType:"BB Bump Bar Task",isCompleted:true}){id}}';
};
gql.updateTaskStateByIdentifier = function(taskTypes, taskIdents, taskType, state, stateDate){
    var idList='';
    var stateDate = (stateDate ? stateDate : formatDateTime(new Date(),true,true));
    var q = 'mutation m {';
    for (var t=0; t<taskIdents.length; t++) {
        var taskIdent = taskIdents[t];
        var taskType = taskTypes[t];
        q += 'm'+t+': updateTaskState(';
        q += 'identifier:"'+taskIdent+'"';
        q += ', taskType:"'+taskType+'"';
        q += (state ? ', state:"'+state+'"' : '');
        q += (stateDate ? ', date:"'+stateDate+'"' : '');
        q += ')';
        q += '{id, identifier, name,state,stateLog{state,start,end}}';
        q += ((t+1) != taskIdents.length ? ', ' : '');

        idList += taskIdent + ((t+1) != taskIdents.length ? ', ' : '');
    }
    q += '}';
    spu.consoleLog('Updating Task States ('+state+':'+stateDate+'):'+idList);
    return q; //'mutation m {updateTask(id:'+taskID+',task:{taskType:"BB Bump Bar Task",isCompleted:true}){id}}';
};
gql.deleteTask = function(taskIDs){
    var idList='';
    var q = 'mutation m {';
    for (var t=0; t<taskIDs.length; t++) {
        var taskID = taskIDs[t];
        q += 'm'+t+': deleteTask(';
        q += 'id:'+taskID;
        q += ')';
        q+= '{id,isCompleted,identifier,name,state,content,contentText,customData{name,value},stateLog{state,start,end},stateDuration{state,duration},startDate,endDate,userName}';
        q += ((t+1) != taskIDs.length ? ', ' : '');

        idList += taskID + ((t+1) != taskIDs.length ? ', ' : '');
    }
    q += '}';
    spu.consoleLog('Deleting Tasks: '+idList);
    return q; //'mutation m {updateTask(id:'+taskID+',task:{taskType:"BB Bump Bar Task",isCompleted:true}){id}}';
};

gql.postTaskRefreshMessage = function(taskIDs) {
    var idList='';
    var q = 'mutation m {';
    for (var t=0; t<taskIDs.length; t++) {
        var taskID = taskIDs[t];
        q += 'm'+t+': postTaskRefreshMessage(id:'+taskID+'){id}';
        q += ((t+1) != taskIDs.length ? ', ' : '');
        idList += taskID + ((t+1) != taskIDs.length ? ', ' : '');
    }
    q += '}';
    spu.consoleLog('Posting Rask Refresh Message for Tasks: '+idList);
    return q; //'mutation m {postTaskRefreshMessage(id:'+taskID+'){id}}';
};

gql.handleError = function(msg, errs) {
    spu.consoleLog("!!! GQL ERROR: "+msg + ' !!! '+errs);
};

gql.getEntities = function(entityType, search, stateFilter){
    var q = '';
        q+= '{entities:getEntities(';
        q+= 'type:"'+entityType+'"';
    if (search) {
        q+= ', search:"'+search+'"';
    }
    if (stateFilter) {
        q+= ', state:"'+stateFilter+'"';
    }
        q+= ')';
        q+= '{';
        q+= 'type,id,name,states{stateName,state},customData{name,value}';
        q+= '}';
        q+= '}';
    return q;
//    return '{entities:getEntities(type:"'+entityType+'"){type,name,states{stateName,state},customData{name,value}}}';
};




// PMPOS
    
gql.getMenuCategories = function(){
    return '{menuCategories: getMenuCategories(menu:"Menu"){id,name,header,color,image,isFastMenu,menuId,menuItems{id,name,header,caption,image,color,categoryId,portion,productId,product{id,name,groupCode,barcode,price,portions{id,name,productId,price}}}}}';
};
gql.getMenuCategoriesMenuItems = function(){
    return '{menuCategories: getMenuCategories(menu:"Menu"){id,name,header,color,image,isFastMenu,menuId,menuItems{id,name,header,caption,image,color,categoryId,portion,productId,product{id,name,groupCode,barcode,price,portions{id,name,productId,price}}}}}';
};

gql.getMenuItems = function(category){
    return '{items:getMenuItems(menu:"Menu",category:"'+category+'"){id,name,header,caption,color,portion,product{groupCode,name,price,portions{name,price}}}}';
};

gql.getOrderTagGroups = function(menuItem){
    return '{orderTagGroups:getOrderTagGroups(menuItem:"'+menuItem+'",portion:"",ticketType:"Ticket",terminal:"Server",department:"Restaurant",user:"Q"){id,name,color,min,max,tags{id,name,color,description,header,price,rate,filter}}}';
};

gql.executePrintJob = function(printJobName, ticketId, orderStateFilters, nextOrderStates, nextTicketStates, copies, userName){
    var pjName = (printJobName!='' ? printJobName : 'Print Bill');
    var tid = (ticketId ? ticketId : 0);
    var cpy = (copies ? copies:  1);
    var usr = (userName ? userName : currentUser);

    if (orderStateFilters) {
    var osFilters = orderStateFilters.map(function (osf) {
        return '{stateName:"' + osf.stateName + '", state:"' + osf.state + '"}';
    });
    }
    if (nextOrderStates) {
    var osNext = nextOrderStates.map(function (nos) {
        return '{stateName:"' + nos.stateName + '", currentState:"' + nos.currentState + '", state:"' + nos.state + '"}';
    });
    }
    if (nextTicketStates) {
    var tsNext = nextTicketStates.map(function (nts) {
        return '{stateName:"' + nts.stateName + '", state:"' + nts.state + '"}';
    });
    }
    
    //return 'mutation m {executePrintJob(name:"'+pjName+'",ticketId:'+tid+',copies:'+copies+',orderStateFilters:{stateName:"sName",state:"st"},nextOrderStates:{stateName:"nsName",currentState:"csName",state:"nst"},nextTicketStates:{stateName:"sName",state:"st"},userName:"'+usr+'") {name}}';
    var xpj = 'mutation m {executePrintJob(name:"'+pjName+'",ticketId:'+tid+',copies:'+cpy+',userName:"'+usr+'"';
        xpj+= (osFilters ? ',orderStateFilters:[' + osFilters.join() + ']' : '');
        xpj+= (osNext    ? ',nextOrderStates:[' + osNext.join() + ']' : '');
        xpj+= (tsNext    ? ',nextTicketStates:[' + tsNext.join() + ']' : '');
        xpj+= ') {name}}';
    return xpj;
};

gql.addTicket = function(orders,tableName,customerName){

    var orderLines = orders.map(function (order) {
        return '{name:"' + order.name + '",states:[{stateName:"Status",state:"Submitted"},{stateName:"KDStatus",state:"FNotPrinted"}]}';
    });
    
    var entityPart = (tableName && customerName
                        ? 'entities:[{entityType:"Tables",name:"'+tableName+'"},{entityType:"Customers",name:"'+customerName+'"}]'
                        : (tableName 
                            ?  'entities:[{entityType:"Tables",name:"'+tableName+'"}]'
                            : (customerName 
                                ?  'entities:[{entityType:"Customers",name:"'+customerName+'"}]' 
                                : '')
                            )
                        );
    
    var q = '';
    q += 'mutation m{addTicket(';
    q += '        ticket:{ticketType:"Ticket"';
    q += '            , department:"Restaurant"';
    q += '            , user:"'+currentUser+'"';
    //q += '            , terminal:"'+currentTerminal+'"';
    q += '            , terminal:"Server"';
    q += '            , '+entityPart;
    q += '            , states:[{stateName:"Status",state:"Unpaid"}]';
    q += '            , orders:['+orderLines.join()+'}]';
    q += '        }){id}}';
    return q;
};

gql.updateEntityState = function(entityType,entityName,stateName,state) {
    var q = '';
    q += 'mutation m{updateEntityState(';
    q += 'entityTypeName:"'+entityType+'"';
    q += ', entityName:"'+entityName+'"';
    q += ', stateName:"'+stateName+'"';
    q += ', state:"'+state+'"';
    q += ')';
    q += '{id,name';
    q += ',states{stateName,state}';
    //q += ',type';
    //q += ',customData';
    q += '}';
    q += '}';
    return q;
};

gql.postTicketRefreshMessage = function(ticketId, callback) {
    return 'mutation m{postTicketRefreshMessage(id:'+ticketId+'){id}}';
};
