<?php

$dbconn = dbconnect();

// check for Open Workperiod
$qry = "SELECT isnull(max([Id]),0) as [WPID] FROM [Workperiods] WHERE [StartDate] = [EndDate]";
$qryresult = dbquery($qry);
$WPID  = $qryresult[1]["WPID"];
$WPID = ($WPID ? $WPID : '0');

// get Automation Command Buttons
$qry = "
SELECT 
command.[Id]
,command.[Name]
,replace(replace(isnull([ButtonHeader],''),'\r','\\r'),char(13),'\\r') as [ButtonHeader]
,map.[DisplayOnTicket]
,map.[DisplayOnPayment]
,map.[DisplayOnOrders]
,map.[DisplayOnTicketList]
,map.[DisplayUnderTicket]
,map.[DisplayUnderTicket2]
,map.[DisplayOnCommandSelector]
,[DisplayOnNavigation]
,map.[TerminalId]
,isnull(term.[Name],'ANY') as [Terminal]
,map.[DepartmentId]
,isnull(dep.[Name],'ANY') as [Department]
,map.[TicketTypeId]
,isnull(tktType.[Name],'ANY') as [TicketType]
,map.[UserRoleId]
,isnull(ur.[Name],'ANY') as [UserRole]
,map.[EnabledStates]
,map.[VisibleStates]
,isnull(ur.[Name],'ANY') as [UserRole]
,[FontSize]
,[Color]
,command.[SortOrder]
,[Symbol]
,[Image]
,[ContentTemplate]
,[NavigationModule]
FROM [AutomationCommands] command
JOIN [AutomationCommandMaps] map on map.[AutomationCommandId] = command.[Id]
LEFT JOIN [UserRoles] ur on ur.[Id] = map.[UserRoleId]
LEFT JOIN [Terminals] term on term.[Id] = map.[TerminalId]
LEFT JOIN [Departments] dep on dep.[Id] = map.[DepartmentId]
LEFT JOIN [TicketTypes] tktType on tktType.[Id] = map.[TicketTypeId]
WHERE 1=1
AND (   isnull(ur.[Name],'ANY') = ?
     OR isnull(ur.[Name],'ANY') = ?
    )
AND (   isnull(term.[Name],'ANY') != ?)
ORDER BY command.[SortOrder], command.[Name]
";
$qryparms = array('ANY','Admin','Server');
$amcButtons = dbquery($qry,$qryparms);

// get Custom Reports
$qry = "
SELECT
[Id]
,[ReportType]
,[DisplayInExplorer]
,[Name]
,[Template]
,[PageSize]
,[Layouts]
,[SortOrder]
,[VisualPrint]
FROM [CustomReports]
ORDER BY [SortOrder], [Name]
";
$customReports = dbquery($qry);

// get Task Types
$qry = "
SELECT
 [Id]
,[Name]
FROM [TaskTypes]
ORDER BY [Name]
";
$taskTypes = dbquery($qry);

// get Task Type Custom Fields
$qry = "
SELECT
 cf.[Id]
,cf.[TaskTypeId]
,tt.[Name] as [TaskType]
,cf.[Name]
,CASE [FieldType]
 WHEN 0 THEN 'String'
 WHEN 1 THEN 'Number'
 WHEN 2 THEN 'Date'
 END as [FieldType]
,isnull([EditingFormat],'') as [EditingFormat]
,isnull([DisplayFormat],'') as [DisplayFormat]
FROM [TaskCustomFields] cf
JOIN [TaskTypes] tt on tt.[Id] = cf.[TaskTypeId]
ORDER BY tt.[Name], cf.[Id]
";
$taskTypeCustomFields = dbquery($qry);

dbclose();