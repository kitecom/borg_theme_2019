/**
 * Provides methods to show messages and confirmation messages.
 * @class
 * @extends LayoutComponent
 * @global
 * @hideconstructor
 */
class LayoutComponent extends VisualComponent {

		constructor() {
			super()

		/**
		 * Show a Confirmation popup: Example:
		 *
		 * ```javascript
         * var options = {
         *    title: 'Title 1'
         *    , toastType: 'info' // toastTypes [info, success, error, warning]
         *    , toastContent: 'Toast Content'
         *    , messageContent: 'condition'
         *    , confirmationButtonText: 'Ok'
         *    , cancelationButtonText: 'Cancel'
         *    };
         *
         *  return component.showConfirmation(options)
         *      .then(function(params){
         *          if(params.action === 'ok'){
         *             console.log('Ok button is clicked');
         *          }
         *          else(params.action === 'cancel'){
         *             throw new Error('Cancel button is clicked');
         *          }
         *      }).fail(function(error){
         *
         *      });
		 * ```
		 * @param {PopupConfirmationOptions} options
		 * @return {Deferred}
		 */
		showConfirmationPopup(options) {
			return null
		}

        /**
        * @param {PopupMessageOptions} options
        * @return {Deferred}
        */
       showMessagePopup(options) {
           return null
       }
    }
}

// Data types:

/**
 * This is the representation of the option to show the confirmation popup
 * @typedef {Object} PopupConfirmationOptions
 * @property {String} [title]
 * @property {String} [toastType]
 * @property {String} [toastContent]
 * @property {String} [messageContent]
 * @property {String} [confirmationButtonText]
 * @property {String} [cancelationButtonText]
 **/

 /**
  * This is the representation of the option to show the message popup
  * @typedef {Object} PopupMessageOptions
  * @property {String} [title]
  * @property {String} [toastType]
  * @property {String} [toastContent]
  * @property {String} [messageContent]
  * @property {String} [confirmationButtonText]
  **/
