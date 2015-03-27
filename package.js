//------------------------------
// Description
//------------------------------

Package.describe({
  name: 'moonco:pointer',
  summary: 'Moon pointer events',
  version: '0.0.1',
  git: 'https://github.com/moon/pointer'
});

//------------------------------
// Definition
//------------------------------

Package.onUse(function(api) {

  api.versionsFrom('1.0.4.2');

  //------------------------------
  // Exports
  //------------------------------

  api.export('Pointer');

  //------------------------------
  // Dependancies
  //------------------------------

  api.use([

    // Meteor Packages
    'underscore',
    'templating',
    'jquery',

  ]);

  //------------------------------
  // Files
  //------------------------------

  api.addFiles([

    'index.js'

  ], 'client');

});