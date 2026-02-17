const bcrypt = require("bcrypt");
var readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.stdoutMuted = true;

rl.question('Please enter your clear text password: ', 
	function(plaintextPassword) {
		let min = 5;
    let max = 15;
    let saltvalue = Math.floor(Math.random() * (max - min + 1)) + min;
    bcrypt.genSalt(saltvalue, (err, salt) => {
        console.info('\n===============================================================');
        console.info("\n Salt Value is ::",salt)
        console.info('\n===============================================================');
        bcrypt.hash(plaintextPassword, salt, function(err, hash) {
            console.info("\n Hashed Password Value is ::",hash)
            console.info('\n===============================================================');
        console.info('\nPlease copy this Salt and Hashed Password and insert against the User in DB. ');
        });
    })
    rl.close();
	}
);

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted)
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
};