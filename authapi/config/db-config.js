let DB_CONFIG = {
  /**
   * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
   */
  /** Below configuration parameters for development environment. */
  user                : 'sqldev',                       // User name to use for authentication
  password            : "J87waLopUX3WlyBBUvsmG8InHy+CW5sWRioYdIr1lVIg9OBAMIvo0fIMLJ18LFC/5qSKQEEzKLgPb+OKhzYVRw9Poq5RPyJcuUd0Fk0szABa34/ripMoDMluQ8NVGxETiGJBWBcftKfdqUZDmFjhNVMqRG8mDC1ScVy9ldZRBYXj621xj+Tyej1v/zX7u/h0hBnmxnkblP4z72Krf5EadwBkdeqzmL0CdBlPlDhqEBcCjzcqVTCnG158EuzB4xmtge7aY96K7RqzBhG+Z2hBSh1XovkWa1id2GprNSRY6jOrazvjwtOqBX6x01fvHK3LXQVjWrl5HAG3zh2q08eSo/rOf9guERs0e/jA+Ow1XswnHif7E74z5qt6eJ3zZTbEXIQ6ru9Kn7T0BG6f5rHKabWr2H1+s2Bfd9xeXjCGJVYuWCU1+JTRX4CbYJBQhOfOW5cboCEmPoFZ76osS7ONo7aJoB3aiqQo7V2xHx9sFXEfsDLKVQTTUryYjK5IjANqhEOQDqf3lC2FVYTitmEzp498lAokDJNPuUsCSa7eYU2A1kgbFou3HWJ4nZemO/NkllEmFQpnQ2HsVoHYsuFcnKYZo51zoXWxiF+aNuUAtn2BKQz70j1vDxNNoHBgJZS3RSq6MMRSsaryKVYKs/7OTgEuNaWdfisVjGx27L6jl70=",
  server              : '10.0.1.22',                     // Private IP of Dev DB
  port                : 1433,                       // Port to connect to Dev DB

  /** Below configuration parameters for QA environment. */
    // user                : 'sqlqa',                       // User name to use for authentication
    // password            : "HYBEhxTLAtVDQP88TcjaJ65bjiL+nOhfsKi2/IwF/f2lkjHNgjfAQExP28lACS+c9u8imV9XnFlxFNNyBgxJFqCLtTIMUEt7T2o6Rxtv4U/9XA+PcqULPBBut53sv+JUpl3LBLCTzUVXEt+tOy8WdYChEkND8dYQrKN1Ho9r+hsc8Ykeg1QA7DsC1wWLo8Yqoj90KeqDigxoS1MZPSb2DC+gKiIudC/fh1Umtmha32RQMvMLUq7xeN1yWkHhHonR8XTuoLjdA12OzvfJHprWVqkEstbaOD0c1C0z/GnTykChJ5n4fnJTJM9GXPZtQrMi09qDkBhtS1nMfdQMYezuZh+DvL37A9Ib/gA1e+7hleBnICpUMaj/+rKCb9lfVlNhvRyVWBDgH/zMAxOo/x81Cwob9sI1i0wDqlquR1jfFRA3j8wHu0fUHRv7bkRJUsbtVHiN9yInoNd/NFqkjpmVLB8HP9NZdTSV9zu5ilykQPaqCL1IJ+cyXfzxWrWK2xVqtkfPaAOAHsGLf6A4fh1fas8sU4C2gBFd4JcboNjqdQxEyjTLEPPwC/3vCRK7qQK+Zkep2R3BJZYp6KuMA0ToGwerkXpuqr4s1TF/UCrcvp43NY1ZJK2dhaxB3XK9JGfoa9/m5dqVSfdlJdNOxoDaka+GbMuyzw+TxIjgfiIQGSE=",
    // server              : '10.0.1.9',                     // Private IP of QA DB
    // port                : 1533,                           // Port to connect to QA DB

  // Common configuration parameters
    database            : 'SE_GRC',                        // Database to connect to
    connectionTimeout   : 30000,                          // Connection time out in ms (default: 15000). Time to wait while trying to establish a connection before terminating the attempt and generating an error.
    requestTimeout      : 0,                              // Request time out in ms (default: 15000). Maximum time to complete SQL operation else generating an error of request time out.
    options             : {
                            encrypt: true
                          },                // Encryption for data encryption which will travel on network, App server to DB server
    pool                : {                               // Pooling options
                            max               : 200,      // The maximum number of connections there can be in the pool
                            min               : 50,       // The minimum of connections there can be in the pool
                            idleTimeoutMillis : 30000     // The Number of milliseconds before closing an unused connection
                          }
  };
  module.exports = DB_CONFIG;