import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";
import campaign from "../../../ethereum/campaign";
import { Link } from '../../../routes';

const RequestIndex = ({ address, requests, requestCount, approversCount }) => {

  const {
    Header,
    Row,
    HeaderCell,
    Body,
  } = Table;

  const renderRow = () => {

    return requests.map((request, index) => (
      <RequestRow 
        request={ request }
        key={ index }
        address={ address }
        id={ index }
        approversCount={ approversCount }
      />
    ))
  }

  return (
    <Layout>
      <h3>Request List</h3>
      <Link legacyBehavior route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button 
            primary 
            floated="right"
            style={{ marginBottom: 10 }}
          >
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          { renderRow() }
        </Body>
      </Table>
      
      <div>Found { requestCount } requests</div>
    </Layout>
  )
}

RequestIndex.getInitialProps = async (props) => {
  const { address }    = props.query;
  const requestCount   = await campaign(address).methods.getRequestCount().call();
  const approversCount = await campaign(address).methods.approversCount().call();

  const requests = await Promise.all(
    Array(+requestCount)
      .fill()
      .map((_, index) => {
        return campaign(address).methods.requests(index).call()
      })
  )

  return { address, requests, requestCount, approversCount};
}

export default RequestIndex;