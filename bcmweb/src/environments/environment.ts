// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  dummyData: false,
  production: false,
//   umapiUrl: "http://localhost:46002", // local API
  umapiUrl: "http://10.0.1.21:46002", // DEV API
  // umapiUrl: "http://10.0.1.6:8002", // QA
  // ormapiUrl: "http://localhost:46003", // Local API
  ormapiUrl: "http://10.0.1.21:46003", // Dev API
 // ormapiUrl: "http://10.0.1.6:8003", // QA API
  hostUrl: "http://localhost:5000",  // local UI URL
   //hostUrl: "http://10.0.1.5:5000,"
  currency: 'SAR',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
