<div class="custom-fields-checkout-group" data-position="{{position}}" data-module="{{module}}">
    <form>
        {{#if isLoadingError}}
            <p class="custom-fields-checkout-group-loading-error">{{translate loadingError}}</p>
        {{else}}
            <div data-view="CustomFields.Group"></div>
            {{#if isLoading}}
            <p class="custom-fields-checkout-group-loading-message">{{translate loadingMessage}}</p>
            {{/if}}
        {{/if}}
    </form>
</div>
