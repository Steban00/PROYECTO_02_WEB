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

    /* PRODUCT PAGE: thumbs and quantity controls */
    $('.product-thumbs .thumb').on('click', function (){
      const src = $(this).data('src');
      $(this).closest('.product-gallery').find('.product-image img').attr('src', src);
    });

    $('.qty-controls').on('click', '.qty-btn', function(){
      const $group = $(this).closest('.qty-controls');
      const $input = $group.find('input[type="number"]');
      let val = parseInt($input.val()) || 1;
      if($(this).is('#increase')) $input.val(val + 1);
      else $input.val(Math.max(1, val - 1));
    });

    /* Add to cart (mock, client-side) */
    $('.add-to-cart').on('click', function(e){
      e.preventDefault();
      const $info = $(this).closest('.product-info');
      const title = $info.find('h1').text().trim();
      let priceText = $info.find('.price').text().trim();
      const qty = parseInt($info.find('input[type="number"]').val()) || 1;
      const img = $(this).closest('.product').find('.product-image img').attr('src');

      // normalize price to number (use dot decimal)
      priceText = priceText.replace('€','').trim();
      priceText = priceText.replace(',', '.');
      const price = parseFloat(priceText) || 0;
      const totalItem = price * qty;

      const itemHtml = `<div class="box">
                <i class="fas fa-trash"></i>
                <img src="${img}" alt="${title}">
                <div class="content">
                    <h3>${title}</h3>
                    <span class="price">${price.toFixed(2).replace('.',',')} €</span>
                    <span class="quantity">Cantidad: ${qty}</span>
                </div>
            </div>`;

      // add item to cart UI
      $('.shopping-cart').prepend(itemHtml);

      // recompute total
      let total = 0;
      $('.shopping-cart .box .content .price').each(function(){
        let p = $(this).text().replace('€','').trim().replace(',','.');
        total += parseFloat(p) || 0;
      });

      $('.shopping-cart .total').text('Total: ' + total.toFixed(2).replace('.',',') + ' €');

      // make cart visible briefly
      $('.shopping-cart').addClass('active');
      setTimeout(()=> $('.shopping-cart').removeClass('active'), 3000);
    });

    /* REQUESTS: mock song request form */
    // clear field errors on input/change
    $('#request-form').on('input change', 'input, textarea, [type="checkbox"]', function(){
      const $el = $(this);
      $el.removeClass('invalid');
      $el.closest('.row').find('.field-error').text('');
      $('#request-result').text('').removeClass('error success');
    });

    $('#request-form').on('submit', function(e){
      e.preventDefault();
      const $form = $(this);
      const $name = $form.find('[name="name"]');
      const $email = $form.find('[name="email"]');
      const $song = $form.find('[name="song"]');
      const $artist = $form.find('[name="artist"]');
      const $when = $form.find('[name="when"]');
      const $note = $form.find('[name="note"]');
      const $consent = $form.find('[name="consent"]');

      const name = $name.val().trim();
      const email = $email.val().trim();
      const song = $song.val().trim();
      const artist = $artist.val().trim();
      const when = $when.val().trim();
      const note = $note.val().trim();
      const consent = $consent.is(':checked');

      // reset previous errors
      $form.find('.field-error').text('');
      $form.find('input, textarea').removeClass('invalid');

      // custom per-field validation
      let hasError = false;

      if(!name){
        $name.addClass('invalid');
        $name.closest('.row').find('.field-error').text('¿Cómo te llamas? Escribe tu nombre.');
        hasError = true;
      }

      if(!song){
        $song.addClass('invalid');
        $song.closest('.row').find('.field-error').text('Introduce el título de la canción que quieres solicitar.');
        hasError = true;
      }

      if(!artist){
        $artist.addClass('invalid');
        $artist.closest('.row').find('.field-error').text('Indica el artista para que no nos equivoquemos.');
        hasError = true;
      }

      if(!consent){
        $consent.closest('.row').find('.field-error').text('Debes aceptar la política de privacidad para enviar la petición.');
        hasError = true;
      }

      if(hasError){
        $('#request-result').attr('aria-live','assertive').text('Corrige los campos marcados en rojo antes de enviar.').addClass('error');
        // focus first invalid
        const $first = $form.find('.invalid:first');
        if($first.length) $first.focus();
        return;
      }

      // create mock request item
      const item = `<div class="request-item">
          <strong>${escapeHtml(song)}</strong> — ${escapeHtml(artist)} <span class="meta">por ${escapeHtml(name)}${when? ' • ' + escapeHtml(when) : ''}</span>
          <p class="note">${escapeHtml(note)}</p>
        </div>`;

      // append to list and show confirmation
      $('#requests-list').prepend(item);
      $('#request-result').attr('aria-live','polite').text('¡Petición enviada! Gracias — la reproduciremos en la tienda (mock).').removeClass('error').addClass('success');

      // clear form
      $form[0].reset();
      setTimeout(()=> $('#request-result').text('').removeClass('success'), 4000);
    });

    // small helper to avoid injecting HTML
    function escapeHtml(str){
      return String(str||'').replace(/[&"'<>]/g, function (s) { return ({'&':'&amp;','"':'&quot;','\'':'&#39;','<':'&lt;','>':'&gt;'}[s]); });
    }

    // GSAP
    if (typeof gsap !== 'undefined') {
      if ($('.product-page').length) {
        gsap.set('.product-image img', { autoAlpha: 0, y: 40 });
        
        gsap.set('.product-info > *', { autoAlpha: 0, y: 20 });

        requestAnimationFrame(function(){
          gsap.to('.product-image img', { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' });
          gsap.to('.product-info > *', { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, delay: 0.2, ease: 'power3.out', onComplete: function(){ document.documentElement.classList.remove('js'); } });
        });
      }

      $('.add-to-cart').on('click', function(){
        const $img = $(this).closest('.product').find('.product-image img');
        gsap.to($img, { scale: 0.95, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' });
      });
    }

  });