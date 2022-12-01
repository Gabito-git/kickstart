import { useState } from "react"
import { Form, Button, Input, Message } from "semantic-ui-react"
import Layout from "../../components/Layout"
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import { Router } from '../../routes'

const CampaignNew = () => {

    const [minimum, setMinimum] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);


    const onSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const accounts = await web3.eth.getAccounts();

            // El gas es calculado por Metamask
            await factory.methods.createCampaign( minimum ).send({
                from: accounts[0]
            }) 

            Router.pushRoute('/');
        } catch (error) {
            setErrorMessage(error.message);
        }

        setLoading(false);

    }

  return (
    <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Minimum Contribution</label>
                <Input
                    label="wei"
                    labelPosition="right" 
                    value={ minimum }
                    onChange={ (e) => setMinimum(e.target.value) }
                />
            </Form.Field>

            <Message 
                error
                header="Ooops!"
                content={ errorMessage  }
            />
            <Button 
                loading={ loading } 
                primary
            >Create!</Button>
        </Form>
    </Layout>
  )
}

export default CampaignNew