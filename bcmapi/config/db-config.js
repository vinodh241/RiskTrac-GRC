let DB_CONFIG = {
  /**
   * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
   */
  /** Below configuration parameters for development environment. */
    user                : 'sqldev',                       // User name to use for authentication
    password            : "PD//P0tFmVNFP4vkRvZQGchqG3G02tymLsf6fSnWpGmCL4Jqn1zIVumO0VLucexSDaoW584sYdyvzR45RdfWgzN6cswxbLZYfJ3u82ZOFNrK3kTIZTNemq7BWZx6stDaWUJTmL0R1LFWD7DYRLdIqHylQ2HCCP3sRqapynq8kqQIFt57adnUOpbR1T0lw3mitXLuK6i7xqJ8JsCH0Bx4JaP6Ou6mpKnCSlzsVQwMFhFhSMpev4uQ7QKvDqaVp//FkpAn+ENFLmHc3zWWREG9egD7DhWxEyW0DzQhrsrOuj35X+NK8QsEKdgU5pXc8SfLqvQm1UziHnKux+TDbgD4giiZrUD+flHsUeJrJojC9WgPgBc6o4p/fU/8+/dCUzgBvoTXhANHJyyiTT+nRiW8qDiT8GBI8X+VypsEcauMjYSy7/mff2U8QxlILXj2ztIHKfdZI1picHs2VYeVKs6nTmgJyfsgkbQ21dHVzwJZLd6YIEc36rWKYFHeLMvfYw1ZXPEAc3K7mM5vlQ22benrWzVBEwX2rqcb2LT5SdCTUTo7NcqR3T5zAbkTNekIFM4xzuODXD8kjqrN1fhQHtudacxjJPXrCkHWGHDx6nBI6XB9HXm8Insas/cAdH1uSnwxE0NCsDVwQqc8g/C71/ctI9E7P0afP0PmUzHpK9ShsJ0=",
    server              : '10.0.1.22',                     // Private IP of Dev DB
    port                : 1433,                           // Port to connect to Dev DB

  /** Below configuration parameters for QA environment. */
    // user                : 'sqlqa',                       // User name to use for authentication
    // password            : "Pt6uCqVNcwR13VzDkRO6RdEfLBeV8J9hl4aT12ZIyNA+qb7Dlkx9LphAV8E6MbmpAUAbejzT/0oB5PNXS2/416CuXq3IJPXzTYt3FGB0mqDA7z8FoTpwS97Z6Ytfgru/FfYSbV1KdCDXTveefoKqD45TscQ3PdEeYIYzBSl278+10VLR6Bk+7LFtEr0TSz2ZBOaThmu3n8sWmhJ7lczZdPaxqoZuFldV2fB7CFeTrLtQGJqzUAz+UEl8cRKFQS2PTBntqcbLSn0UBkA9kQxmFj4G/MLW+LhMAgXTvthat7wwu3gT9h8dm0qsmn6yHE5A+c4VGndMOTnedxImEKusUhuaFWu9BTpqiJP9puHOj5kZAUvJG63ZzEHcTN1/fXnMOvJmjx70oLmislbdJ4v2r8C6iMameibPqTpM/bpKB0dZ/51XUMDE7ds2f4hs+pHyVBu5dY+46UEjcz9ZJswyeZpyJfZWxRAdK6Gzhdtt0I6KqPlI1s1SO15+NeRFbPHkqZuQcx0H6xB4a11sAYi4l2Qwzgd2Pt44X5J5KzXocMnBlmUkmEQnJRY8aaljVzRQJ90OF/jRp04Yaqm03ccan28cuQETJTY3VmfIcNT1dUnBj60W939peS3dfqm5a4g2p+y07WHAkN0rNd7EUCiaoPBWXHA9FyqoKU3LMJonCTI=",
    // server              : '10.0.1.24',                     // Private IP of QA DB
    // port                : 1433,                           // Port to connect to QA DB

  // Common configuration parameters
    database            : 'SE_GRC',                        // Database to connect to
    connectionTimeout   : 30000,                          // Connection time out in ms (default: 15000). Time to wait while trying to establish a connection before terminating the attempt and generating an error.
    requestTimeout      : 0,                              // Request time out in ms (default: 15000). Maximum time to complete SQL operation else generating an error of request time out.
    options             : { encrypt: false, packetSize: 16384 },                // Encryption for data encryption which will travel on network, App server to DB server
    pool                : {                               // Pooling options
                            max               : 200,      // The maximum number of connections there can be in the pool
                            min               : 50,       // The minimum of connections there can be in the pool
                            idleTimeoutMillis : 30000     // The Number of milliseconds before closing an unused connection
                          }
  };
  module.exports = DB_CONFIG;
 