/**
 * environment Name Value can be
 * QA   = For Secureyes domain
 * PROD = For Production domain
 */
const ENVIRONMENT_NAME = {
  envName : "QA"
}

const IS_SEND_EMAIL = true;


/**
 * Email config for QA env
 */
const QA_MAIL_CONFIG = {
  host    : "smtp.office365.com",
  port    : 587,
  secure  : false,
  auth  : {
            user  : "risktrac@secureyes.net",
            pass  : "Vc68amm1ZvPWOAScrccfXc9jOOlNSEptLvxrInEm1+T/tLSUU91EwPIYZ+o9HFScVSV6RyMVE3fc8i45+L8Xjc4yyLpNlMmEfD/c5rK2khnP1peW5qz7WnrQ/D3Hnvrar7R8KX6HifpMbgQ2Rtss+OGyVRlwTT8uAQ+6e8ajJ5+FSgBbJM+PEkJzvmGdpjKgghlpV0YjLh9QRd10xl5OpWa9WgyqKNE9atwIJCQilhhLhiBACY7c1eH4OkkTsVbu3roaxXb7jA1uWykPkW5KatDiTpSez3PaMnKQlcv72x64RZAPhvEWWpcWlBnaRFYLtWodarzj6FDlHG0H4Q6ynpjTA8aoS18Fp2/P7LXqwOfjYVGgKAjtxyzBNoOkDZGqZlXT0gn81xJwQQXpGPd+COgUqq5wWlGFwwg1T9pmLSJRXzLgQ4MugEsUl/o+i6rUrUOL2KBlZfmZJhTqeB6RxakUtfURjfyEU+8DEocHIBUkYoaZP+F92lRBXEX950/Syu9urCFQs8Mddh76ALDsUGzC18e0/BBli30kmNZNSP6nDYBSG7RdAx3woGV+A+e+nczgTo1CTNyJByWT6dF4FzzLROHxAS/w6MrdY71jzoQk+9TLrU7u2zfWaEfLPpQFkfEiwWrWqLHVhzB829SgY/mMbplimHrGNhiPUttNKjo="
            
  }
};

const QA_SENDER_CONFIG = {
  senderEmail : "risktrac@secureyes.net",
  senderName  : "RiskTrac"
}

/**
 * Email config for QA env
 */
const PROD_MAIL_CONFIG = {
  host    : "mail.amlakint-dev.com",
  port    : 465,
  secure  : true,
  auth  : {
            user  : "opssecureyesalert@amlakint-dev.com",           
            pass  : "lNdwNMBClFL4E4XVDTCxTgU/eAql/V9lWi2PIg2AKguL198cy9594Dc6Pav97vLVE5/eHijoQk82gm9mMTCN1Kg6v1GANR4CN+4dzsjDgW63sGEEN6kwttpobCE6PF0BzE3ahaeT87gMWZaGBEmUWMGO5bBWD6NuSKoQYh6qskbTETvplqG0cpnxqoTNQC+bW7CmvNcCu4EUoRJCCGT/4ixttMAWoh1jAUt4KU+5b8oFhtP2nS2rZd6AN+hlusFyXgwNAYMhIkLvNChIjB/7DLcm69soCNXykyqcoO17QUa5G0GUeoRHT8z360dgLO9LlGSb6RgWFm91kK1IUhbGnqJuOccSr0EPnp1fiOkpFajLXgxeyH7+VD39Ms4IRZV1MZomQ7zaZBQ8PTtoNA+AguvSZz5OMCL2t1u1z23sYb0YdGoRAYxqkjjRzBXBaT1nUp6pQUaUa0ttviYdaHeekF6q6mzh3RZn0Gd1sSs8gxqklapLYAh3iQgvzg1Ru8zL3K8ndsrc/on48phz6YtRBwgA2tabV+Ewe9tiSUcwvNzyBoumvsMJePxWXFsUvvOiiFokZQJ6d61VUyskbRY2Oz1IyNgWiiY+NJpWa09NgWycFbkWj0bai6T8cZZVyP3iCNTobmqYLzIdsQOQrnftaROzoCYLetTT4qOnszE3nGc="
  }
};

const PROD_SENDER_CONFIG = {
  senderEmail : "opssecureyesalert@amlakint-dev.com",
  senderName  : "RiskTrac"
}

/**
*  Exporting contains of file
*/
module.exports = {
  IS_SEND_EMAIL       : IS_SEND_EMAIL,
  QA_MAIL_CONFIG      : QA_MAIL_CONFIG,  
  QA_SENDER_CONFIG    : QA_SENDER_CONFIG,
  PROD_MAIL_CONFIG    : PROD_MAIL_CONFIG,  
  PROD_SENDER_CONFIG  : PROD_SENDER_CONFIG,
  ENVIRONMENT_NAME    : ENVIRONMENT_NAME
};