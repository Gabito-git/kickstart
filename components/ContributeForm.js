
import { useState } from "react"
import { Form, Button, Input, Message } from "semantic-ui-react"
import campaign from "../ethereum/campaign";
import web3 from '../ethereum/web3'
import { Router } from '../routes'

const ContributeForm = ({ address }) => {

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const accounts = await web3.eth.getAccounts();
  
      await campaign( address ).methods.contribute().send({
        value: web3.utils.toWei(value, 'ether'),
        from: accounts[0]
      })

      // Luego de hacer la contribución, esta instrucción refresca
      // la página actual lo que hace que se ejecute de nuevo la función
      // getInitialProps del componente CampaingShow ( en el cual se 
      // renderiza este componente) lo que actualiza los valores de la pagina
      
      Router.replaceRoute(`/campaigns/${ address }`);
      
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
    setValue('');
  }

  return (
    <Form onSubmit={ onSubmit } error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input 
          label="ether"
          labelPosition="right"
          value={ value }
          onChange={ (e) => setValue( e.target.value ) }
        />
      </Form.Field>
      <Message 
          error
          header="Ooops!"
          content={ errorMessage  }
      />
      
      <Button 
        primary
        loading={ loading } 
      >
        Contribute
      </Button>
     
    </Form>
  )
}

export default ContributeForm