import Ember from 'ember';

// PLEASE, if you are reading this code, DONT duplicate this hack :)
// This is only here so that we can test this event model prior to it landing in Ember proper.
let symbol = Ember.__loader.require('ember-metal/utils')['symbol'];

// TODO patch this pre 1.13 if we can
export default symbol;
