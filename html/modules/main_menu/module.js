////////////////////////////////
//
// nav_main_menu
//
////////////////////////////////
function init_nav() {
    // do some stuff
}
spu.consoleLog('Initializing '+module.replace(/_/,' ').toUpperCase()+' ...');

var mmstuff = '';

$('#NAV_MainMenuDisplay').empty();

mmstuff += '<div style="display:flex;flex-direction:row;justify-content:space-between;align-items:stretch;height:100%;">';


var modCount = availableModules.length;
var lcol = Math.round(modCount/2);


mmstuff += '<div style="display:flex;flex-direction:column;justify-content:space-between;align-items:stretch;height:100%;">';
for (var t=0; t<lcol; t++) {
    var modName = availableModules[t];
    var modLoc  = availableModules[t].replace(/ /g,'_').toLowerCase();
    if (modLoc != 'main_menu') {
        var navTo = "navigateTo('module','" + modLoc + "','" + modLoc + "');";
        mmstuff += '<div class="tile" onClick="' + navTo + '">' + modName + '</div>';
    }
}
mmstuff += '</div>';


mmstuff += '<div style="display:flex;flex-direction:column;justify-content:space-between;align-items:stretch;height:100%;">';
for (var t=lcol; t<modCount; t++) {
    var modName = availableModules[t];
    var modLoc  = availableModules[t].replace(/ /g,'_').toLowerCase();
    if (modLoc != 'main_menu') {
        var navTo = "navigateTo('module','" + modLoc + "','" + modLoc + "');";
        mmstuff += '<div class="tile" onClick="' + navTo + '">' + modName + '</div>';
    }
}
mmstuff += '</div>';


mmstuff += '</div>';

$('#NAV_MainMenuDisplay').append(mmstuff);
