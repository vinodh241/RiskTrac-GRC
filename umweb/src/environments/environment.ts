// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  umapiUrl: "http://localhost:9002",   // Local API
  // umapiUrl: "http://10.0.1.21:9002", // Dev API  
  // umapiUrl: "http://10.0.1.23:9002", // QA API
  hostUrl: "http://localhost:5000",
  defaultLanguage: 'en'  // Supported: 'en', 'fr', 'de', 'es', etc.
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
