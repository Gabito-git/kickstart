// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// Si esperamos que un array de data crezca mucho, la mejor solucion
// es cambiarlo por un mapping ( similar a los objetos literales en JS).
// Esto es, por que si se quiere iterar en ese gran arreglo para encontrar
// algún dato en especifico, el llamar la función que haga este proceso 
// costará mucho gas ( ya que se cobra por este tipo de computo ). En cambio,
// para buscar info en un objeto, es mucho mas directo


// El contrato CampaignFactory se encarga de desplear instancias de Campaign.
// Esto se hace para que el pago de la creación de cada campaña esté a cargo
// del usuario ( quien va a ejecutar esta función al darle un click en el front),
// pero que a su vez, este usuario no tenga contacto con el código del contrato
// de la campaña, solo el de la factory
contract CampaignFactory{

    address[] public deployedCampaigns;

    function createCampaign( uint minimum ) public{
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        address campaignAddress = address(newCampaign);
        deployedCampaigns.push( campaignAddress );
    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }

}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping( address => bool ) approvals;
    }

    // request es un listado de peticiones de gasto de dinero
    // por eje: pago a un proveedor, que hace el manager del contrato
    // y queda a la espera de aprobación por parte de los donadores.
    // Esto para prevenir que el dinero se gaste en lo que no es
    uint private numRequests;
    mapping (uint => Request) public requests;

    address public manager;
    uint public minimumContribution;

    // En un mapping no se puede iterar sobre sus keys o values.
    // Si consultamos por una key que existe nos devolverá su value,
    // si no existe, nos devolverá un falsy value del tipo bool en este caso
    mapping( address => bool ) public approvers;

    // Se inicializa en cero automaticamente
    uint public approversCount;
    
    modifier restricted(){
        require( msg.sender == manager, "You're not the manager" );
        _;
    }

    constructor(uint minimum, address _manager){
        manager = _manager;
        minimumContribution = minimum;
    }

    function contribute() public payable{
        require( msg.value > minimumContribution, "Too low contribution" );
        
        approvers[msg.sender] = true;
        approversCount++;
    }

    // Storage se refiere:
    // 1. A si las variables sobreviven a llamado de funciones, por ejemplo,
    //    variables globales. La función la cambia por ejemplo, pero su valor
    //    sigue estando disponible para otras funciones
    // 2. A si los parámetros que se le pasan a una funcion son pasados como
    //    referencia y no como valor. Si se define storage a un parametro de una
    //    función, este se pasa como referencia ( aplica para strings, arrays, structs)
    // Memory se refiere:
    // Lo contrario de storage

    function createRequest(string memory description, uint value, address recipient) 
        public restricted 
    {

        Request storage newRequest = requests[ numRequests ];
        newRequest.description = description;
        newRequest.value       = value;
        newRequest.recipient   = recipient;
        newRequest.complete    = false;
        newRequest.approvalCount = 0;

        numRequests++;
    }

    function approbeRequest(uint index) public{

        // Se marca storage para que apunte al objeto para 
        // poderlo manipular, (referencia)
        Request storage request = requests[ index ];

        // Verifica si es un donador
        require( approvers[ msg.sender ], "You are not a donator" ); 

        // Si lo es, verifica que no haya votado antes en la request
        require( !request.approvals[ msg.sender ], "You already voted on this request" );

        // Si cumple las condiciones, lo marcamos como que aprobó el request
        request.approvals[ msg.sender ] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[ index ];
        require( !request.complete, "The request is already marked as completed" );
        require( request.approvalCount > (approversCount/2  ), "You don't have enough approvers yet" );

        // Envía el dinero al proveedor (recipient) especificado en el request
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ){
        return(
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns(uint) {
        return numRequests;
    }

}