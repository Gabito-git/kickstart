
import { useState } from "react"
import { Form, Button, Input, Message } from "semantic-ui-react"
import Layout from "../../../components/Layout"
import campaign from "../../../ethereum/campaign"
import web3 from "../../../ethereum/web3"
import { Link, Router } from '../../../routes'

const RequestNew = ({ address }) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState({
        value:'',
        description:'',
        recipient:''
    })

    const { value, description, recipient } = state;

    const onStateChange = (e) => {
        setState( {
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const accounts = await web3.eth.getAccounts();
    
            await campaign( address ).methods.createRequest(
                description, web3.utils.toWei(value, 'ether'), recipient
            ).send({from: accounts[0]})

            Router.pushRoute(`/campaigns/${ address }/requests`);
        } catch (error) {
            setErrorMessage(error.message);
        }

        setLoading(false);
    }

  return (
    <Layout>
        <Link legacyBehavior route={`/campaigns/${ address }/requests`}>
            <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={ onSubmit } error={!!errorMessage}>
            <Form.Field>
                <label>Description</label>
                 <Input 
                    name="description"
                    value={ description }
                    onChange={ onStateChange }
                />
            </Form.Field>

            <Form.Field>
                <label>Value in Ether</label>
                <Input 
                    name="value"
                    value={ value }
                    onChange={ onStateChange }
                />
            </Form.Field>

            <Form.Field>
                <label>Recipient</label>
                <Input 
                    name="recipient"
                    value={ recipient }
                    onChange={ onStateChange }
                />
            </Form.Field>

            <Message 
                error
                header="Ooops!"
                content={ errorMessage  }
            />

            <Button 
                primary
                loading={!!loading}
            >Create!</Button>
        </Form>
    </Layout>
  )
}

RequestNew.getInitialProps = (props) => {
    const { address } = props.query;

    return { address };
}

export default RequestNew