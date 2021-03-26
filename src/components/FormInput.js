import {DATE_FORMAT} from '../constants';
const {Form} = window.ReactBootstrap;

export const getInputForType = (fieldType, controlId, inputValue, isRequired, onChangeHandler) => {

    if (fieldType === 'date') {
        const selectedDate = inputValue ? moment(inputValue) : null;
        return (
            <DatePicker
                id={controlId}
                className="form-control"
                selected={selectedDate}
                onChange={newDate => onChangeHandler(controlId, newDate.format(DATE_FORMAT))}
                showMonthDropdown={true}
                showYearDropdown={true}
                dateFormat={DATE_FORMAT}
                required={isRequired}
            />
        );
    } else {
        let formType = "text";
        if (fieldType === 'string') {
            formType = "text";
        } else if (fieldType ==='email') {
            formType = "email";
        } else if (fieldType ==='integer') {
            formType = "number";
        }

        return (
            <Form.Control
                type={formType}
                value={inputValue}
                onChange={event => onChangeHandler(controlId, event.target.value)}
                required={isRequired}
            />
        );
    }
}

const FormInput = ({controlId, fieldType, label, inputValue, isRequired, onChange}) => {

    return (
        <Form.Group className="form-group" controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            {getInputForType(fieldType, controlId, inputValue, isRequired, onChange)}
            {isRequired && (
                <Form.Control.Feedback type="invalid">
                    {label} is required
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
}

export default FormInput;
