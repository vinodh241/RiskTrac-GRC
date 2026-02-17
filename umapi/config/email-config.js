/**
 * environment Name Value can be
 * QA   = For Secureyes domain
 * PROD = For Production domain
 */
const ENVIRONMENT_NAME = {
    envName : "QA"
} 
  
  // irrespective of the env use MAIL_CONFIG and SENDER_CONFIG for the configurations for all the env's
const MAIL_CONFIG = {
  host    : "smtp.office365.com",
  port    : 587,
  secure  : false,
  auth  : {
            user  : "risktrac@secureyes.net",
            pass  : "oS6WSH4DuHoD7Su5XxcMAEkUEXcndG0x/YPpRdkBs1FfDOQPY5E+DcGPHE0jy9+n031iM8E6lYF7ssi3CgaryZZqfuatiTBvCWjZ9o9VIV9hAj3qYlLfYtJsiQ12VVwd2CKWm/ThhKJBX6w66WP6YsZgxmL7a/qSbaanLgFiAwUlhlQyLH9yoLcxotCfpGc3Bk/z+Z+NkGstpUU6o9H9TGYDxUs1DytC2ovCyTCeMLRfoOnZNtcGR/mqfD832ULPiOUnL5dhfe4FlzIzVqHwXTLktsu4DTrbMBWxakcT2bv6q2ce9ZfgGcZmfL1XDvxd1H51cE+EwTKA+ci2inhItrJJvFZH9W62RCJ3eq8iCPgKfHyjfvmqg/Db67xQSHKaUvB5Xj96Xyq/ZUDtmyxGs9Rq2a0LkVJ0/YMi5kZXt0coOcgcZ5p6H65idlW4072UQvkT4ELm9L6jW8HOy4h0HOpTBLPpnx7aBaMmifNZj0/vLsSAoTX7BiwMLHRJ+fj8DlXvhv9pXkQUK7T2Mo4ey15sjQ+Q6XYoPNj8qO4T1/hrBB2zZBdGAt+gKvvLqOCE8hIJpOHVrV+tb2D18+MCnWJuLFwniQxDAP6740gK7Cwkad8A0/v2Lc64sN2JMKROzFD86NMj3MpJm9dEtyWIpfhu0CXToc8A7FT/DLBStMk="
  }  
};

const SENDER_CONFIG = {
  senderEmail : "risktrac@secureyes.net",
  senderName  : "RiskTrac"
}
  
  
  /**
  *  Exporting contains of file
  */
  module.exports = {
    MAIL_CONFIG         : MAIL_CONFIG,
    SENDER_CONFIG       : SENDER_CONFIG,
    ENVIRONMENT_NAME    : ENVIRONMENT_NAME
  };