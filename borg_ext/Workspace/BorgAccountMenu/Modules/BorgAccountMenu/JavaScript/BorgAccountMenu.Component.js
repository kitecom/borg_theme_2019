/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/


define(
  'BorgAccountMenu.Component'
  , ['SC.BaseComponent'
    , 'MenuTree.View'
    , 'Utils'
    , 'underscore'
    , 'Application'
  ]
  ,
  function (
    SCBaseComponent
    , MenuTreeView
    , Utils
    , _
  ) {
    'use strict';

    function parsePermission(permissions) {
      var concat = "";
      _.each(permissions, function(item) {
        concat = concat + item.group + "." + item.id + '.' + item.level + ', ';
      });
      return concat.substring(0, concat.length-2);
    }

    function addBorgAccountMenu(menu, item) {
      if (item.permission) {
        item.permission = parsePermission(item.permission);
      }
      menu.addMenuItem(item);
      menu.updateMenuItemsUI();
    }

    return {
      mountToApp: function (container) {
        container.registerComponent(this.componentGenerator(container));
      }

      , componentGenerator: function (container) {

        var menu = MenuTreeView.getInstance();

        return SCBaseComponent.extend({

          componentName: 'BorgAccountMenu'

          , application: container

          , addGroup: function (g) {
              var group = Utils.deepCopy(g);
              if (group.url) {
                group.showChildren = false;
              } else {
                group.showChildren = true;
              }
              addBorgAccountMenu(menu, group);
          }

          , addGroupEntry: function (e) {
              var entry = Utils.deepCopy(e);
              entry.showChildren = false;
              entry.parent = e.groupid;
              delete entry.groupid;
              addBorgAccountMenu(menu, entry);
          }
        });
      }
    };
  });