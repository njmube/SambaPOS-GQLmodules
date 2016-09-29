////////////////////////////////
//
// nav_pos
//
////////////////////////////////
function init_nav() {
    // do some stuff
}
spu.consoleLog('Initializing '+module.replace(/_/,' ').toUpperCase()+' ...');

//initialize menu
updateCategories();
updateEntities("Tables");
updateEntities("Customers");
$('#orders').empty();
//orders = [];
updateTicketOrders();
selectedOrderCount = 0;
amcButtons('ticketCommands');
amcButtons('orderCommands');
amcButtons('ticketRow1');
amcButtons('ticketRow2');




$('#categories').on('click', '.cBtn', function(){
    var highlightID = this.id;
    selectedCategoryId = highlightID;
    var catName = this.getAttribute("name");
    var catBGcolor = this.getAttribute("bgColor");
    var catIsFastMenu = this.getAttribute("isFastMenu");
    
    spu.consoleLog('Category clicked:'+catName+', isFast:'+catIsFastMenu);
    
    if (catIsFastMenu!=1) {
        // get menuItems for the Category
        spu.consoleLog('Getting Menu Items for: '+catName);
        updateMenuItems(catName, catBGcolor, catIsFastMenu);

        // clear all Category Markers
        for (var c=0; c<categoryIDs.length; c++) {
            highlightID = 'cm_'+categoryIDs[c];
            if (document.getElementById(highlightID)) {
                //spu.consoleLog("hiding:"+highlightID);
                document.getElementById(highlightID).style.backgroundColor="#363636";
            }

        }
        // set selected Category Marker
        highlightID = this.id.replace(/c_/,"");
        highlightID = 'cm_'+highlightID;
        if (document.getElementById(highlightID)) {
            document.getElementById(highlightID).style.backgroundColor="#FFBB55";
        }
        
    }
});

$('#menuItems').on('click', '.mBtn', function(){
    var miId = this.id;
    var miName = this.getAttribute("name");
    var miQuantity = 1;
    var miPrice = this.getAttribute('price');
    var orderLineTotal = Number(miQuantity * miPrice).toFixed(2);
    var oStates = [];
    oStates.push({stateName:"Status",state:"New"});
    oStates.push({stateName:"KDStatus",state:"FNotPrinted"});
    orders.push({id:miId,name:miName,quantity:miQuantity,price:miPrice,orderStates:oStates});
    var addedOrderId = updateTicketOrders();
    spu.consoleLog('Order Added: '+miName + '('+addedOrderId+')');
    
    // load Order Tag screen
    gql.EXEC(gql.getOrderTagGroups(miName), function(response) {
        if (response.errors) {
            gql.handleError("getOrderTagGroups", response.errors);
        } else {
            showOrderTagGroups(response.data.orderTagGroups, addedOrderId);
        }
    });
    
});
$('#menuFast').on('click', '.mBtn', function(){
    var miName = this.getAttribute("name");
    var miQuantity = 1;
    var miPrice = this.getAttribute('price');
    var orderLineTotal = Number(miQuantity * miPrice).toFixed(2);
    var oStates = [];
    oStates.push({stateName:"Status",state:"New"});
    oStates.push({stateName:"KDStatus",state:"FNotPrinted"});
    orders.push({name:miName,quantity:miQuantity,price:miPrice,orderStates:oStates});
    updateTicketOrders();
    spu.consoleLog('Order Added: '+miName);
    
    // load Order Tag screen
    gql.EXEC(gql.getOrderTagGroups(miName), function(response) {
        if (response.errors) {
            gql.handleError("getOrderTagGroups", response.errors);
        } else {
            showOrderTagGroups(response.data.orderTagGroups);
        }
    });
    
});

