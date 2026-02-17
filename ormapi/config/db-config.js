let DB_CONFIG = {
  /**
   * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
   */
  /** Below configuration parameters for development environment. */
    user                : 'sqldev',                       // User name to use for authentication
    password            : "PD//P0tFmVNFP4vkRvZQGchqG3G02tymLsf6fSnWpGmCL4Jqn1zIVumO0VLucexSDaoW584sYdyvzR45RdfWgzN6cswxbLZYfJ3u82ZOFNrK3kTIZTNemq7BWZx6stDaWUJTmL0R1LFWD7DYRLdIqHylQ2HCCP3sRqapynq8kqQIFt57adnUOpbR1T0lw3mitXLuK6i7xqJ8JsCH0Bx4JaP6Ou6mpKnCSlzsVQwMFhFhSMpev4uQ7QKvDqaVp//FkpAn+ENFLmHc3zWWREG9egD7DhWxEyW0DzQhrsrOuj35X+NK8QsEKdgU5pXc8SfLqvQm1UziHnKux+TDbgD4giiZrUD+flHsUeJrJojC9WgPgBc6o4p/fU/8+/dCUzgBvoTXhANHJyyiTT+nRiW8qDiT8GBI8X+VypsEcauMjYSy7/mff2U8QxlILXj2ztIHKfdZI1picHs2VYeVKs6nTmgJyfsgkbQ21dHVzwJZLd6YIEc36rWKYFHeLMvfYw1ZXPEAc3K7mM5vlQ22benrWzVBEwX2rqcb2LT5SdCTUTo7NcqR3T5zAbkTNekIFM4xzuODXD8kjqrN1fhQHtudacxjJPXrCkHWGHDx6nBI6XB9HXm8Insas/cAdH1uSnwxE0NCsDVwQqc8g/C71/ctI9E7P0afP0PmUzHpK9ShsJ0=",
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
    options             : {encrypt: false, packetSize : 16384},                // Encryption for data encryption which will travel on network, App server to DB server
    pool                : {                               // Pooling options
                            max               : 200,      // The maximum number of connections there can be in the pool
                            min               : 50,       // The minimum of connections there can be in the pool
                            idleTimeoutMillis : 30000     // The Number of milliseconds before closing an unused connection
                          }
  };
  module.exports = DB_CONFIG;


// let DB_CONFIG = {
//   /**
//    * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
//    */
//   /** Below configuration parameters for development environment. */
//     user                : 'sqlqa',                       // User name to use for authentication
//     password            : "Ao0Oz5H8vyflBVgiy/qJK9tQT9DpUUB9ByU3giJrmbz8pmIU3rYVmXNpG55c1Bq2TlRlzs7tEuZ/RxMn1Ok0wIGiG+n4bTViWM4OA8pWW1Fc7jgcHEc6dvwos7FZmeXeF3LfILfn6cQNvb+orM3zMQN6fcRyK+fcGuWUmXfCV+MWv1RPS3UqbmuIgW/G/9Skgy2JEoPIPxUSFW5Oh9oAlSV/N6a5qQMEdpaGVW/X6T1gUJmDogSvw38NDN2xH/FjBYrghZBeN5VmHqRLRYFpxkBZKVZK/+2qfG7d7xQjAhJPQlo23DpfRGPyTWuV1RhE+g0QJpxyBJryoG9utZfCN9BwgrckSWjAjXVoDwfGbt7RCLU4GkkEvpRhYEWCoVbygneipsi8+LXeKhNaR9ID7fz9xx/qXQdrDGA0PBflm1dKv/wnTJoipjlehS1vwvAJn5Gn/FrdOPEaWne+WE9Y8fsmoSLm20zQD3NMQdsRFKAobifIVPOaLDg96hPb813oxTV4AfJC07irPnLtLeE6a2hIVSAXJlhusrHqhxXYlNpvz1KXB1wNeU/gHzGjZuITL8xDyRWZQXxlos3Psggl+vibl+xESWXVvAXllgxC6Y2gg0EZP4B97E1MQlV05M0KSsZf/wKsHIsT/htD9J7FI8b3oYeGRDBQKVF5wwncPB8=",
//     server              : '10.0.1.9',                     // Private IP of Dev DB
//     port                : 1533,                           // Port to connect to Dev DB

