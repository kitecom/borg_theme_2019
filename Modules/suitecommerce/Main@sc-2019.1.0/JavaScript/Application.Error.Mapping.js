/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Main
define(
	'Application.Error.Mapping'
,	[
		'underscore'
	,	'Utils'
	]
,	function (
		_
	)
{
	'use strict';

	return {
		getMappingMessage: function(errorCode, params)
		{
			var msg = {
				errorCode: errorCode
			,	message: this[errorCode].message
			};

			if (params)
			{
				msg.message = _(this[errorCode].message).translate(params.toString().split(','));
			}

			return msg;

		}

	,	ERR_BAD_REQUEST: {
			message: _('SCIS cannot compute this request. Try again.').translate()
		}

	,	ERR_USER_NOT_LOGGED_IN: {
			message: _('You are not logged in.').translate()
		}

		//@property {Object} sessionTimedOutError
	,	ERR_USER_SESSION_TIMED_OUT: {
			message: _('Your session has timed out. Please log in again.').translate()
		}

	,	ERR_INSUFFICIENT_PERMISSIONS: {
			message: _('You do not have permission to perform this action. Contact an administrator to ensure you have the correct permissions.').translate()
		}


	,	ERR_RECORD_NOT_FOUND: {
			message: _('Record is not found.').translate()
		}

	,	ERR_METHOD_NOT_ALLOWED: {
			message: _('This action is not allowed. Contact an administrator to ensure you have the correct permissions.').translate()
		}

	,	ERR_INVALID_ITEMS_FIELDS_ADVANCED_NAME: {
			message: _('Contact an administrator to check if the field set has been created.').translate()
		}

		//***** SCIS ERRORS *****
	,	ORDER_REQUIRED: {
			message: _('You must specify an Order ID.').translate()
		}

	,	NOT_IMPLEMENTED: {
			message: _('Not implemented.').translate()
		}

	,	NO_SITE_ID: {
			message: _('No siteId in this session. Try logging in again.').translate()
		}


	,	MISSING_SITE_ID: {
			message: _('The siteId parameter is required.').translate()
		}


	,	ORDER_ID_OR_CREDIT_MEMO_ID: {
			message: _('The orderId or creditMemoId is required.').translate()
		}

	,	NOT_APPLICABLE_CREDIT_MEMO: {
			message: _('Credit Memo is not applicable to this order. Assign the customer on the credit memo to the invoice, and then verify the credit memo balance.').translate()
		}

	,	REFOUND_METHOD_REQUIRED: {
			message: _('You must specify the payment method for the refund.').translate()
		}

	,	INVALID_ORDER_ID: {
			message: _('ID for this order is not valid.').translate()
		}

	,	INVALID_RETURNED_QUANTITY: {
			message: _('The quantity being returned exceeds the available quantity. (Line $(0))').translate()
		}

	,	CUSTOMER_NOT_FOUND: {
			message: _('Customer is not found: $(0)').translate()
		}

	,	CUSTOMER_NOT_EXIST: {
			message: _('Customer does not exist: $(0)').translate()
		}

	,	CUSTOMER_REQUIRED: {
			message: _('Customer is requred.').translate()
		}

	,	ENTITY_ID_REQUIRED: {
			message: _('The entityId is required: $(0)').translate()
		}

	,	UNEXPECTED_ERROR:{
			message: _('An Unexpected Error has occurred.').translate()
		}

	,	DEVICE_NOT_FOUND: {
			message: _('Device was not found.').translate()
		}

	,	PARAMETER_MISSING: {
			message: _('Missing parameter: $(0)').translate()
		}

	,	PRINTING_TECHNOLOGY_NOT_FOUND: {
			message: _('Printing technology not found.').translate()
		}

	,	INVALID_URL: {
			message: _('URL is not valid.').translate()
		}

	,	INVALID_PARAMETER: {
			message: _('Parameter is not valid.').translate()
		}

	,	MISSING_PARAMETER: {
			message: _('Missing parameter.').translate()
		}

	,	NOT_FOUND_EMPLOYEE_LOCATION: {
			message: _('The current user is not associated with a location. A location must be selected on the employee record.').translate()
		}

	,	REQUIRED_SALES_ASSOCIATE_LOCATION: {
			message: _('The sales associate requires a location to create the order. A location must be selected on the employee record.').translate()
		}

	,	INVALID_TRANSACTION_TYPE: {
			message: _('Transaction type is not valid: $(0)').translate()
		}

	,	LOCATION_ADDRESS_MISSING_FIELDS: {
			message: _('Location address is missing required information. Please complete the form to proceed. $(0)').translate()
		}

	,	LOCATION_SETTINGS_NOT_FOUND: {
			message: _('Location setting is not found for current location: $(0)').translate()
		}

	,	LOCATION_IS_REQUIRED: {
			message: _('Location is required.').translate()
		}

	,	IMPOSSIBLE_APPLY_CUPON: {
			message: _('Unable to apply the coupon.').translate()
		}

	,	SAVED_SEARCH_INVALID_COLUMN: {
			message: _('Column index is not valid in the Saved Search: $(0)').translate()
		}

	,	SAVED_SEARCH_NOT_FOUND: {
			message: _('Saved Search is not found: $(0)').translate()
		}

	,	SAVED_SEARCH_MISSING_PARAMETER: {
			message: _('Saved Search is missing a parameter.').translate()
		}

	,	ITEM_NOT_IN_SUBSIDIARY: {
			message: _('Item is not configured for current subsidiary: $(0).').translate()
		}

	,	GIFT_AUTH_CODE_ALREADY_EXIST: {
			message: _('A Gift Card with the same authorization code already exists.').translate()
		}

	,	UNAPPROVED_PAYMENT: {
			message: _('Unapproved Payment').translate()
		}

	,	NOT_FOUND_PAYMENT: {
			message: _('No payments found').translate()
		}

	,	NECESARY_SUBMIT_ORDER: {
			message: _('The order must be submitted to update payments.').translate()
		}

	,	NOT_FOUND_PAYMENT_METHOD_FOR_USER: {
			message: _('Payment Method not found for the current user.').translate()
		}

	,	FORCE_CANCELLABLE_PAYMENT: {
			message: _('Unable to force cancellation of a payment that can be canceled.').translate()
		}

	,	ITEM_NOT_CONFIGURED_FOR_SUBSIDIARY: {
			message: _('Item is not configured for the current subsidiary: $(0).').translate()
		}

	,	TRANSACTION_HAS_BEEN_RESUMED: {
			message: _('The transaction has been resumed.. Status: $(0)').translate()
		}

	,	LOAD_BEFORE_SUBMIT: {
			message: _('BackendOpen the record before submitting it.').translate()
		}

	,	UNKNOW_RECORD: {
			message: _('Unknown record type.').translate()
		}

	,	LINE_LIMIT: {
			message: _('You have added $(0) items. You should add only until two items.').translate()
		}

	,	MISSING_DRAWER_CONFIGURATION: {
			message: _('SCIS STORE SAFE ACCOUNT and SCIS CASH DRAWER DIFFERENCE fields are not configured for the current location. An administrator must make this change.').translate()
		}

	,	INVALID_STARTING_CASH: {
			message: _('Starting cash must be a positive number greather than cero.').translate()
		}

	,	CASH_DRAWER_IS_BEIGN_USED: {
			message: _('This cash drawer is being used by:  $(0), please select a diferent one.').translate()
		}

	//***** END SCIS ERROR *****

	};

});
