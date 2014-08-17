<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Cache Manager</title>
	<% if $isLive %>
		<link href="/silverstripe-cacheinclude-manager/assets/production/css/style.min.css" rel="stylesheet">
	<% else %>
		<link href="/silverstripe-cacheinclude-manager/assets/production/css/style.css" rel="stylesheet">
	<% end_if %>
	<script src="/silverstripe-cacheinclude-manager/assets/production/js/bundle.js"></script>
</head>
<body>
	$ManagerComponent
</body>
</html>
