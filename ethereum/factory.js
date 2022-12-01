import web3 from "./web3";
import compiled from './build/CampaignFactory.json';

/*
    Se le indica a web 3 la estructura de nuestro contrato desplegado: 
    métodos, variables, etc. Esta info se saca al desplegar nuestro
    contrato en la red de prueba, en mi caso Sepolia. 

    con esto ya podremos conectar ccon nuestro contrato desde 
    nuestro front-end via web3
*/

const address = '0x609bd6F81a3643dcb536C76e8E68d52d5452c27e';
  
export default new web3.eth.Contract(compiled.abi, address);

  