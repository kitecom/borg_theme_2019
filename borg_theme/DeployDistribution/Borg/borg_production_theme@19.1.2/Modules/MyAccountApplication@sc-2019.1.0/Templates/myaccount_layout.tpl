<div id="layout" class="myaccount-layout">
	<header id="site-header" class="myaccount-layout-header" data-view="Header"></header>


	<div id="main-container" class="myaccount-layout-container">
		<h1 class="myaccount-layout-title">My Account</h1>

		<!--div class="myaccount-layout-breadcrumb" data-view="Global.Breadcrumb" data-type="breadcrumb"></div-->
		<div class="myaccount-layout-notifications">
			<div data-view="Notifications"></div>
		</div>
		<div class="myaccount-layout-error-placeholder"></div>


		<div data-cms-area="myaccount_cms_area" data-cms-area-filters="path" class="myaccount_cms_area"></div>

		<div class="myaccount-layout-row">

			<nav id="side-nav" class="myaccount-layout-side-nav" data-view="MenuTree"></nav>

			<div id="content" class="myaccount-layout-main"></div>
		</div>

	</div>

	<footer id="site-footer" class="myaccount-layout-footer" data-view="Footer"></footer>

</div>



{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
