{{#if showExtendedMenu}}
	<a class="header-profile-welcome-link" href="#" data-toggle="dropdown">
		<i class="header-profile-welcome-user-icon"></i>
		{{translate 'Welcome <strong class="header-profile-welcome-link-name">$(0)</strong>' displayName}}
		<i class="header-profile-welcome-carret-icon"></i>
	</a>

	{{#if showMyAccountMenu}}
		<ul class="header-profile-menu-myaccount-container">
			<li data-view="Header.Menu.MyAccount"></li>
		</ul>
	{{/if}}

	<a class="header-menu-myaccount-overview-anchor reco" href="#" data-touchpoint="customercenter" data-hashtag="#overview" name="accountoverview">
		<svg id="icon-user" viewBox="0 0 16 17.2"><path d="M4.4 5.6c0-2 1.6-3.7 3.7-3.7 2 0 3.7 1.6 3.7 3.7 0 2-1.6 3.6-3.5 3.6h-.1-.1c-2.2-.1-3.7-1.7-3.7-3.6m7 4.4c1.3-1 2.2-2.6 2.2-4.4C13.6 2.5 11.1 0 8 0 4.9 0 2.4 2.5 2.4 5.6c0 1.8.8 3.4 2.2 4.4C1.9 11.3 0 14 0 17.2h1.9c0-3.3 2.6-6 5.9-6.1h.4c3.3.1 5.9 2.8 5.9 6.1H16c0-3.2-1.8-5.9-4.6-7.2"></path></svg>
	</a>

{{else}}

	{{#if showLoginMenu}}
		{{#if showLogin}}
			<div class="header-profile-menu-login-container">
				<ul class="header-profile-menu-login">
					<li>
						<a class="header-profile-login-link guest" data-touchpoint="login" data-hashtag="login-register" href="#">
							<!--<i class="header-profile-login-icon"></i>-->
							
							<svg id="icon-user" viewBox="0 0 16 17.2"><path d="M4.4 5.6c0-2 1.6-3.7 3.7-3.7 2 0 3.7 1.6 3.7 3.7 0 2-1.6 3.6-3.5 3.6h-.1-.1c-2.2-.1-3.7-1.7-3.7-3.6m7 4.4c1.3-1 2.2-2.6 2.2-4.4C13.6 2.5 11.1 0 8 0 4.9 0 2.4 2.5 2.4 5.6c0 1.8.8 3.4 2.2 4.4C1.9 11.3 0 14 0 17.2h1.9c0-3.3 2.6-6 5.9-6.1h.4c3.3.1 5.9 2.8 5.9 6.1H16c0-3.2-1.8-5.9-4.6-7.2"></path></svg>
							<span class="login-text">{{translate 'Login'}}</span>
						</a>
					</li>
					{{#if showRegister}}
						<li> | </li>
						<li>
							<a class="header-profile-register-link" data-touchpoint="register" data-hashtag="login-register" href="#"> 
								{{translate 'Register'}}
							</a>
						</li>
					{{/if}}
				</ul>
			</div>
		{{/if}}
	{{else}}
		<a class="header-profile-loading-link">
			<i class="header-profile-loading-icon"></i>
			<span class="header-profile-loading-indicator"></span>
		</a>
	{{/if}}

{{/if}}
<p>{{firstName}}</p>
<p>{{lastName}}</p>

{{!----
Use the following context variables when customizing this template:

	showExtendedMenu (Boolean)
	showLoginMenu (Boolean)
	showLoadingMenu (Boolean)
	showMyAccountMenu (Boolean)
	displayName (String)
	showLogin (Boolean)
	showRegister (Boolean)

----}}
