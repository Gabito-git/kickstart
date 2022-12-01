import { Link } from '../../routes';
import { Card, Grid, Button } from "semantic-ui-react"
import ContributeForm from "../../components/ContributeForm"
import Layout from "../../components/Layout"
import Campaign from "../../ethereum/campaign"
import web3 from '../../ethereum/web3'

const CampaignShow = ({
  minimumContribution,
  balance,
  requestCount,
  approversCount,
  manager,
  address
}) => {

  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: minimumContribution,
        meta: 'Minimum contribution (wei)',
        description: 'You must contribute at least this much wei to become an approver'
      },
      {
        header: requestCount,
        meta:'Number of requests',
        description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of approvers',
        description:'Number of people who have donated to this campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta:'Campaign balance (Ether)',
        description: 'How much money this campaign has left to spend'
      }
    ]

    return <Card.Group items={ items }/>
  }

  return (
    <Layout>
      <h3>Campaign Show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            { renderCards() }
            
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={ address } />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link legacyBehavior route={ `/campaigns/${ address }/requests` }>
              <a>
                <Button primary>
                  View Requests
                </Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  )
}

/**
 * Los props de esta función estan disponibles ya que
 * en este proyecto se está usando un manejo de rutas 
 * personalizado (routes.js) el cual se configura en el 
 * lado del server y por eso, le da a esta función (
 * la cual se ejecuta inicialmente en el server) estos
 * props
 */

CampaignShow.getInitialProps = async(props) => {
    const campaign = Campaign(props.query.address);

    // Acá tenemos un objeto litetal
    const summary =  await campaign.methods.getSummary().call();
    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: props.query.address
    }
}

export default CampaignShow