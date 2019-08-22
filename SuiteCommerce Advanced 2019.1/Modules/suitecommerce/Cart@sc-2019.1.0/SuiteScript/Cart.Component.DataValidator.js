/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart.Component.DataValidator'
,	function ()
{
	'use strict';

	var new_line_schema = {
			required: true
		,	type: 'object'
		,	properties: {
				internalid: {
					type: 'string'
				}
			,	quantity: {
					required: true
				,	type: 'number'
				}
			,	item: {
					required: true
				,	type: 'object'
				,	properties: {
						internalid: {
							required: true
						,	type: 'number'
						}
					,	itemtype: {
							required: true
						,	type: 'string'
						}
					}
				}
			,	options: {
					type: 'array'
				,	items: {
						type: 'object'
					,	properties: {
							cartOptionId: {
								required: true
							,	type: 'string'
							}
						,	value: {
								required: true
							,	type: 'object'
							,	properties: {
									internalid: {
										required: true
									,	type: 'string'
									}
								}
							}
						}
					}
				}
			,	shipaddress: {
					type: 'string'
				}
			,	shipmethod: {
					type: 'string'
				}
			,	amount: {
					type: 'number'
				}
			,	note: {
					type: 'string'
				}
			}
		};
	
	var edit_line_schema = {
			required: true
		,	type: 'object'
		,	properties: {
				internalid: {
					required: true
				,	type: 'string'
				}
			,	quantity: {
					required: true
				,	type: 'number'
				}
			,	item: {
					required: true
				,	type: 'object'
				,	properties: {
						internalid: {
							required: true
						,	type: 'number'
						}
					}
				}
			,	options: {
					type: 'array'
				,	items: {
						type: 'object'
					,	properties: {
							cartOptionId: {
								required: true
							,	type: 'string'
							}
						,	value: {
								required: true
							,	type: 'object'
							,	properties: {
									internalid: {
										required: true
									,	type: 'string'
									}
								}
							}
						}
					}
				}
			,	shipaddress: {
					type: 'string'
				}
			,	shipmethod: {
					type: 'string'
				}
			,	amount: {
					type: 'number'
				}
			,	note: {
					type: 'string'
				}
			}
		};
	
	var paymentMethodSchema = {
			required: true
		,	type: 'object'
		,	properties: {
				internalid: {
					required: false
				,	type: 'string'
				}
			,	type: {
					required: true
				,	type: 'string'
				,	enum: [
						'creditcard'
					,	'invoice'
					,	'paypal'
					,	'giftcertificate'
					,	'external_checkout'
					]
				}
			,	creditcard: {
					required: false
				,	type: 'object'
				,	properties: {
						ccnumber: {
							required: true
						,	type: 'string'
						}
					,	ccname: {
							required: true
						,	type: 'string'
						}
					,	ccexpiredate: {
							required: true
						,	type: 'string'
						}
					,	expmonth: {
							required: true
						,	type: 'string'
						}
					,	expyear: {
							required: true
						,	type: 'string'
						}
					,	ccsecuritycode: {
							required: false
						,	type: 'string'
						}
					,	paymentmethod: {
							required: true
						,	type: 'object'
						,	properties: {
								internalid: {
									required: false
								,	type: 'string'
								}
							,	name: {
									required: true
								,	type: 'string'
								}
							,	creditcard: {
									required: true
								,	type: 'string'
								}
							,	ispaypal: {
									required: true
								,	type: 'string'
								}
							,	key: {
									required: true
								,	type: 'string'
								}
							}
						}
					}
				}
			,	key: {
					required: false
				,	type: 'string'
				}
			,	thankyouurl: {
					required: false
				,	type: 'string'
				}
			,	errorurl: {
					required: false
				,	type: 'string'
				}
			,	giftcertificate: {
					required: false
				,	type: 'object'
				,	properties: {
						code: {
							required: true
						,	type: 'string'
						}
					}
				}
			}
	};
	
	return {
		newLineSchema: new_line_schema
	,	editLineSchema: edit_line_schema
	,	paymentMethodSchema: paymentMethodSchema
	};

});