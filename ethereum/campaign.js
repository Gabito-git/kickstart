import web3 from './web3';
import { abi } from './build/Campaign.json';


// Creamos una instancia de cada campaña

export default (address) => {
    return new web3.eth.Contract(abi, address)
}