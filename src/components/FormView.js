import FormInput from './FormInput';
const {Form} = window.ReactBootstrap;

// Builds and manages state for a list of form groups that belong to a screen view
// (defined as structure in the config file)
const FormView = ({
        fields,
        keyChange,
        showOptional,
        optionalSelected,
        sectionLabel,
        sectionIndex,
        onFieldChange,
        onOptionalChange,
    }) => {

    let formGroups = [];

    if (showOptional) {
        const labelText = `Add ${sectionLabel}`;
        const view = (
            <Form.Group className="form-group form-optional">
                <Form.Check label={labelText}
                            checked={optionalSelected}
                            onChange={checked => onOptionalChange(sectionIndex, checked)}
                />
            </Form.Group>
        );
        formGroups.push(view);
    }

    // Override the required field setting if this section is optional
    // and the user didn't choose to add the optional information
    if (showOptional && !optionalSelected)
    {
        return formGroups;
    }

    for (let key in fields) {
        const {key, label, required, type, value} = fields[key];

        const newForm = (
            <FormInput
                controlId={key}
                fieldType={type}
                label={label}
                inputValue={value}
                isRequired={required}
                onChange={onFieldChange}
            />
        );
        formGroups.push(newForm);
    }

    return formGroups;
}

export default FormView;

