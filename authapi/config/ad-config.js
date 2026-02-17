/**
 * AD server (LDAP Server) configurations
 */
const AD_CONFIG = {
    url: 'ldap://secureyesdev.com',            // AD server URL for QA environment
    // url         : 'ldap://192.168.1.49',             // AD server URL for local machine environment by ID
    baseDN: 'dc=secureyesdev,dc=com',             // Base DN and DC
    domainName: 'secureyesdev.com',                   // Domain Name
    username: 'amlakaduser@secureyesdev.com',       // User name for Ad connection
    password: 'GkgB2Q9bc1ZupGJYbYkHoLOuLsonEUyxaaX+lotnUqawBhQgVe0FKqLvVPqRFyI/XI4RmiIhbmkMQ47A21i2Fmz6YC8VvMXe5RRYyCjO4VPiZJhG86CAqnmxcsDD123aA6S0TDjJQxFYE/07xocQg47Edz5ZoNW3a0QI0980PWrdhM7Vm3VCSrmAlCpWTe1YJK/56mltlKOsozcQSnq01slNokwPCW2MHjEhjUOuk9sO6Ck4LOmvd20d/mjvz/OhnyY2gVN6xD7ub0WCfPdzbG6/iT/2rOEe5SF+5eaKwk1mIYY4yD2Aw2jQXbERmIaCypU3bc5WFsLtFEJKyfGeZUMn8F7b07DcH6RN4sVMEyy8tnwgPlb9KL1QpMQCTQe79NCy9vgmMGSEX4uwXIZYmwkas6U2Ae0JHqh0I1US40YeUU68uiD4sDlU/50P0+9Q6MyFCk/4OH+m7zOuH+Z2zE9B489BonEYzNhckR6AkKFbuzTBuFXQyCgWgvDNSX7zuPReCGlOOhjYyU7sbGCZ3xZhZk64YTezpGzmVePb7NFRvxTWaNTvvjiQJKi5w23WeeQYo7ECRC2nOrxBPlpYF/QRu79YS/rAK9u8xMvOOsgx7TurkhVgVIiVnLQUMNi8/sViw5K+qSy/gA5Qr4yYYxPLgDrLfh5ZCCVZ16xdtak=',
    attributes: {
        user: [
            'dn',
            'userPrincipalName',
            'sAMAccountName',
            'mail',
            'givenName',
            'sn',
            'mobile',
            'displayName',
            'title',
            'jobTitle'
        ]
    }
};
/* added below for refrence pupose */
/*
    attributes: {
    user: [
        'cn','distinguishedName','name','givenName','sn','displayName','initials','middleName','preferredLanguage',
        'physicalDeliveryOfficeName','sAMAccountName','userPrincipalName','userAccountControl','badPwdCount',
        'logonCount','lastLogon','lastLogonTimestamp','lastLogoff','accountExpires','pwdLastSet','lockoutTime',
        'whenCreated','whenChanged','objectGUID','objectSid','primaryGroupID','mail','mailNickname','proxyAddresses',
        'telephoneNumber','mobile','homePhone','pager','facsimileTelephoneNumber','ipPhone','otherTelephone',
        'streetAddress','postOfficeBox','l','st','postalCode','c','co','countryCode','title','department','company',
        'manager','directReports','employeeID','employeeNumber','employeeType','division','officeName','memberOf',
        'tokenGroups','description','info','notes','comment','msDS-UserPasswordExpiryTimeComputed','thumbnailPhoto',
        'jpegPhoto','objectClass','objectCategory','uSNCreated','uSNChanged','instanceType','objectVersion'
    ]
    }
*/

/**
 * AD server allowed groups, To whome user belong's into AD server group.
 */
const ALLOWED_GROUPS_NAME = ['Devtest', 'Remote Desktop Users']; // User's group name of AD server

/**
 * Query structure, Fetching data from AD server of user by below query.
 */
var AD_QUERY = "(|(sAMAccountName=*XXXX*)(cn=*XXXX*)(userPrincipalName=*XXXX*))";

/**
*  Exporting contains of file
*/
module.exports = {
    AD_CONFIG: AD_CONFIG,
    AD_QUERY: AD_QUERY,
    ALLOWED_GROUPS_NAME: ALLOWED_GROUPS_NAME
};