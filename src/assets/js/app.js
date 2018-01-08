/* eslint-disable */
console.log('app.js has loaded!')

;(function ($) {
  'use strict'

  // modules requires
  let clickFunctions = require('./clickFunctions')

  // functions

  // document ready functions
  $(document).ready(function () {
    $('form').validator({
      focus: false
    })

    $('html, body').animate({ scrollTop: 0 }, 0)
    // modules

    // functions
  }) // end of document ready

  // window load functions
  $(window).on('load', function () {

  }) // end of window load

  // initialization
  clickFunctions()

  // window resize functions
  $(window).resize(function () {

  }) // end of window resize

  $(document).on('scroll', function () {

  })
})(jQuery)