$('#orders').on('click', '.orderContainer', function(){
    var oId      = this.id;
    var quantity = this.getAttribute("quantity");
    var product  = this.getAttribute("product");
    var price    = this.getAttribute("price");
    var orderLineTotal    = this.getAttribute("orderLineTotal");
    var isSelected = (this.getAttribute("isSelected")=='1' ? '0' : '1');
    this.setAttribute("isSelected", isSelected);
    isSelected = this.getAttribute("isSelected");
    if (isSelected=='1') {
        selectedOrderCount++;
        this.style.backgroundColor = '#224455';
    } else {
        selectedOrderCount--;
        this.style.backgroundColor = '';
    }
    spu.consoleLog('ORDERLINE:'+quantity+'x '+product+' '+price+' S:'+isSelected+' bgColor:'+this.style.backgroundColor);
    spu.consoleLog('selectedOrderCount:'+selectedOrderCount);

    if (selectedOrderCount>0) {
        $('#selectCustomers').hide();
        $('#selectTables').hide();
        $('#ticketCommands').hide();
        $('#orderCommands').show();
    } else {
        $('#orderCommands').hide();
        $('#selectCustomers').show();
        $('#selectTables').show();
        $('#ticketCommands').show();
    }
    
    //document.getElementById(oId).click();
    
});

$('#selectCustomers').on('click', function(){
    var entityType = this.getAttribute("entityType");
    if (document.getElementById(entityType)) {
        $('#'+entityType).show();
    }
});

$('#selectTables').on('click', function(){
    var entityType = this.getAttribute("entityType");
    if (document.getElementById(entityType)) {
        $('#'+entityType).show();
    }
});

$('#Customers').on('click', '.entityBtn', function(){
    // singular name of Entity Type
    var eType = 'Customer';
    var ticketEntity = ticketCustomer;
    var entityName  = this.getAttribute("name");
    var entityType  = this.getAttribute("entityType");
    var entityStatusState = this.getAttribute("statusState");
    spu.consoleLog("SELECTED:"+entityType+":"+entityName+":"+entityStatusState);
    if (document.getElementById(entityType)) {
        //document.getElementById(entityType).style.display = 'none';
        $('#'+entityType).hide();
    }
    if (document.getElementById('select'+entityType)) {
        if (entityName=='BACK') {
            // do nothing
        } else if (entityName=='NONE') {
            document.getElementById('select'+entityType).innerHTML = eType;
            if (document.getElementById(entityType+'_'+ticketEntity)) {
                document.getElementById(entityType+'_'+ticketEntity).style.backgroundColor = '';
            }
            ticketCustomer = '';
        } else {
            document.getElementById('select'+entityType).innerHTML = eType+"<br /><b style='color:#55FF55'>"+entityName+"</b>";
            if (ticketEntity != entityName) {
                if (document.getElementById(entityType+'_'+ticketEntity)) {
                    document.getElementById(entityType+'_'+ticketEntity).style.backgroundColor = '';
                }
            }
            ticketCustomer = entityName;
            this.style.backgroundColor = '#660066';
        }
    }
});

$('#Tables').on('click', '.entityBtn', function(){
    // singular name of Entity Type
    var eType = 'Table';
    var ticketEntity = ticketTable;
    var entityName  = this.getAttribute("name");
    var entityType  = this.getAttribute("entityType");
    var entityStatusState = this.getAttribute("statusState");
    spu.consoleLog("SELECTED:"+entityType+":"+entityName+":"+entityStatusState);
    if (document.getElementById(entityType)) {
        //document.getElementById(entityType).style.display = 'none';
        $('#'+entityType).hide();
    }
    if (document.getElementById('select'+entityType)) {
        if (entityName=='BACK') {
            // do nothing
        } else if (entityName=='NONE') {
            document.getElementById('select'+entityType).innerHTML = eType;
            if (document.getElementById(entityType+'_'+ticketEntity)) {
                document.getElementById(entityType+'_'+ticketEntity).style.backgroundColor = '';
            }
            ticketTable = '';
        } else {
            document.getElementById('select'+entityType).innerHTML = eType+"<br /><b style='color:#55FF55'>"+entityName+"</b>";
            if (ticketEntity != entityName) {
                if (document.getElementById(entityType+'_'+ticketEntity)) {
                    document.getElementById(entityType+'_'+ticketEntity).style.backgroundColor = '';
                }
            }
            ticketTable = entityName;
            this.style.backgroundColor = '#660066';
        }
    }
});