//   /** Below configuration parameters for QA environment. */
//     // user                : 'sqlqa',                       // User name to use for authentication
//     // password            : "HYBEhxTLAtVDQP88TcjaJ65bjiL+nOhfsKi2/IwF/f2lkjHNgjfAQExP28lACS+c9u8imV9XnFlxFNNyBgxJFqCLtTIMUEt7T2o6Rxtv4U/9XA+PcqULPBBut53sv+JUpl3LBLCTzUVXEt+tOy8WdYChEkND8dYQrKN1Ho9r+hsc8Ykeg1QA7DsC1wWLo8Yqoj90KeqDigxoS1MZPSb2DC+gKiIudC/fh1Umtmha32RQMvMLUq7xeN1yWkHhHonR8XTuoLjdA12OzvfJHprWVqkEstbaOD0c1C0z/GnTykChJ5n4fnJTJM9GXPZtQrMi09qDkBhtS1nMfdQMYezuZh+DvL37A9Ib/gA1e+7hleBnICpUMaj/+rKCb9lfVlNhvRyVWBDgH/zMAxOo/x81Cwob9sI1i0wDqlquR1jfFRA3j8wHu0fUHRv7bkRJUsbtVHiN9yInoNd/NFqkjpmVLB8HP9NZdTSV9zu5ilykQPaqCL1IJ+cyXfzxWrWK2xVqtkfPaAOAHsGLf6A4fh1fas8sU4C2gBFd4JcboNjqdQxEyjTLEPPwC/3vCRK7qQK+Zkep2R3BJZYp6KuMA0ToGwerkXpuqr4s1TF/UCrcvp43NY1ZJK2dhaxB3XK9JGfoa9/m5dqVSfdlJdNOxoDaka+GbMuyzw+TxIjgfiIQGSE=",
//     // server              : '10.0.1.9',                     // Private IP of QA DB
//     // port                : 1533,                           // Port to connect to QA DB

//   // Common configuration parameters
//     database            : 'AMLAK',                        // Database to connect to
//     connectionTimeout   : 30000,                          // Connection time out in ms (default: 15000). Time to wait while trying to establish a connection before terminating the attempt and generating an error.
//     requestTimeout      : 0,                              // Request time out in ms (default: 15000). Maximum time to complete SQL operation else generating an error of request time out.
//     options             : {encrypt: true},                // Encryption for data encryption which will travel on network, App server to DB server
//     pool                : {                               // Pooling options
//                             max               : 200,      // The maximum number of connections there can be in the pool
//                             min               : 50,       // The minimum of connections there can be in the pool
//                             idleTimeoutMillis : 30000     // The Number of milliseconds before closing an unused connection
//                           }
//   };
//   module.exports = DB_CONFIG;


