// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: "secureyesdev.com",
  umapiUrl: "http://localhost:9002", // local API
  // umapiUrl: "http://10.0.1.21:9002", // DEV API
  // umapiUrl: "http://10.0.1.23:9002", // QA API
  hostUrl: "http://localhost:5000",
  userManagementUrl: "http://localhost:5000/user-management",
  ormUrl: "http://localhost:5000/orm",
  bcmUrl: "http://localhost:5000/bcm",
  dmsUrl: "http://localhost:5000/dms",
  tppUrl: "http://localhost:5000/tpt",
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
