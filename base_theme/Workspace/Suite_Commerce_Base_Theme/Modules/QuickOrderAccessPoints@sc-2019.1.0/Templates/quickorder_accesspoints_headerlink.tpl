{{#if showTitle}}
	<a class="{{#if hasClass}} {{className}} {{else}}quickorder-accesspoints-headerlink-link{{/if}}" href="#" data-touchpoint="{{cartTouchPoint}}" data-hashtag="#cart?openQuickOrder=true" title="{{translate title}}">
		{{translate title}}
	</a>
{{/if}}	



{{!----
Use the following context variables when customizing this template: 
	
	hasClass (Boolean)
	cartTouchPoint (String)
	className (String)

----}}
