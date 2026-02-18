let DB_CONFIG = {
  /**
   * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
   */
  /** Below configuration parameters for development environment. */
    user                : 'sqldev',                       // User name to use for authentication
    password            : "dPtjvaspYfxnWGuZOLm24IuvquuFvbbxviMzf+aRy3dX1HBMsso7QJX1HM5ycJ5K0gytx4kNgB23ukIyR3XvtsaImwuqwU8O1hyrnYBBeGHjWhgPZTQYCzugk5uBecZj1196qL9f/DZVZSJhKX6xGaHQkGzjjhcrU+nXwbsbvOWj9L1mrqYY5EMl3AoxRUCU7jQnFL8dJwSQhjCt1Jh4nR4FNx76XdATC5vjjDKryMRVe2BrSmP2AZDO6NiVTp5rnMdrzxkfArXRDflFQyGRT7uHk6/oxEZm4K91DUTRl5lNhh9oftnLyf0F+xs21a8nboJBYHPxCLqaDOiyBPRIExwy+/WDFMleL61BgcA8o1+FdH/xduTh6xw2sb8nsAd+SzY0yOz/T6Jt5BcjpEBmTDqoBq4EK/njOVUoCI1NXLSIGShNrFc0UTrXksoASHtzjBZOz0VWPGPpnv7owc0ECu1sms4PmaydIoj1CIjxKiOut0UKQwybXw0a5SQMc5W7cD0scT2x2tltu7OdCdet/qkwCNxsThdASaL+sC8y3K2OCH7/xv0ER8yc1nrqCu3abg44M5/GniHT1ByKJb6iIQLLBfKk93g1vjL5+ddW1tuxSyp1FM/Vo8XzICzuSEEbbp3wVkjUJ0PA5lJkyQVkxZU8Wtr8oa2RdIS0fNTISCY=",
    server              : '10.0.1.22',                     // Private IP of Dev DB
    port                : 1433,

  /** Below configuration parameters for QA environment. */
    // user                : 'sqlqa',                       // User name to use for authentication
    // password            : "HYBEhxTLAtVDQP88TcjaJ65bjiL+nOhfsKi2/IwF/f2lkjHNgjfAQExP28lACS+c9u8imV9XnFlxFNNyBgxJFqCLtTIMUEt7T2o6Rxtv4U/9XA+PcqULPBBut53sv+JUpl3LBLCTzUVXEt+tOy8WdYChEkND8dYQrKN1Ho9r+hsc8Ykeg1QA7DsC1wWLo8Yqoj90KeqDigxoS1MZPSb2DC+gKiIudC/fh1Umtmha32RQMvMLUq7xeN1yWkHhHonR8XTuoLjdA12OzvfJHprWVqkEstbaOD0c1C0z/GnTykChJ5n4fnJTJM9GXPZtQrMi09qDkBhtS1nMfdQMYezuZh+DvL37A9Ib/gA1e+7hleBnICpUMaj/+rKCb9lfVlNhvRyVWBDgH/zMAxOo/x81Cwob9sI1i0wDqlquR1jfFRA3j8wHu0fUHRv7bkRJUsbtVHiN9yInoNd/NFqkjpmVLB8HP9NZdTSV9zu5ilykQPaqCL1IJ+cyXfzxWrWK2xVqtkfPaAOAHsGLf6A4fh1fas8sU4C2gBFd4JcboNjqdQxEyjTLEPPwC/3vCRK7qQK+Zkep2R3BJZYp6KuMA0ToGwerkXpuqr4s1TF/UCrcvp43NY1ZJK2dhaxB3XK9JGfoa9/m5dqVSfdlJdNOxoDaka+GbMuyzw+TxIjgfiIQGSE=",
    // server              : '10.0.1.9',                     // Private IP of QA DB
    // port                : 1533,                           // Port to connect to QA DB

  // Common configuration parameters
    database            : 'SE_GRC',                        // Database to connect to
    connectionTimeout   : 30000,                          // Connection time out in ms (default: 15000). Time to wait while trying to establish a connection before terminating the attempt and generating an error.
    requestTimeout      : 0,                              // Request time out in ms (default: 15000). Maximum time to complete SQL operation else generating an error of request time out.
    options             : {encrypt: false},                // Encryption for data encryption which will travel on network, App server to DB server
    pool                : {                               // Pooling options
                            max               : 200,      // The maximum number of connections there can be in the pool
                            min               : 50,       // The minimum of connections there can be in the pool
                            idleTimeoutMillis : 30000     // The Number of milliseconds before closing an unused connection
                          }
  };
  module.exports = DB_CONFIG;