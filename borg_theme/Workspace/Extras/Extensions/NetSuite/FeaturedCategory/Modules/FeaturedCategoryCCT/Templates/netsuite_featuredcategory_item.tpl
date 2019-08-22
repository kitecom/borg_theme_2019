
{{#if itemOk}}
    <div class="featuredcategorycct-item-container item-cell facets-item-cell-grid-details col-lg-{{colsPerRow}} col-md-{{colsPerRow}} col-xs-{{colsPerRowPhone}} featuredcategorycct-align">
            <div class="featuredcategorycct-item-image-container featuredcategorycct-align">
                <a href="{{itemLink}}">
                    <img class="featuredcategorycct-item-image item-cell-image" src="{{resizeImage imageUrl 'thumbnail'}}" alt="{{resizeImage imageAlt 'thumbnail'}}" title="{{imageAlt}}"/>
                </a>
            </div>
                <div class="facets-item-cell-grid-title featuredcategorycct-item-display-name featuredcategorycct-align">
                    {{#if showItemName}}
                        <a href="{{itemLink}}">
                            {{displayName}}
                        </a>
                    {{/if}}
                </div>
            
                <div class="featuredcategorycct-item-price middle-price">
                    {{#if showItemPrice}}
                        {{itemPrice}}
                    {{/if}}
                </div>
    </div>
{{/if}}