// let DB_CONFIG = {
//   /**
//    * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
//    */
//   /** Below configuration parameters for development environment. */
//     user                : 'sqlqa',                       // User name to use for authentication
//     password            : "ChPrh3+HS+Wsm3sDbQRHdQ4WtdLHqf8TRM6dBf+nWmaKRtnVDRX3GI5mZmug6lwRr8xs8yix/Ch97PEXcne7KGHxh1RcPeCtDfWoVJdbQWqea5d4RKSsJk5HDGqiVNSvlPqb7WU7IgzYb2by0UFWg5kvGw7Fzxktc+jjeI+GiqnAHj3jKlcT9birKj/5lg6z7pT+NEuI50qKPmk57b4WMb826ToCKqmN7R6oV0c7BM5tGfjgqLjd7b0anZrgAus/f0WIzzHFdevsfSTSsr52Sjt7ikVNV1UBP8sarXIclI0dLX8Poyjj5UIbJHXAPOXKYGfRCHnZqaPBXCmHw1N3VsAKAxWhUQLDycDVWQwXoJOf7/dXSWKogDZqR33En2yHRnTbx+aizxav8JqE4TS49hjnp0MV4sBrFHbRYIsLwAnmZoGsPSFufbfYSh0kS2wyQ6bT+7aYq0lpqxVdm5Rw4VGR2MTZtJ5WNV2GsfvTlBYoIHI1Bc1LJRtVIUJiJcWj9c75Kscywq30Kc7ySjCh0EbzdUY4wCjgW1fGqrTpi9Nv6Y+Oq1+wbBbLiPrdN+6rCTPwucT8fztxWXBpej7G6aR1RQLmU7S51xEQJCiN/zDRdlgdlNX2cjCfA+tP9o3nR0WFzdLZimpkmKtoRj7rnIQpJDv6+7qY7zCiV8pSVNk=",
//     server              : '10.3.0.5',                     // Private IP of WINDEMO DB
//     port                : 1433,                           // Port to connect to WINDEMO DB
 
//   /** Below configuration parameters for QA environment. */
//     // user                : 'sqlqa',                       // User name to use for authentication
//     // password            : "HYBEhxTLAtVDQP88TcjaJ65bjiL+nOhfsKi2/IwF/f2lkjHNgjfAQExP28lACS+c9u8imV9XnFlxFNNyBgxJFqCLtTIMUEt7T2o6Rxtv4U/9XA+PcqULPBBut53sv+JUpl3LBLCTzUVXEt+tOy8WdYChEkND8dYQrKN1Ho9r+hsc8Ykeg1QA7DsC1wWLo8Yqoj90KeqDigxoS1MZPSb2DC+gKiIudC/fh1Umtmha32RQMvMLUq7xeN1yWkHhHonR8XTuoLjdA12OzvfJHprWVqkEstbaOD0c1C0z/GnTykChJ5n4fnJTJM9GXPZtQrMi09qDkBhtS1nMfdQMYezuZh+DvL37A9Ib/gA1e+7hleBnICpUMaj/+rKCb9lfVlNhvRyVWBDgH/zMAxOo/x81Cwob9sI1i0wDqlquR1jfFRA3j8wHu0fUHRv7bkRJUsbtVHiN9yInoNd/NFqkjpmVLB8HP9NZdTSV9zu5ilykQPaqCL1IJ+cyXfzxWrWK2xVqtkfPaAOAHsGLf6A4fh1fas8sU4C2gBFd4JcboNjqdQxEyjTLEPPwC/3vCRK7qQK+Zkep2R3BJZYp6KuMA0ToGwerkXpuqr4s1TF/UCrcvp43NY1ZJK2dhaxB3XK9JGfoa9/m5dqVSfdlJdNOxoDaka+GbMuyzw+TxIjgfiIQGSE=",
//     // server              : '10.0.1.9',                     // Private IP of QA DB
//     // port                : 1533,                           // Port to connect to QA DB
 
//   // Common configuration parameters
//     database            : 'AMLAK',                        // Database to connect to
//     connectionTimeout   : 30000,                          // Connection time out in ms (default: 15000). Time to wait while trying to establish a connection before terminating the attempt and generating an error.
//     requestTimeout      : 0,                              // Request time out in ms (default: 15000). Maximum time to complete SQL operation else generating an error of request time out.
//     options             : {encrypt: false},                // Encryption for data encryption which will travel on network, App server to DB server
//     pool                : {                               // Pooling options
//                             max               : 200,      // The maximum number of connections there can be in the pool
//                             min               : 50,       // The minimum of connections there can be in the pool
//                             idleTimeoutMillis : 30000     // The Number of milliseconds before closing an unused connection
//                           }
//   };
//   module.exports = DB_CONFIG;