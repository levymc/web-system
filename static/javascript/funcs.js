$(document).ready(function(){
    $(".sub-btn").click(function(){
        // Abre o dropdown
      $(this).next('.sub-menu').slideToggle();
        // Rotaciona a 'seta' do dropdown 
      $(this).find('.dropdown').toggleClass('rotate'); 
    });
    // Expandindo a sidebar
    $('.menu-btn').click(function(){
      $('.side-bar').addClass('active');
      $('.menu-btn').css("visibility", "hidden");
      $('.container').css("filter", "blur(8px) opacity(25%)");
      $('header').css("filter", "blur(8px) opacity(25%)");
      $('.loginFormContainer').css("filter", "blur(8px) opacity(25%)");
    })
    // Escondendo ela
    $('.close-btn ,.container, header').click(function(){
      $('.side-bar').removeClass('active');
      $('.menu-btn').css("visibility", "visible");
      $('.container').css("filter", "none");
      $('header').css("filter", "none");
      $('.loginFormContainer').css("filter", "none");
     });
  });
  
$(document).ready(function(){
    $(".sub-btn").click(function(){
        // Abre o dropdown
      $(this).next('.sub-menu2').slideToggle();
        // Rotaciona a 'seta' do dropdown 
      $(this).find('.dropdown').toggleClass('rotate2'); 
    });
  });

  
  