var siteID = 2 // change to the site id you want to use
,   has_product_reviews = false
,   has_store_pickup = false
,   siteRecord = nlapiLoadRecord('website', siteID);
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'Search');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'search');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var search_fields = 'urlcomponent,itemimages_detail,itemoptions_detail,internalid,matrixchilditems_detail,onlinecustomerprice,onlinecustomerprice_detail,onlinecustomerprice_formatted,onlinematrixpricerange,onlinematrixpricerange_formatted,quantityavailable,displayname,itemid,outofstockbehavior,outofstockmessage,stockdescription,storedescription,storedisplaythumbnail,storedisplayname2,isinstock,isbackorderable,ispurchasable,showoutofstockmessage';
if(has_product_reviews)
{
    search_fields += ',custitem_ns_pr_count,custitem_ns_pr_rating';
}
if(has_store_pickup)
{
    search_fields += ',isstorepickupallowed,isfulfillable';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', search_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'details');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'details');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var details_fields = 'urlcomponent,itemimages_detail,itemoptions_detail,internalid,matrixchilditems_detail,onlinecustomerprice_detail,quantityavailable,displayname,itemtype,itemid,outofstockbehavior,outofstockmessage,pagetitle,rate,rate_formatted,relateditemsdescription,stockdescription,storedetaileddescription,storedisplayimage,storedisplayname2,isinstock,isbackorderable,ispurchasable,showoutofstockmessage,metataghtml,minimumquantity,maximumquantity';
if(has_product_reviews)
{
    details_fields += ',custitem_ns_pr_count,custitem_ns_pr_rating,custitem_ns_pr_item_attributes,custitem_ns_pr_rating_by_rate';
}
if(has_store_pickup)
{
    details_fields += ',isfulfillable,isstorepickupallowed,quantityavailableforstorepickup_detail';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', details_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'matrixchilditems');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'matrixchilditems');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var matrix_fields = 'onlinecustomerprice_detail,internalid,quantityavailable,outofstockbehavior,outofstockmessage,stockdescription,isinstock,isbackorderable,ispurchasable,showoutofstockmessage,itemid,minimumquantity,maximumquantity,itemtype';
if(has_store_pickup)
{
    matrix_fields += ',isfulfillable,isstorepickupallowed,quantityavailableforstorepickup_detail';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', matrix_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'matrixchilditems_search');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'matrixchilditems_search');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var matrix_fields = 'onlinecustomerprice_detail,internalid,outofstockbehavior,outofstockmessage,stockdescription,isinstock,isbackorderable,ispurchasable,showoutofstockmessage,itemid,minimumquantity,maximumquantity,itemtype';
if(has_store_pickup)
{
    matrix_fields += ',isfulfillable,isstorepickupallowed,quantityavailableforstorepickup_detail';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', matrix_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'Correlated Items');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'correlateditems');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var correlated_fields = 'urlcomponent,itemimages_detail,itemoptions_detail,internalid,onlinecustomerprice,onlinecustomerprice_detail,onlinecustomerprice_formatted,onlinematrixpricerange,onlinematrixpricerange_formatted,quantityavailable,displayname,itemid,outofstockbehavior,outofstockmessage,stockdescription,storedescription,storedisplaythumbnail,storedisplayname2,isinstock,isbackorderable,ispurchasable,showoutofstockmessage';
if(has_product_reviews)
{
    correlated_fields += ',custitem_ns_pr_count,custitem_ns_pr_rating';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', correlated_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'Related Items');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'relateditems');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var related_fields = 'urlcomponent,itemimages_detail,itemoptions_detail,internalid,onlinecustomerprice,onlinecustomerprice_detail,onlinecustomerprice_formatted,onlinematrixpricerange,onlinematrixpricerange_formatted,quantityavailable,displayname,itemid,outofstockbehavior,outofstockmessage,stockdescription,storedescription,storedisplaythumbnail,storedisplayname2,isinstock,isbackorderable,ispurchasable,showoutofstockmessage';
if(has_product_reviews)
{
    related_fields += ',custitem_ns_pr_count,custitem_ns_pr_rating';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', related_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'Order');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'order');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var order_fields = 'itemimages_detail,itemoptions_detail,onlinecustomerprice_detail,displayname,internalid,itemid,isfulfillable,storedisplayname2,urlcomponent,outofstockmessage,showoutofstockmessage,isinstock,isbackorderable,ispurchasable,pricelevel1,pricelevel1_formatted,stockdescription,matrixchilditems_detail,itemtype,minimumquantity,maximumquantity,isonline,isinactive';
if(has_store_pickup)
{
    order_fields += ',isstorepickupallowed,quantityavailableforstorepickup_detail,isfulfillable';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', order_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'Type Ahead');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'typeahead');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var typeahead_fields = 'itemid,displayname,storedisplayname2,urlcomponent,itemimages_detail';
if(has_product_reviews)
{
    typeahead_fields += ',custitem_ns_pr_count,custitem_ns_pr_rating';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', typeahead_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'Items Searcher');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'itemssearcher');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
var items_searcher_fields = 'itemimages_detail,displayname,itemid,storedisplayname2,urlcomponent,minimumquantity,maximumquantity,itemoptions_detail,matrixchilditems_detail,isinstock,showoutofstockmessage,outofstockmessage,onlinecustomerprice_detail,pricelevel1,pricelevel1_formatted,itemtype,ispurchasable,isbackorderable';
if(has_product_reviews)
{
    items_searcher_fields += ',custitem_ns_pr_count,custitem_ns_pr_rating';
}
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', items_searcher_fields);
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'Related Items Details');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'relateditems_details');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', 'relateditems_detail');
siteRecord.commitLineItem('fieldset');
siteRecord.selectNewLineItem('fieldset');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', 'Correlated Items Details');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', 'correlateditems_details');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', 'correlateditems_detail');
siteRecord.commitLineItem('fieldset');
recId = nlapiSubmitRecord(siteRecord);