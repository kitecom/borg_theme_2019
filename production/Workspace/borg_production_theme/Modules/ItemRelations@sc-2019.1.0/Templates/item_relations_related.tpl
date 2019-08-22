{{#if showCells}}
	<aside class="item-relations-related">
		<h3>1{{model.item.relateditemsdescription}}</h3>
		<h3>2{{item.relateditemsdescription}}</h3>
		<h3>3{{relateditemsdescription}}</h3> 
		<div class="item-relations-related-row">
			<div data-type="backbone.collection.view.rows"></div>
		</div>
	</aside>
{{/if}}



{{!----
Use the following context variables when customizing this template:

	collection (Array)
	showCells (Boolean)

----}}
