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
	<nav class="navbar navbar-default" role="navigation">
		<div class="container-fluid">
			<a class="navbar-brand" href="/cache-manager/">Cache Manger</a>
			<ul class="nav navbar-nav">
				<li><a href="/admin/">Admin</a></li>
			</ul>
		</div>
	</nav>
	<div class="col-md-12">
		$ManagerComponent
	</div>
</body>
</html>
