// Auth Imports
const getPublicKey = require("./auth/auth-api-getPublicKey-doc");
const logout = require("./auth/auth-api-logout-doc");
const login = require("./auth/auth-api-login-doc");
const getUserDetails = require("./auth/auth-api-get-all-accounts-name-doc");
const verifyUserDetails = require("./auth/auth-api-verify-user-details-doc")
const verifyAccountDetails = require("./auth/auth-api-verify-account-details-doc")
const sendOtpForForgotPassword = require("./auth/auth-api-send-otp-for-forgot-password-doc")
const verifyOtpForForgotPassword = require("./auth/auth-api-verify-otp-for-forgot-password-doc")
const sendOtpForLogin = require("./auth/auth-api-send-otp-for-login-doc")
const changePassword = require("./auth/auth-api-change-password-doc")
const getPasswordHistoryData = require("./auth/auth-api-get-password-history-data-doc")
const sendOTPForChangePassword = require("./auth/auth-api-send-otp-for-change-password-doc")
const changePasswordUser = require("./auth/auth-api-change-password-user-doc")
const verifyOtpForLogin = require("./auth/auth-api-verify-otp-for-login-doc")
const getUserDetailsByName = require("./auth/auth-api-get-user-details-by-name-doc")

// User Management Imports
const getUserDetailsFromAd = require("./user-management/user-management-api-get-user-details-from-ad-doc")
const getUsers = require("./user-management/user-management-api-get-users-doc")
const deleteUser = require("./user-management/user-management-api-delete-users-doc")
const getAssignedUserInfo = require("./user-management/user-management-api-get-assigned-user-info-doc")
const addAssignedUser = require("./user-management/user-management-api-add-assigned-user-doc")
const enableDisableUser = require("./user-management/user-management-api-enable-disable-user-doc")
const resetPassword = require("./user-management/user-management-api-reset-password-doc")


//PORT NO info
const APP_CONFIG_FILE_OBJECT = require("../config/app-config");

var appPortNo = APP_CONFIG_FILE_OBJECT.APP_SERVER.APP_START_PORT;

const apiDocumentation = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "User Management Module API Documentation",
        description:
            "This documentation is about User Management API module documentation. Here, You will find the all endpoint's detailed explanation, required input parameters, and response samples. ",
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
        // Auth Routes
        "/user-management/auth/logout": {
            post: logout
        },
        "/user-management/auth/get-key": {
            post: getPublicKey
        },
        "/user-management/auth/login": {
            post: login
        },
        "/user-management/auth/get-All-Accounts-Name": {
            get: getUserDetails,
        },
        "/user-management/auth/verify-account-details": {
            post: verifyAccountDetails,
        },
        "/user-management/auth/verify-user-details": {
            post: verifyUserDetails,
        },
        "/user-management/auth/send-otp-for-forgot-password": {
            post: sendOtpForForgotPassword,
        },
        "/user-management/auth/verify-OTP-for-forgot-password": {
            post: verifyOtpForForgotPassword,
        },
        "/user-management/auth/send-otp-for-login": {
            post: sendOtpForLogin,
        },
        "/user-management/auth/change-password": {
            post: changePassword,
        },
        "/user-management/auth/get-password-history-data": {
            post: getPasswordHistoryData,
        },
        "/user-management/auth/send-otp-for-change-password": {
            post: sendOTPForChangePassword,
        },
        "/user-management/auth/change-password-user": {
            post: changePasswordUser,
        },
        "/user-management/auth/verify-OTP-for-login": {
            post: verifyOtpForLogin,
        },
        "/user-management/auth/get-user-details-by-name": {
            post: getUserDetailsByName,
        },

        // User Management Routes
        "/user-management/user-management/get-user-details-from-ad": {
            post: getUserDetailsFromAd,
        },
        "/user-management/user-management/get-users": {
            post: getUsers,
        },
        "/user-management/user-management/delete-user": {
            post: deleteUser,
        },
        "/user-management/user-management/delete-user": {
            post: deleteUser,
        },
        "/user-management/user-management/get-assigned-user-info": {
            post: getAssignedUserInfo,
        },
        "/user-management/user-management/add-assign-user": {
            post: addAssignedUser,
        },
        "/user-management/user-management/enable-disable-user": {
            post: enableDisableUser,
        },
        "/user-management/user-management/reset-password": {
            post: resetPassword,
        },

    },
};

exports.apiDocumentation = apiDocumentation;