$('#amc_Close_Ticket').click( function () {
    spu.consoleLog('Closing Ticket...');
    if(!orders || orders.length == 0) {
        if (document.getElementById('infoMessage')) {
            document.getElementById('infoMessage').innerHTML = 'No Orders to Submit.';
            document.getElementById('infoMessage').style.display = 'flex';
            //$('#infoMessage').show();
        }
    } else if(!ticketTable && !ticketCustomer) {
        if (document.getElementById('infoMessage')) {
            document.getElementById('infoMessage').innerHTML = 'Select a Table and/or Customer.';
            //document.getElementById('infoMessage').style.display = 'flex';
            $('#infoMessage').show();
        }
    } else {
        createTicket(orders,ticketTable,ticketCustomer, function(tid) {
            var nextTicketStates = [];
                nextTicketStates.push({stateName:"Status",state:"Unpaid"});
            var orderStateFilters = [];
                orderStateFilters.push({stateName:"KDStatus",state:"FNotPrinted"});
            var nextOrderStates = [];
                nextOrderStates.push({stateName:"KDStatus",currentState:"FNotPrinted",state:"FPrinted"});
            spu.consoleLog('Printing Ticket:'+tid);
            // printJobName, ticketId, orderStateFilters, nextOrderStates, nextTicketStates, copies, userName
            //gql.EXEC( gql.executePrintJob('BB Print Tasks - ANY',tid, orderStateFilters) );
            //gql.EXEC( gql.executePrintJob('BB Print Tasks HTML - ANY', tid, orderStateFilters, nextOrderStates) );
        });
        updateEntityColor('Customers',ticketCustomer);
        updateEntityColor('Tables',ticketTable);
        orders = [];
        updateTicketOrders();
    }
});

//$('#orderTagCloseButton').click( function () {
//    updateCategories();
//    if (document.getElementById(selectedCategoryId)) {
//        document.getElementById(selectedCategoryId).click();
//    }
//});

$('#amc_NV_Main_Menu').click( function () {
    loadNAV('main_menu');
});

function closeOrderTagDisplay() {
    $('#menuFast').show();
    $('#menuNormal').show();
    $('#orderTagDisplay').empty();
    $('#orderTagDisplay').hide();
}

function showOrderTagGroups(orderTagGroups, addedOrderId) {
            // id,name,color,min,max,tags{id,name,color,description,header,price,rate,filter}
            var tagGroups = orderTagGroups;
            
            if (tagGroups.length > 0) {
                
                var otStuff = '';

                otStuff += '<div style="height:90%;overflow-y:auto;">';

                for (var g=0; g<tagGroups.length; g++) {
                    var tagGroup = tagGroups[g];
                    //spu.consoleLog('Order Tag Group: '+tagGroup.name +'-----------------------------------');

                    otStuff += '<div class="orderTagGroupSection">';

                    otStuff += '<div id="orderTagGroup_'+tagGroup.id+'" class="orderTagGroup">'+tagGroup.name+'</div>';

                    otStuff += '<div class="orderTagButtonSection">';

                    var tags = tagGroup.tags;
                    for (var t=0; t<tags.length; t++) {
                        var tag = tags[t];
                        //spu.consoleLog('Order Tag: '+tag.name);
                        otStuff += '<div id="otb_'+tag.id+'" class="orderTagButton">'+tag.name+'</div>';
                    }

                    otStuff += '</div>';

                    otStuff += '</div>';

                }

                otStuff += '</div>';

                otStuff += '<div id="orderTagCloseButton" onClick="closeOrderTagDisplay();">CLOSE</div>';

                $('#menuFast').hide();
                $('#menuNormal').hide();
                $('#orderTagDisplay').empty();
                $('#orderTagDisplay').append(otStuff);
                $('#orderTagDisplay').show();
                
                //$('#'+addedOrderId).click();
                //document.getElementById(addedOrderId).click();
            }

}