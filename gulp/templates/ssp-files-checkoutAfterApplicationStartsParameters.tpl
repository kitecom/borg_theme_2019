<% if (login) { %>
	require(['SC.Configuration'], function(Configuration) {
		Configuration.currentTouchpoint = 'login'
	});
<% } %>
<% if (parameters.is === 'storelocator') { %>
	require(['SC.Configuration'], function(Configuration) {
		Configuration.currentTouchpoint = 'storelocator';
	});
<% } %>