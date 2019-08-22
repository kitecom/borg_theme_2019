/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.List.All.View', [
        'store_locator_list_all.tpl'
    ,   'StoreLocator.List.All.Store.View'
    ,   'StoreLocator.Collection'
    ,   'GlobalViews.Pagination.View'
    ,   'ReferenceMap.Configuration'
    ,   'SC.Configuration'
    ,   'AjaxRequestsKiller'

    ,   'underscore'

    ,   'Backbone'
    ,   'Backbone.CompositeView'
    ,   'Backbone.CollectionView'
    ]
,   function (
        store_locator_list_all_tpl
    ,   StoreLocatorListAllStore
    ,   StoreLocatorCollection
    ,   GlobalViewsPaginationView
    ,   ReferenceConfiguration
    ,   Configuration
    ,   AjaxRequestsKiller

    ,   _

    ,   Backbone
    ,   BackboneCompositeView
    ,   BackboneCollectionView
    )
{
    'use strict';

    return Backbone.View.extend({

        template: store_locator_list_all_tpl

        //@property {Object} attributes
    ,   attributes: {
            'id': 'StoreLocatorListAll'
        ,   'class': 'StoreLocatorListAll'
        }

        //@method initialize
        //@param {Object} options
    ,   initialize: function initialize (options)
        {
            this.configuration = ReferenceConfiguration;
            this.routerArguments = options.routerArguments;
            this.collection = new StoreLocatorCollection()

            //@property {String} title
            this.title = this.configuration.title();

            BackboneCompositeView.add(this);

            this.collection.on('reset', this.render, this);
        }

    ,   beforeShowContent: function beforeShowContent()
        {
            var options = (options) ? SC.Utils.parseUrlOptions(this.routerArguments[0]) : {page: 1};
            
            options.page = options.page || 1;

            return this.collection.update({
                sort: 'namenohierarchy'
                //@property {String} page
            ,   page: options.page

            ,   results_per_page: ReferenceConfiguration.showAllStoresRecordsPerPage()
                //@property {Number} killerId
            ,   killerId: AjaxRequestsKiller.getKillerId()
                //@property {Boolean} reset
            ,   reset: true

            ,   locationtype: Configuration.get('storeLocator.defaultTypeLocations')
            });
        }

        //@property {Object} childViews
    ,   childViews:
        {
           'StoreLocatorListAllStoreView': function ()
            {
                return new BackboneCollectionView({
                    collection: this.collection
                ,   childView: StoreLocatorListAllStore
                });
            }
        ,   'GlobalViews.Pagination': function ()
            {
                return new GlobalViewsPaginationView(_.extend({
                    totalPages: Math.ceil(this.collection.totalRecordsFound / this.configuration.showAllStoresRecordsPerPage()) || 0
                }));
            }
        }

        //@method getContext
        //@return StoreLocator.List.All.View.Context
    ,   getContext: function getContext ()
        {
            return {
                showList: !!this.collection.length
            };
        }
    });
});