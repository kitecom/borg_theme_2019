/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Instrumentation.Cart', ['Logger', 'underscore'], function(Logger, _){
  return {
    mountToApp: function(application) {
	  if (_.result(SC, 'isPageGenerator'))
	  {
		return;
	  }
      var cart = application.getComponent('Cart');
      var logger = Logger.getLogger();
	  var freeItemsBefore = [];
	  //Search for the current free gift items
      cart.on('beforeAddLine', function(){
        cart.getLines().then(function(lines){
          freeItemsBefore.length = 0;
          var cartBefore = lines;
          for (var i = 0; i < cartBefore.length; i++) {
            var line = cartBefore[i];
            if (line.extras.free_gift) {
              freeItemsBefore.push(line);
            }  
          }
        });
      });

      cart.on('afterAddLine', function(){
        cart.getLines().then(function(lines){
          var cartAfter = lines;
          var freeItems = [];
          var newItems = [];
          var obj = {
            componentArea: 'ADDED_TO_CART',
            freeGiftQty: 0
          }
          //Determine if there exists new free gift items
          for (var i = 0; i < cartAfter.length; i++) {
            var line = cartAfter[i];
            var isOld = false;
            if (line.extras.free_gift) {
              for (var j = 0; j < freeItemsBefore.length; j++) {
                var oldItem = freeItemsBefore[j];
                if (line.internalid == oldItem.internalid) {
                  isOld = true;
                  break;
                }
              }
              if (!isOld) {
                obj.freeGiftQty++;
                newItems.push(line);
              } 
            }
          }
          if(newItems.length) {
            //Because afterAddLine is triggered many times consecutively, we must refresh the old free items.
            logger.info(obj);
            freeItemsBefore = newItems;
          }
        });
      });

      cart.on('beforeRemoveLine', function(data){
        cart.getLines().then(function(lines){
          var cartSubmit = lines;  
          var removedLine = undefined;
          var obj = {
            componentArea: 'REMOVED_FROM_CART',
            freeGiftQty: 0
          };
          for (var i = 0; i < cartSubmit.length; i++) {
            var line = cartSubmit[i];
            if (line.internalid == data.line_id && line.extras.free_gift) {
              obj.freeGiftQty =  1;
              logger.info(obj);
              break;
            }  
          }
        });  
      });

      cart.on('beforeSubmit', function(){
        cart.getLines().then(function(lines){
          var cartSubmit = lines;  
          var freeItems = [];
          var obj = {
            componentArea: 'PLACED_ORDER',
            freeGiftQty: 0
          };
          for (var i = 0; i < cartSubmit.length; i++) {
            var line = cartSubmit[i];
            if (line.extras.free_gift) {
              obj.freeGiftQty++;
            }  
          }
          logger.info(obj);
        });  
      });
    }
  }
});


