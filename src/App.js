import FormWizard from './components/FormWizard';

const {Container} = window.ReactBootstrap;

class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Container className="p-3">
                <FormWizard />
            </Container>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
