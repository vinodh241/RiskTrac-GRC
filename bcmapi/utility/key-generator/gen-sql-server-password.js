
var readline			= require('readline');
var fs					= require('fs');
var publicKey			= fs.readFileSync("../../config/certs/public.pem", "utf8"); 
const jsEncryptLibObj	= require('node-jsencrypt');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.stdoutMuted = true;

rl.question('Please enter your SQL server password: ', 
	function(dbPwd) {
	  
		var enCryptionObj = new jsEncryptLibObj();	// Creating js encryption object.
		enCryptionObj.setPrivateKey(publicKey); 
		console.log('\nEncrypted Password is:');
		console.log('\n===============================================================');
		console.log(enCryptionObj.encrypt(dbPwd));
		console.log('===============================================================');
		console.log('\nPlease copy and paste this encrypted text as password field in /config/dbConfig.js'); 
		rl.close();
	}
);

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted)
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
};

