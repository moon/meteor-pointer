//------------------------------
// Description
//------------------------------

Package.describe({
  name: 'moonco:pointer',
  summary: 'Moon pointer events',
  version: '0.0.4',
  git: 'https://github.com/moon/meteor-pointer'
});

//------------------------------
// Definition
//------------------------------

Package.onUse(function(api) {

  api.versionsFrom('1.0.4.2');

  //------------------------------
  // Exports
  //------------------------------

  api.export('Pointer', 'client');

  //------------------------------
  // Dependancies
  //------------------------------

  api.use([

    // Meteor Packages
    'underscore',
    'templating',
    'jquery',

  ], 'client');

  //------------------------------
  // Files
  //------------------------------

  api.addFiles([

    'index.js'

  ], 'client');

});
