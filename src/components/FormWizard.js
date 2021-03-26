import {loadUserSchema, saveApplication} from '../api/user';
import {parseObjectProperties} from '../utils';
import FormView from './FormView';
const {Form, Container, Button} = window.ReactBootstrap;

export const initializeForm = (jsonResponse, setViewData, setOptionalSelected) => {
    let views = [];
    let optional = [];

    parseObjectProperties(jsonResponse, initializeView, views);

    for (let i = 0; i < views.length; i++) {
        optional[i] = false;
    }
    // Sort views by screen number
    setViewData(
        views.sort(function(a, b) {
            return a.screen - b.screen;
        }));

    setOptionalSelected(optional);
}

export const initializeView = (obj, structName, views) => {
    let data = {};
    let viewFields = {};


    const {label, screen, fields, required, parent} = obj;
    for (let key in fields) {
        if (fields[key].type && fields[key].type !== 'struct') {
            setFieldFromConfig(viewFields, key, fields[key]);
        }
    }

    data = {
        screen: screen,
        title: label,
        structKey: structName,
        parentKey: parent,
        isRequired: required === true,
        fields: viewFields,
    };

    views.push(data);
};

export const setFieldFromConfig = (fieldStruct, fieldKey, config) => {
    const {type, required, label} = config;
    fieldStruct[fieldKey] = {
        key: fieldKey,
        label: label,
        type: type,
        required: required,
        value: '', // todo: look up initial value from session
    };
}

export const getFormInput = (viewData) => {
    let output = {};
    for (let i = 0; i < viewData.length; i++) {
        const {fields, structKey, parentKey, isRequired} = viewData[i];
        let props = {};
        for (let fieldKey in fields) {
            const {key, value} = fields[fieldKey];
            if (isRequired === false && !value) {
                continue;
            }
            props[key] = value;
        }

        if (isRequired === false && Object.keys(props).length === 0) {
            continue;
        }

        if (parentKey) {
            let parent = output[parentKey];
            parent[structKey] = props;
        } else {
            output[structKey] = props;
        }
    }
    return output;
}

const FormWizard = () => {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [screenNumber, setScreenNumber] = React.useState(0);
    const [viewData, setViewData] = React.useState({});
    const [formFieldChanged, setFormFieldChanged] = React.useState('');
    const [optionalSelected, setOptionalSelected] = React.useState([]);
    const [validated, setValidated] = React.useState(false);
    const maxScreens = viewData.length;

    const formSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {
            setValidated(true);
        } else {
            const formData = getFormInput(viewData);
            // console.log(`Form data: ${JSON.stringify(formData)}`);
            saveApplication(formData)
                .then(response => {
                    console.log(response);
                    setValidated(false);
                })
                .then(
                    (result) => {
                        // reload the form
                        setIsLoaded(false);
                    },
                    (error) => {
                        alert(`Error with submission: ${error}`);
                    }
                );
        }

    }

    const onFieldChange = (key, value) => {
        viewData[screenNumber].fields[key].value = value;
        setViewData(viewData);
        setFormFieldChanged(value);
    }

    const changeScreen = (action) => {
        let nextScreen = screenNumber;

        if (action === 'next') {
            if (screenNumber < maxScreens - 1) {
                nextScreen = screenNumber + 1;
                setScreenNumber(nextScreen);
            }
        } else if (action === 'previous') {
            if (screenNumber > 0) {
                nextScreen = screenNumber - 1;
                setScreenNumber(nextScreen);
            }
        }
    }

    const handleOptionalChange = (index, control) => {
        optionalSelected[index] = control.target.checked;
        setOptionalSelected(optionalSelected);
        setFormFieldChanged(control.target.checked);
    }

    React.useEffect(() => {

        if (!isLoaded) {
            loadUserSchema()
                .then(data => {
                    initializeForm(data, setViewData, setOptionalSelected);
                })
                .then(
                    (result) => {
                        setIsLoaded(true);
                    },
                    (error) => {
                        setIsLoaded(false);
                        setError(error);
                    }
                );
        }
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {

        const {title} = viewData[screenNumber];
        const prevDisabled = screenNumber === 0;
        const nextDisabled = screenNumber === viewData.length - 1;

        return (
            <Container>
                <h1>{title}</h1>
                <Form noValidate validated={validated} className="form-container" onSubmit={formSubmit}>
                    <div className="form-view">
                        {
                            viewData.map((view, index) => {
                                const {title, isRequired, fields} = view;

                                // Hide sections that are not in the currently selected screen
                                const displayClass = screenNumber === index ? 'form-section' : 'form-section hidden';

                                return (
                                    <div key={index} className={displayClass}>
                                        <FormView
                                            fields={fields}
                                            keyChange={formFieldChanged}
                                            showOptional={isRequired === false}
                                            onFieldChange={onFieldChange}
                                            sectionLabel={title}
                                            sectionIndex={index}
                                            optionalSelected={optionalSelected[index]}
                                            onOptionalChange={handleOptionalChange}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="pt-3">
                        <Button variant="secondary" disabled={prevDisabled} onClick={() => changeScreen('previous')}>
                            Previous
                        </Button>{' '}
                        <Button variant="secondary" disabled={nextDisabled} onClick={() => changeScreen('next')}>
                            Next
                        </Button>{' '}
                        <Button type="submit" variant="primary">Submit</Button>
                    </div>
                </Form>
            </Container>
        );
    }
}

export default FormWizard;
