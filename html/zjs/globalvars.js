/* 
GLOBAL VARS
*/

var sessionId;

var isConnected = false;
var tryingToReconnect = false;
var signalRbytes = 0;
var GQLbytesSent = 0;
var GQLbytesRcvd = 0;
var GQLbytes = 0;

var WPID = 0;
var WPisOpen = (WPID>0 ? true : false);
var workperiod = {};
    workperiod.id = 0;
    workperiod.isOpen = false;

var localSettings = { };
var globalSettings = { };

// Kitchen Display
var taskCount = 0;
var selectedTasks = [];
var selectedTaskIDs = [];
var selectedTaskIdents = [];
var taskCardTimer;
var updatedTasks = [];
var eventCounter = [];

// Timeclock
var TC_Entities = [];
var TC_Tasks = [];
var TC_selectedEntities = [];
var TC_Holiday_Flag = false;

// Ticket Explorer
var TE_Tickets = [];

// Custom Reports
var customReports = [];
var reportHeaders  = [];
var reportHeadersD = [];
var reportHeadersS = [];
var reportColumnWidths = [];
var reportColumnWidthTotal = 0;

// Task Editor
var taskTypes = [];
var TSK_Tasks = [];
var TSK_TaskTypes = [];

// POS
var selectedCategoryId = 0;
var categoryIDs = [];
var orders = [];
var ticketCustomer = '';
var ticketTable = '';
var selectedOrderCount = 0;
var ttl = 0.00;
var cdttl = 0.00;
var tenderedAmount = 0;
var processedAmount = 0;
var balance = 0;
var changeAmount = 0;
var paymentTypeName = '';
var paymentDescription = '';


// Dates and Times

var nowDate        = moment().format("YYYY-MM-DD");
var nowDateLessDay = moment().subtract(1,'days').format("YYYY-MM-DD");
var nowTime        = moment().format("HH:mm:ss");
var nowDateTime    = moment().format("YYYY-MM-DD HH:mm:ss");
var today          = moment().format("YYYY-MM-DD");
var tomorrow       = moment().add(1,'days').format("YYYY-MM-DD");
var todayStart     = moment().format("YYYY-MM-DD" + " 00:00:00");
var todayEnd       = moment().add(1,'days').format("YYYY-MM-DD" + " 00:00:00");
var yesterday      = moment().subtract(1,'days').format("YYYY-MM-DD");
var yesterdayStart = moment().subtract(1,'days').format("YYYY-MM-DD" + " 00:00:00");
var yesterdayEnd   = moment().format("YYYY-MM-DD" + " 00:00:00");
var weekStart      = moment().subtract(7,'days').format("YYYY-MM-DD");
var weekEnd        = moment().format("YYYY-MM-DD");
var weekPastStart  = moment().subtract(14,'days').format("YYYY-MM-DD");
var weekPastEnd    = moment().subtract(7,'days').format("YYYY-MM-DD");
var monthStart     = moment().startOf('month').format("YYYY-MM-DD");
var monthEnd       = moment().endOf('month').format("YYYY-MM-DD");
var monthPastStart = moment().startOf('month').subtract(1,'months').format("YYYY-MM-DD");
var monthPastEnd   = moment().endOf('month').subtract(1,'months').format("YYYY-MM-DD");
var yearStart      = moment().startOf('year').format("YYYY-MM-DD");
var yearEnd        = moment().endOf('year').format("YYYY-MM-DD");
var yearPastStart  = moment().startOf('year').subtract(1,'years').format("YYYY-MM-DD");
var yearPastEnd    = moment().endOf('year').subtract(1,'years').format("YYYY-MM-DD");

var date = new Date();
var day = date.getDate();
var month = date.getMonth();
var thisDay = date.getDay(),
    thisDay = myDays[thisDay];
var yy = date.getYear();
var year = (yy < 1000) ? yy + 1900 : yy;

var clockTimer;

// Keyboard
var KEYCODES = [];
KEYCODES[48] = '0';
KEYCODES[49] = '1';
KEYCODES[50] = '2';
KEYCODES[51] = '3';
KEYCODES[52] = '4';
KEYCODES[53] = '5';
KEYCODES[54] = '6';
KEYCODES[55] = '7';
KEYCODES[56] = '8';
KEYCODES[57] = '9';

