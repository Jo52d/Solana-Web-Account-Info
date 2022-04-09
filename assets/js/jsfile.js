
$(document).ready(function() {
  $("#sidebarCollapse").on("click", function() {
    $("#sidebar").toggleClass("active");
    $(this).toggleClass("active");
  });
});

$('#cardtab-list a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

if(document.location.pathname == '/tutowallet'){
  var stepper1Node = document.querySelector('#stepper1')
  var stepper1 = new Stepper(document.querySelector('#stepper1'))
}