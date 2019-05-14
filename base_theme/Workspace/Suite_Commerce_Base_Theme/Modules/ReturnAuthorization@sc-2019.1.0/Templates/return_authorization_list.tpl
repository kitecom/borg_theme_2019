{{#if showBackToAccount}}
	<a href="/" class="return-authorization-list-button-back">
		<i class="return-authorization-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="return-authorization-list">
	<header class="return-authorization-list-header">
		<h2>{{pageHeader}}</h2>
	</header>

	{{#if showMessage}}
		<div data-view="Message"></div>
	{{/if}}

	<div data-view="ListHeader.View"></div>

	<div class="return-authorization-list-container">
		{{#if isResultLengthGreaterThan0}}
			
			<table class="return-authorization-list-results-list">
				<thead class="return-authorization-list-content-table">
					<tr class="return-authorization-list-content-table-header-row">
						<th class="return-authorization-list-content-table-header-row-title">
							<span>{{translate 'Return No.'}}</span>
						</th>
						{{#each columns}}
							<th class="return-authorization-list-content-table-header-row-{{type}}">
								<span>{{label}}</span>
							</th>					
						{{/each}}	
					</tr>
				</thead>
				<tbody data-view="Records.List" class="return-authorization-list-records-list"></tbody>
			</table>

			{{#if showPagination}}
				<div class="return-authorization-list-paginator">
					<div data-view="GlobalViews.Pagination"></div>
					{{#if showCurrentPage}}
						<div data-view="GlobalViews.ShowCurrentPage"></div>
					{{/if}}
				</div>
			{{/if}}
			
		{{else}}
			{{#if isLoading}}
				<p class="return-authorization-list-empty">{{translate 'Loading...'}}</p>
			{{else}}
				<div class="return-authorization-list-empty-section">
					<h5>{{translate 'No returns were found'}}</h5>
				</div>
			{{/if}}
		{{/if}}
	</div>
</section>




{{!----
Use the following context variables when customizing this template: 
	
	pageHeader (String)
	showMessage (Boolean)
	isResultLengthGreaterThan0 (Boolean)
	isLoading (Boolean)
	showBackToAccount (Boolean)
	showPagination (Boolean)

----}}
