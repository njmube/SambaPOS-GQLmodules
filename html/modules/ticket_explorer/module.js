////////////////////////////////
//
// nav_ticket_explorer
//
////////////////////////////////
function init_nav() {
    // do some stuff
}
spu.consoleLog('Initializing '+module.replace(/_/,' ').toUpperCase()+' ...');

$('#TE_Tickets').on('click', '.TE_TicketPreview', function(){

    var btn = this.id; // Employees_Jenery, Employees_Ovania, ...
    var btnName = btn.replace(/Tickets_/g,'');
    var ticketId = btn.replace(/Tickets_/g,'');
    spu.consoleLog('TE Ticket Clicked:'+btn+' ('+btnName+')');
    
    for (var e=0; e<TE_Tickets.length; e++) {
        var tkt = 'Tickets_' + TE_Tickets[e].uid;

        if (document.getElementById(tkt)) {
            document.getElementById(tkt).setAttribute('isSelected','0');
            document.getElementById(tkt).style.borderColor = '';
        }
    }
    
    TE_selectedTickets = [];
    
    if (document.getElementById(btn)) {
        var isSel = (document.getElementById(btn).getAttribute('isSelected') == '1' ? '0' : '1');
        document.getElementById(btn).setAttribute('isSelected',isSel);
        if (isSel == 1) {
            document.getElementById(btn).style.borderColor = '#FFBB00';
            for (var e=0; e<TE_Tickets.length; e++) {
                if (ticketId == TE_Tickets[e].id) {
                    TE_selectedTickets.push(ticketId);
                    break;
                }
            }
            spu.consoleLog('Selected TE Ticket: '+btnName);
            
            displayTicketExplorerTicket(btnName);
            jumpTop();

        } else {
            document.getElementById(btn).style.borderColor = '';
            spu.consoleLog('DE-Selected TE Ticket: '+btnName);
            $('#TE_Ticket').empty();
        }
    }

});
