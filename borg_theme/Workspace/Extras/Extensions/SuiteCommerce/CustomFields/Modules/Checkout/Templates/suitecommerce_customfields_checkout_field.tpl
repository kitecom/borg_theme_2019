<!-- htmllint spec-char-escape="false" -->
<div
  id="custom-fields-checkout-{{fieldId}}"
  class="custom-fields-checkout-field"
  data-type="{{type}}"
  data-validation="control-group">
  {{#if isHeading}}
    <h3 class="custom-fields-checkout-field-heading">{{label}}</h3>
  {{else}}
    {{#if isCheckbox}}
      {{> checkboxField}}
    {{else}}
      {{> inputFieldLabel}}
      <div class="custom-fields-checkout-field-control">
        {{#if isTextArea}}
          {{> inputTextAreaField}}
        {{else}}
          {{#if isDate}}
            {{> inputDateField}}
          {{else}}
            {{> inputTextField}}
          {{/if}}
        {{/if}}
      </div>
    {{/if}}
  {{/if}}
</div>
<!-- htmllint spec-char-escape="true" -->

<!-- htmllint id-no-dup="false" -->
{{#*inline "checkboxField"}}
  <div class="custom-fields-checkout-field-checkbox">
    <input
      id="custom_field_{{fieldId}}"
      class="custom-fields-checkout-field-input-checkbox"
      type="checkbox"
      name="{{fieldId}}"
      data-validation="control">
    <label class="custom-fields-checkout-field-label-checkbox" for="custom_field_{{fieldId}}">
      {{label}}
    </label>
  </div>
{{/inline}}

{{#*inline "inputFieldLabel"}}
  <label for="custom_field_{{fieldId}}" class="custom-fields-checkout-field-label">
    {{label}}
    {{#if isMandatory}}
      <span class="custom-fields-checkout-field-label-required">*</span>
    {{/if}}
  </label>
{{/inline}}

{{#*inline "inputTextAreaField"}}
  <textarea
    id="custom_field_{{fieldId}}"
    class="custom-fields-checkout-field-input-textarea"
    name="{{fieldId}}"
    placeholder="{{placeholder}}"
    {{#if isMandatory}}required{{/if}}
    data-validation="control"
    maxlength="{{maxLength}}">
  </textarea>
{{/inline}}

{{#*inline "inputDateField"}}
  <input
    id="custom_field_{{fieldId}}"
    class="custom-fields-checkout-field-input-date"
    type="date"
    name="{{fieldId}}"
    placeholder="{{placeholder}}"
    {{#if isMandatory}}required{{/if}}
    data-validation="control"
    data-field-type="date"
    data-format="yyyy-mm-dd">
{{/inline}}

{{#*inline "inputTextField"}}
  <input
    id="custom_field_{{fieldId}}"
    class="custom-fields-checkout-field-input-text"
    type="text"
    name="{{fieldId}}"
    placeholder="{{placeholder}}"
    {{#if isMandatory}}required{{/if}}
    data-validation="control"
    maxlength="{{maxLength}}">
{{/inline}}
<!-- htmllint id-no-dup="true" -->
