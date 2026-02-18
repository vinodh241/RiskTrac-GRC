let DB_CONFIG = {
  /**
   * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
   */
  /** Below configuration parameters for development environment. */
  user                : 'sqldev',                       // User name to use for authentication
  password            : "ayyjRWrZyEpcBKcfesgL5p/GeFGxdl7azGKpazS4vpySgJAeu2+FhlInAo7Ah9DbcKf3njYUjex88XN6WMgYY4Bzm02IBW6vpjRIwftBit9p92m1ga4jwBkHISyr92dZo6xZbLRTKUE4K3ryGKAcSAppZ0R/z4aWvZw3n4mPqHT/txV1gJ8aJrO/gkFBjec2jhuPHPxpSE/YWssIku2Nhq2yUJgSjuEjZCakhcmaJsSt02xUHRurhF+urvtRC2tXpHnF9i9Pw8U26izMyMZ3wAOy6T1IaZBuFOgCcB8C99vKASDJMJyjQphj7/8P0VyVe3yeSg4baBQ8L8AsBNcFO4oINhfCMZw+ZyGJi+Bf5UkePDHhfpXkLO8W9rMk9JHgkXy0nuayYbKanuk9EqcFl059C4FP9gzEXl0s97boXRq0c65lNekx/oszd+KOxtka8x/IwNRrVD+izhxI/Up8XWG7UdplG9JzA5Scewu/p0rRBQbm7BDk8PyC/+CHi7Hbm/cOEqASLrJ3r2Fhb92whe8ChQiuZ3YBc6kO4/HRR1t/qX53Ym6n6V8GxdYc+Q8rjnvHPBWc/D4ft0C3/klcFKwYoMR4OFJiaIGEyDj0DgqC1bgdrF1QNTzTUDDj+n8dvHSgPtQkoU4qVZBkuFBiKrK+gdnL8LygxVBMvrFPAoU=",
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