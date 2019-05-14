/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/**
 * The CMSComponent lets you work with Site Management Tools. Use this component to register a new custom content type at application startup. See {@link CustomContentTypeBaseView}. Get an instance of this component by calling `container.getComponent("CMS")`.
 * @extends BaseComponent
 * @hideconstructor
 * @global
 */
class CMSComponent extends BaseComponent {
    /**
     * Registers a new custom content type in the application.
     * @param {RegisterCustomContentType} cct 
     */
    registerCustomContentType (cct)
    {
        return null
    }
}

/**
 * @typedef {Object} RegisterCustomContentType
 * @property {String} id The ID of the CCT to be registered. IDs must be unique per account/domain. 
 * @property {typeof CustomContentTypeBaseView} The View class that implements the CCT.
 */