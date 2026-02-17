// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  dummyData: false,
  production: false,
  umapiUrl: "http://localhost:9002", // local API
  // umapiUrl: "http://10.0.1.21:9002", // DEV API
  // umapiUrl: "http://10.0.1.23:9002", // QA API
  ormapiUrl: "http://localhost:9003", // Local API
  // ormapiUrl: "http://10.0.1.21:9003", // Dev API
  // ormapiUrl: "http://10.0.1.23:9003", // QA API
  hostUrl: "http://localhost:5000",  // local UI URL
  currency: 'INR',
  defaultLanguage: 'en'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
