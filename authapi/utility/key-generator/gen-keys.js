
const { generateKeyPair } = require('crypto');

certsFolder = "../../config/certs";

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  }
}, (err, publicKey, privateKey) => {
    var fs = require('fs');
	var wstream = fs.createWriteStream(certsFolder + "/public.pem");
	wstream.write(publicKey);
	wstream.end();
    console.log("New Public key generated and saved in file: " + certsFolder+ "/public.pem");
  
	var wstream = fs.createWriteStream(certsFolder + '/private.pem');
	wstream.write(privateKey);
	wstream.end();
	console.log("New Private key generated and saved in file: " + certsFolder+ "/private.pem");
});


