/**
 * environment Name Value can be
 * QA   = For Secureyes domain
 * PROD = For Production domain
 */
const ENVIRONMENT_NAME = {
  envName : "QA"
}


/**
 * Email config for QA env
 */
const QA_MAIL_CONFIG = {
  host    : "smtp.office365.com",
  port    : 587,
  secure  : false,
  auth  : {
            user  : "risktrac@secureyes.net",
            pass  : "UI2mqga8C31ZUbj5WxIOTBkz027y0w6jYa54Ad2QV0YGLlFWVAF2yja4/NFGkErvg3OLDqZ0J4IbgyhWwgYPK4/vwAuWQjFnNVy5f8LzzMx1K8tbWJvUHySpPNdgijbFSII66Cv/t5CNK318jhLdflHrxOT2N0cCcooP7q/V/7KhMpCb/UrEHc61VD1vr23FiYx2zE7OtwQzFaQGcjfnlFc3w1cd717IUKTUs6UbFHCIUTLDu3txYTsLc+mHEAOc1Q+1/xwPy9dooUlmy7DbRI/vkrc97QhmYHFEBJHcTQO0aOtmlzyr8d4qgKdbSPwjUo5AA7NM1DEC2a41j3qm3H1GJt5NJ7LQVhIO5SvS5U2DPFdoMj1XVeIOTvQHF0tPG2YuvougeUupHOJKN9o8QTgsz8zXczWdvoi4x++z1bowZR05hM0fElhhAlyTaYYMkBCZIe8ZMmkhENzZdV+wH+jnWVkG4Ljxozwuow+yUL8bwPtTDzQrMIdD4RfM8va/CvNHCcEjRtl8xGyKFiteG2LtzHtkTmefSvOK4pUbX6slbhLhsApTnHEOWnvzRw9fGLapvpYcWlGCgyPedk7TeCMX0sDKl09lI9oA/sS0R5SXjgppZLus843H2HbaW4Z5vtz63CDcK6xW8kq0CCALZgPvZ4Fqi5y9iSjZONIXXLU="
            
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
  QA_MAIL_CONFIG      : QA_MAIL_CONFIG,  
  QA_SENDER_CONFIG    : QA_SENDER_CONFIG,
  PROD_MAIL_CONFIG    : PROD_MAIL_CONFIG,  
  PROD_SENDER_CONFIG  : PROD_SENDER_CONFIG,
  ENVIRONMENT_NAME    : ENVIRONMENT_NAME
};