
import factory from '../ethereum/factory';
import { Card, Button} from 'semantic-ui-react'
import Layout from '../components/Layout';
import { Link } from '../routes';


const CampaignIndex = ({ campaigns }) => {
  
  const renderCampaigns = () => {
    const items = campaigns.map( address => (
      {
        header: address,
        description: (
          <Link legacyBehavior route={ `/campaigns/${ address }` }>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      }
    ) )

    return <Card.Group items={items} />
  }

  return (
    <Layout>
       <div>

        <h3>Open Campaigns</h3>

        <Link legacyBehavior route='/campaigns/new'>
          <a>
            <Button
              floated='right'
              content='Create Campaign'
              icon='add circle'
              primary
            />
          </a>
        </Link>
       
        {renderCampaigns()}
      </div>

    </Layout>
   
  )
}

// Next ejecuta esta función en el server. Acá buscamos hacer
// el fetch de toda la data inicial requerida para mostrar 
// nuestro componente. El objeto retornado es pasado a nuestro
// componente como props
CampaignIndex.getInitialProps = async() =>{
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
} 

export default CampaignIndex