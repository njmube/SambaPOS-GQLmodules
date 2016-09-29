////////////////////////////////
//
// config
//
////////////////////////////////
var PHP = false;

// derive Server information from Address Bar
var webHost  = location.hostname;  // myServer.com
var webPort  = location.port;      // blank assumes port 80
var webPath  = location.pathname;  // might be like /app/mysite/blah
var webParm  = location.search;    // things after '?', like ?module=customer_display
var webProto = location.protocol;  // usually http: or https:

var webUrl   = webProto + '//' + webHost + (location.port ? ':'+location.port : '') + webPath;

// Message Server
var msgsrv = webHost;

// GraphQL server
var GQLhost = msgsrv;
var GQLport = '9000';
var GQLpath = '/api/graphql/';
var GQLurl  = webProto + '//' + GQLhost + ':' + GQLport + GQLpath;

// SIGNALR server
var SIGNALRhost = msgsrv;
var SIGNALRport = GQLport;
var SIGNALRpath = '/signalr';
var SIGNALRhubs = '/signalr/hubs/';
var SIGNALRurl  = webProto + '//' + SIGNALRhost + ':' + SIGNALRport + SIGNALRpath;
var SIGNALRhub  = webProto + '//' + SIGNALRhost + ':' + SIGNALRport + SIGNALRhubs;

// these defaults will be overwritten by values set in Server Terminal Rules (BUS_)
var venueName      = 'My Awesome Restaurant';
var welcomeMessage = 'Welcome to';
var openMessage    = 'We are Open!';
var closedMessage  = 'We are Closed.';

// define your number thousands separator and decimal separator
var sepThousand = ',';
var sepDecimal  = '.';

var favico    = 'images/icons/favicon.ico';
var icon      = 'images/icons/favicon-blue.png';
var busyWheel = '<img src="images/progresswheel.gif" alt="please wait" />';


var modulePath = 'modules/';

var availableModules = [];
    availableModules.push('Customer Display');
    availableModules.push('Kitchen Display');
    availableModules.push('Ticket Explorer');
    availableModules.push('CHAT');
    availableModules.push('Timeclock');
    availableModules.push('Timeclock Policies');
    availableModules.push('Punch Editor');
    availableModules.push('Task Editor');
if (PHP) {
    availableModules.push('Reports');
}

var module = availableModules[0];


if (PHP) {
    var currentUser     = 'unknownUser';
    var currentTerminal = 'JSclient';
} else {
    var currentUser     = 'Admin';
    var currentTerminal = 'Server';
}


// Kitchen Display
var KD_HTMLtaskType = 'BB Bump Bar Task HTML';
var KD_GUItaskType = 'BB Bump Bar Task';
var KD_interop = false;


// Timeclock
var TC_EntityType = 'Employees';
var TC_EntitySearch = 'Active'; // checks Entity Custom Data Field called "Status" to display only "Active" Employees
var TC_PunchTaskType = 'TC Punch Task';
var TC_PunchControlTaskType = 'TC Punch Control Task';
var TC_PolicyTaskType = 'TC Policy Task';


// Dates and Times

var dateFormats = [moment.ISO_8601,"YYYY-MM-DD","YYYY-MM-DD HH:mm","YYYY-MM-DD HH:mm:ss","MM/DD/YYYY","MM/DD/YYYY HH:mm","MM/DD/YYYY HH:mm:ss","DD/MM/YYYY","DD/MM/YYYY HH:mm","DD/MM/YYYY HH:mm:ss"];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
var myDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    myDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

//alert('config loaded.');