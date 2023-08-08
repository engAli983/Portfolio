$(document).ready(function () {
  // Scroll Sticky Navbar
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 20) {
      $(".container").addClass("sticky");
    } else {
      $(".container").removeClass("sticky");
    }
  });

  // Toggle Menu Button
  $(".menu-btn").on("click", function () {
    $("header .container .menu").toggleClass("active");
    const icon = $(this).find("i");
    icon.toggleClass("fa-bars fa-xmark");
  });

  // Card flipped
  const $cards = $(".card");
  $cards.on("click", function (e) {
    e.stopPropagation();
    $cards.not(this).removeClass("flipped");
    $(this).toggleClass("flipped");
  });

  // Click outside to unflip all
  $(document).on("click", function () {
    $cards.removeClass("flipped");
  });
});
