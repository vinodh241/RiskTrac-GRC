let DB_CONFIG = {
  /**
   * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
   */
  /** Below configuration parameters for development environment. */
    user                : 'sqldev',                       // User name to use for authentication
  password            : "hPqzghb+ST4z64hSBrx6apLeqoPwbM0cKP+boE6c5VxIC3E1AXD0eoW9nZSntuT04zyd+D07m5f6Pqxdv78ekOK2r36h71dkE4CH8hGFkL3ZGDDPOMYlwEgR69RmJM8eBVlgbnwi8tK77ShvOAYlinGITbjYqriDbejrmFXT8qpEGUTDkYGTLD1lKBQ7gLCzSWZGxbJMSgLFBnTaostdy1GdZsbhImCdgixg8ZIprMtE9UZjOldNqomwlC43YLItVe7G4VF4Cj6b8zwWQ40sGuxcL0of6vq4MIEl4HYtHzVqfmfqxvs9HF8JrTxL3lVI+aXKfVb1uKzztGyHOhR8HuLIMhg/HDkCFrQwSRtH8sDMbHiC0hu0x1JM2XlQ7ZCpIAuvR+Tp+Q4cQRO0THOUr4bthkHbCJ8z8I91NBTLAiezectipTB5+Is7EDWu6xQpA5lOLR7P5RbEP4M54vIXVmN4DaA/rqe4IgvfVS4CSGjnlSq+kPU/eAHcdkg1qrFOlQFKwJ2i5nkFU8d+Vp2f/Mu0GWq1HsawD7dm7GZC4+3yY8r/Edfmr2H4Dd5GVhYeH0YyGBGkQ8G2WmIk2brOEmzF1QPSfdIKicZmgSKe8rPKbuwHMl8V4Ac2P5j1JpwYxlOi9ugnlhdzO7Y5cYmH8qvcZ1M0j+DwkVVXkmw5mVU=",
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
 