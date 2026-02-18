let DB_CONFIG = {
  /**
   * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
   */
  /** Below configuration parameters for development environment. */
  user                : 'sqldev',                       // User name to use for authentication
  password            : "Mh//yRyyILIx5ykpheALGbnZnFahTkRnzfb8Ml1lLlLW1HGcQEHIVWO2ed24sRwRI5zVOtU4MkAsCdT12cp1FZ+AgtYBjxXxF6N5nliZ14UOwMkpVc5dh3hngIoC/7BNdkwAgI8G47ydkGRH7pYmjNurteBVu+OUxJ6l4quk++vEDwlGjlHVtDCT7BGSpJAt3dEG14qGd8GRJpXqImxmOLlAQgjtbS5p5+UfxORAu3WyqaUbXJOh8+HpS2dgJQOPT+r9aQB3ml+l2SpjIes5MS2STlo+nFImkxTur1lNfpFOGgGs/ai8tkyRV6v8hrCEKS1imIw/N8K2Wr0Ng+tMo8pU8jb0kCr0L2EoAUV6bf1JWtY/KSehZK6TRSixxmT8XgBtT+tTcdr70snFZmG7P7X2Cji0nAKoMK3GMtVLXzLL6RCCpdnyipPTIMSmV0reJooh2Th5rQXbNBIIRCbYFGFciJtYKR8F82vtrEJ0CVneCyeo+a0dzZ8Cvwo0vu26+CxVamQlfVdGfFN4XolI8ZGMhjkrdsS13GwJ0kzP66CaPKoSMSG9gKTj3tk9oUF7fsvHdYOnAbU22IiCfScts6qF08PpidUUtOaQ2QGyqb5sjMOUDz47u6TkSjzz7fg09CSmSZZDvLXYG/sYPIkBuu9h5LpNcDWorxxWohfDvTs=",
  server              : '10.0.1.22',                     // Private IP of Dev DB
  port                : 1433,                               // Port to connect to Dev DB

  /** Below configuration parameters for QA environment. */
    // user                : 'sqlqa',                       // User name to use for authentication
    // password            : "Pt6uCqVNcwR13VzDkRO6RdEfLBeV8J9hl4aT12ZIyNA+qb7Dlkx9LphAV8E6MbmpAUAbejzT/0oB5PNXS2/416CuXq3IJPXzTYt3FGB0mqDA7z8FoTpwS97Z6Ytfgru/FfYSbV1KdCDXTveefoKqD45TscQ3PdEeYIYzBSl278+10VLR6Bk+7LFtEr0TSz2ZBOaThmu3n8sWmhJ7lczZdPaxqoZuFldV2fB7CFeTrLtQGJqzUAz+UEl8cRKFQS2PTBntqcbLSn0UBkA9kQxmFj4G/MLW+LhMAgXTvthat7wwu3gT9h8dm0qsmn6yHE5A+c4VGndMOTnedxImEKusUhuaFWu9BTpqiJP9puHOj5kZAUvJG63ZzEHcTN1/fXnMOvJmjx70oLmislbdJ4v2r8C6iMameibPqTpM/bpKB0dZ/51XUMDE7ds2f4hs+pHyVBu5dY+46UEjcz9ZJswyeZpyJfZWxRAdK6Gzhdtt0I6KqPlI1s1SO15+NeRFbPHkqZuQcx0H6xB4a11sAYi4l2Qwzgd2Pt44X5J5KzXocMnBlmUkmEQnJRY8aaljVzRQJ90OF/jRp04Yaqm03ccan28cuQETJTY3VmfIcNT1dUnBj60W939peS3dfqm5a4g2p+y07WHAkN0rNd7EUCiaoPBWXHA9FyqoKU3LMJonCTI=",
    // server              : '10.0.1.24',                     // Private IP of QA DB
    // port                : 1433,                           // Port to connect to QA DB

  // Common configuration parameters
    database            : 'SE_GRC',                        // Database to connect to
    connectionTimeout   : 30000,                          // Connection time out in ms (default: 15000). Time to wait while trying to establish a connection before terminating the attempt and generating an error.
    requestTimeout      : 0,                              // Request time out in ms (default: 15000). Maximum time to complete SQL operation else generating an error of request time out.
    options             : { encrypt: false, packetSize: 16384 },   // Encryption for data encryption which will travel on network, App server to DB server
    pool                : {                               // Pooling options
                            max               : 200,      // The maximum number of connections there can be in the pool
                            min               : 50,       // The minimum of connections there can be in the pool
                            idleTimeoutMillis : 30000     // The Number of milliseconds before closing an unused connection
                          }
  };
  module.exports = DB_CONFIG;