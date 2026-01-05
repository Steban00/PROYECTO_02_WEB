$(function () {

    let search = $('.search-form');
    let cart = $('.shopping-cart');
    let login = $('.login-form');
    let navbar = $('.navbar');
  
    $('#search-btn').on('click', function () {
      search.toggleClass('active');
      cart.removeClass('active');
      login.removeClass('active');
      navbar.removeClass('active');
    });
  
    $('#cart-btn').on('click', function () {
      cart.toggleClass('active');
      search.removeClass('active');
      login.removeClass('active');
      navbar.removeClass('active');
    });
  
    $('#login-btn').on('click', function () {
      login.toggleClass('active');
      search.removeClass('active');
      cart.removeClass('active');
      navbar.removeClass('active');
    });
  
    $('#menu-btn').on('click', function () {
      navbar.toggleClass('active');
      login.removeClass('active');
      search.removeClass('active');
      cart.removeClass('active');
    });
  
    $(window).on('scroll', function () {
      navbar.removeClass('active');
      login.removeClass('active');
      search.removeClass('active');
      cart.removeClass('active');
    });
  
  });