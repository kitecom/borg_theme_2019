{{#if showBackToAccount}}
	<a href="/" class="quote-list-button-back">
	<i class="quote-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="quote-list">
	<header class="quote-list-header">
		<h2>{{pageHeader}}</h2>
	</header>
	<div data-view="List.Header"></div>
	<div class="quote-list-results-container">
		{{#if collectionLength}}

			<table class="quote-list-quotes-table">
				<thead class="quote-list-content-table">
					<tr class="quote-list-content-table-header-row">
						<th class="quote-list-content-table-header-row-title">
							<span>{{translate 'Quote No.'}}</span>
						</th>
						{{#each columns}}
							<th class="quote-list-content-table-header-row-request-{{type}}">
								{{label}}
							</th>	
						{{/each}}
					</tr>
				</thead>
				<tbody data-view="Quote.List.Items"></tbody>
			</table>

		{{else}}
			{{#if isLoading}}
				<p class="quote-list-empty">{{translate 'Loading...'}}</p>
			{{else}}
				<div class="quote-list-empty-section">
					<h5>{{translate 'No quotes were found'}}</h5>
				</div>
			{{/if}}
		{{/if}}
	</div>
</section>


{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
