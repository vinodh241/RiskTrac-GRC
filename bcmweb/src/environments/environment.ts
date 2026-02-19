// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  dummyData: false,
  production: false,
  umapiUrl: "http://localhost:9002", // local API UM
  // umapiUrl: "http://10.0.1.21:9002", // DEV API UM 
  // umapiUrl: "http://10.0.1.23:9002", // QA API
  ormapiUrl: "http://localhost:9003", // local API ORM
  // ormapiUrl: "http://10.0.1.21:9003", // Dev API ORM
  // ormapiUrl: "http://10.0.1.23:9003", // QA API
  hostUrl: "http://localhost:5000",  // local UI URL
  
  bcmapiUrl: "http://localhost:9004", // Local API BCM
  // bcmapiUrl: "http://10.0.1.23:9004", // QA API
  devConfig: true,
  client: "AMLAK",
  ckeditorUrl: 'http://localhost:4500/assets/js/ckeditor/ckeditor.js',
  currency: 'INR',
  defaultLanguage: 'en',
  MasterData: {
    PageName: ['Impact'],
    TotalRecords: 6
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
