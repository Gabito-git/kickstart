const path = require('path');
const solc = require('solc');

/**
 * Si se compara este archivo con el de compile.js en el proyecto
 * lottery, se ve que en este, no se exporta el resultado de la 
 * compilación sino que se escribe en dos archivos ( uno por cada 
 * contrato que contiene el archivo Campaign.sol). 
 * La idea es que solo se tenga que compilar el contrato una vez 
 * y usar su resultado las veces que se requiera, por ejemplo, 
 * en las pruebas.
 * 
 * En la forma anterior, cada que se corria una prueba, se 
 * recompilaba el contrato
 */

// Tiene algunas funciones extra al modulo nativo fs
const fs = require('fs-extra');


// Inicialmente, eliminamos el directorio build
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync( buildPath );

// Se lee el contenido del contrato y se extrae el codigo fuente
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// Compilamos el contrato
const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
        content: source,
        }
    },
    settings: {
        outputSelection: {
        '*': {
            '*': ['*'],
        },
     },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'Campaign.sol'
  ];

// Reconstruimos el directorio build
fs.ensureDirSync( buildPath );

// Generamos los archivos compilados
for(let contract in output){
    fs.outputJSONSync(
        path.resolve(buildPath, contract + '.json'),
        output[ contract ]
    )
}


