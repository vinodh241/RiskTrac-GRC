const getPublicKey = require("./auth/auth-api-getPublicKey-doc");
const login = require("./auth/auth-api-login-doc");
const getUserDetailsFromAD = require("./user-management/user-management-get-user-details-doc");
const APP_CONFIG_FILE_OBJECT = require("../config/app-config");

var appPortNo = APP_CONFIG_FILE_OBJECT.APP_SERVER.APP_START_PORT;

const apiDocumentation = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Auth Module API Documentation",
    description:
      "This documentation is about the authentication API module documentation.",
    contact: {
      name: "Mohamed Fazil",
      email: "fazil.mohamed@secureyes.net",
    },
  },
  servers: [
    {
      url: `http://localhost:${appPortNo}`,
      description: "Local Server",
    },
  ],
  tags: [
    {
      name: "Auth",
    },
    {
      name: "User Management",
    },
  ],
  paths: {
    "/auth-management/auth/get-Key": {
      post: getPublicKey,
    },
    "/auth-management/auth/login": {
      post: login,
    },
    "/auth-management/user-management/get-user-details-from-ad": {
      post: getUserDetailsFromAD,
    },
  },
};

exports.apiDocumentation = apiDocumentation;