KEYCODES[32] = 'space';
KEYCODES[37] = 'left';
KEYCODES[38] = 'up';
KEYCODES[39] = 'right';
KEYCODES[40] = 'down';
KEYCODES[9]  = 'tab';
KEYCODES[13] = 'enter';
KEYCODES[46] = 'delete';
KEYCODES[20] = 'capslock';
KEYCODES[16] = 'shift';
KEYCODES[18] = 'alt';
KEYCODES[17] = 'ctrl';
KEYCODES[93] = 'menu';
KEYCODES[91] = 'start';
KEYCODES[27] = 'esc';

KEYCODES[65] = 'a';
KEYCODES[66] = 'b';
KEYCODES[67] = 'c'; // Complete Task
KEYCODES[68] = 'd';
KEYCODES[69] = 'e';
KEYCODES[70] = 'f';
KEYCODES[71] = 'g';
KEYCODES[72] = 'h';
KEYCODES[73] = 'i';
KEYCODES[74] = 'j';
KEYCODES[75] = 'k';
KEYCODES[76] = 'l';
KEYCODES[77] = 'm';
KEYCODES[78] = 'n';
KEYCODES[79] = 'o';
KEYCODES[80] = 'p';
KEYCODES[81] = 'q';
KEYCODES[82] = 'r'; // Refresh
KEYCODES[83] = 's'; // Select All
KEYCODES[84] = 't';
KEYCODES[85] = 'u';
KEYCODES[86] = 'v';
KEYCODES[87] = 'w';
KEYCODES[88] = 'x';
KEYCODES[89] = 'y';
KEYCODES[90] = 'z';

KEYCODES[191] = '?';


var urlParm = (function(a) {
    // reads URL QueryString values
    // With an URL like:
    // ?topic=123&name=query+string
    // call like this:
    // urlParm["topic"];    // 123
    // urlParm["name"];     // query string
    // urlParm["nothere"];  // undefined (object)
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    URLmodule = b;
    return b;
})(window.location.search.substr(1).split('&'));

var URLmodule = urlParm["module"];//'main_menu';
    URLmodule = (URLmodule ? URLmodule : 'main_menu');
    
function updateQueryString(key, value, url) {
    // Not supplying a value will remove the parameter
    // supplying one will add/update the parameter
    // If no URL is supplied, it will be grabbed from window.location
    spu.consoleLog('updateQueryString() ... key:"'+key + '" value:"'+value + '" url:"'+url+'"');
    
    var retVal='';
    
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null) {
            retVal = url.replace(re, '$1' + key + "=" + value + '$2$3');
            return retVal;
        } else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
    } else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        } else {
            return url;
        }
    }
}


//var txt = "Browser CodeName: " + navigator.appCodeName + "\r\n";
//txt+= "Browser Name: " + navigator.appName + "\r\n";
//txt+= "Browser Version: " + navigator.appVersion + "\r\n";
//txt+= "Cookies Enabled: " + navigator.cookieEnabled + "\r\n";
//txt+= "Platform: " + navigator.platform + "\r\n";
//txt+= "User-agent header: " + navigator.userAgent + "\r\n";
//txt+= "User-agent language: " + navigator.systemLanguage + "\r\n";
//alert(txt);

var devicePlatform = navigator.platform.toLowerCase();
var isiPad = (devicePlatform.indexOf('ipad') === -1 ? false : true);
var isiDevice = (navigator.userAgent.match(/(iPod|iPhone|iPad)/) ? true :false);

var isAndroid = (navigator.userAgent.match(/(Android)/) ? true :false);

var inSambaPOS = false;
var winEx = '';
var hasMethods = false;

if (isiDevice) {
    inSambaPOS = false;
} else {
    winEx = typeof window.external;
    hasMethods = (typeof window.external.ExecuteAutomationCommand === 'unknown' ? true : false);
    inSambaPOS = (((winEx === 'undefined' || hasMethods) && !isiDevice) ? true : false);
}

// shim for iPad scrollbars for Task Editor
function jumpTop() {
    if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {           
        window.scrollTo(200,100); // first value for left offset, second value for top offset
        window.setTimeout(function() {window.scrollTo(0,0);}, 300);
        window.scrollTo(0, 0);
        window.scroll(0, 1);
    } else {
        $('html,body').animate({
            scrollTop: 0,
            scrollLeft: 0
        }, 300, function(){
            $('html,body').clearQueue();
        });
    }
}

//alert('globs loaded.');