import { useState } from "react";
import { Table, Button } from "semantic-ui-react"
import campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from '../routes';

const RequestRow = ({ request, id, approversCount, address }) => {

  const [loading, setLoading] = useState({
    approve: false,
    finalize: false
  });

  const { Cell, Row } = Table;
  const { description, recipient, value, approvalCount, complete } = request;
  const amount = web3.utils.fromWei(value,'ether');
  const readyToFinalize = approvalCount > (approversCount/2);

  const approbeRequest = async() => {
    setLoading({...loading, approve: true});
    const accounts = await web3.eth.getAccounts();
    await campaign(address).methods.approbeRequest(id).send({
      from: accounts[0]
    })
    setLoading({...loading, approve: false});
    Router.replaceRoute(`/campaigns/${ address }/requests`)
  }

  const onFinalize = async() => {
    setLoading({...loading, finalize: true});
    const accounts = await web3.eth.getAccounts();
    await campaign(address).methods.finalizeRequest(id).send({
      from: accounts[0]
    })
    setLoading({...loading, finalize: true});
    Router.replaceRoute(`/campaigns/${ address }/requests`)
  }

  return (
    <Row 
      disabled={ complete } 
      positive={readyToFinalize && !complete}
    >
      <Cell>{ id }</Cell>
      <Cell>{ description }</Cell>
      <Cell>{ amount }</Cell>
      <Cell>{ recipient }</Cell>
      <Cell>{ approvalCount }/{ approversCount }</Cell>
      <Cell>
        { 
           !complete &&(
            <Button 
              color="green"
              basic
              loading={ loading.approve }
              onClick={ approbeRequest }
            >
              Approve
            </Button>
           )
        }
       
      </Cell>

      <Cell>
        {
          !complete && (
            <Button 
              color="teal"
              basic
              loading={ loading.finalize }
              onClick={ onFinalize }
              disabled={ !readyToFinalize }
            >
              Finalize
            </Button>
            )
        }
          
      </Cell>
    </Row>
  )
}

export default RequestRow