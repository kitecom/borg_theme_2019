/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('SessionStorageHandler'
	, []
	, function ()
	{
		'use strict';

		return {

			/***
			 * @method set Set a serialized item in session storage
			 * @param {Object} key Attribute name of a key in session storage 
			 * @param {Object} value Value of the attribute "key" in session storage			 
			 */
			set: function (key, value)
			{
				value = value && JSON.stringify(value);
				sessionStorage.setItem(key, value);
			}

			/***
			 * @method get Get the value of key in session storage
			 * @param {Object} key Attribute name of a key in session storage
			 * @return {Object} Data retrieved form session storage parsed in JSON format
			 */
			, get: function (key)
			{
				var data = sessionStorage.getItem(key);
				return data && JSON.parse(data);
			}

			/***
			 * @method remove
			 * Remove item in session storage
			 * @param {Object} key Attribute name of a key in session storage
			 */
			, remove: function (key)
			{
				sessionStorage.removeItem(key);
			}
		};
	});