
const assert  = require('assert');
const ganache = require('ganache-cli');
const Web3    = require('web3');
const compiledFactory  = require('../ethereum/build/CampaignFactory.json');
const {abi: campaignAbi } = require('../ethereum/build/Campaign.json');

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach( async() => {
    accounts = await web3.eth.getAccounts();

    // Desplegamos el contrato y obtenemos la instancia para
    // trabajar
    factory = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object})
      .send({ from: accounts[0], gas: '2000000' });


    // llama la función createCampaign para desplegar una instancia
    // // de una campaña
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '2000000'
    });

    // // Una vez desplegada la campaña, obtenemos la dirección
    // // llamando la correspondiente función que se programó en
    // // el contrato
    [ campaignAddress ] = await factory.methods.getDeployedCampaigns().call();

    // // Necesitamos instruir a web3 para poder trabajar con la instancia
    // // de contrato Campaign. Como factory ya la desplegó, esta vez, 
    // // empleamos la ABI y la dirección en la que está desplegado
    campaign = await new web3.eth.Contract(
        campaignAbi,
        campaignAddress
    );

})

describe('Campaigns', () => {

    it('deploys a factory and a campaign', () => {

        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);

    })

    it('marks caller as the campaign manager', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal( accounts[0], manager );
    })

    it('allows people to contribute and marks them as approvers', async() => {

        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        })

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert( isContributor );

    })

    it('requires a minimum contribution', async() => {

        // Debería devolver un error por estar enviando menos
        // que la contribución minuma. Si no envia un error, 
        // se va a ejecutar la linea assert(false) haciendo 
        // fallar la prueba, de lo contrario, ira directo al
        // catch haciendo pasar la prueba
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '0'
            })
            assert(false);
        } catch (error) {
            assert(error)
        }

    })

    it('allowa a manager to make a payment request', async() => {

        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '2000000'
            })
        
        // La primera request se inicia con la llave 0 en el mapping
        const request = await campaign.methods.requests(0).call();

        assert.equal( 'Buy batteries', request.description);
    })

    it('processes requests', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10','ether')
        })

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[2])
            .send({
                from: accounts[0],
                gas: '2000000'
            })

        await campaign.methods.approbeRequest(0).send({
            from:accounts[1],
            gas: '2000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from:accounts[0],
            gas:'2000000'
        })

        let balance = await web3.eth.getBalance( accounts[2] );
        balance = web3.utils.fromWei(balance, 'ether' );
        balance = parseFloat(balance);

        // El balance de las cuentas no se reinicia entre pruebas
        // ( al momento del video no habia forma), pero, se sabe
        // que el gasto de las cuentas ( la de accounts[2] debe ser de cero) 
        // es muy bajo. Por esta razón, si le sumamos los 5 ether
        // del request, la cuenta debería estar por encima de los 104 eth
        console.log(balance);
        assert(balance > 104);
    })

})
