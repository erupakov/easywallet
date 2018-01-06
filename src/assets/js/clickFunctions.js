module.exports = function() {
  // $('.navbar-collapse').on('click', 'a.close', function () {
  //   $('.navbar-collapse').collapse('hide');
  // });
  //
  // $('.navbar-collapse').on('click', 'a.menu', function () {
  //   $('.navbar-collapse').collapse('hide');
  // });
  $('.copy-button').on('click', function() {
    let id = $(this).data('id');
    let copyText = document.getElementById(id);
    copyText.select();
    document.execCommand("Copy");
  });

  $('.wallet .remove').on('click', function() {
    $(this).closest('.wallet').remove();
  });
};