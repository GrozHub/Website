// ===== JOYBUY THEME JS =====

document.addEventListener('DOMContentLoaded', function () {

  // === Cart Count Update ===
  function updateCartCount() {
    fetch('/cart.js')
      .then(res => res.json())
      .then(cart => {
        const badges = document.querySelectorAll('.cart-count');
        badges.forEach(badge => {
          badge.textContent = cart.item_count;
          badge.style.display = cart.item_count > 0 ? 'flex' : 'none';
        });
      });
  }

  updateCartCount();

  // === Add to Cart (AJAX) ===
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const variantId = this.dataset.variantId;
      if (!variantId) return;

      const originalText = this.textContent;
      this.textContent = 'Adding...';
      this.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      })
        .then(res => res.json())
        .then(() => {
          this.textContent = '✅ Added!';
          updateCartCount();
          setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
          }, 2000);
        })
        .catch(() => {
          this.textContent = 'Error!';
          setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
          }, 2000);
        });
    });
  });

  // === Wishlist Toggle ===
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', function () {
      const isWishlisted = this.dataset.wishlisted === 'true';
      this.dataset.wishlisted = !isWishlisted;
      this.textContent = isWishlisted ? '🤍' : '❤️';
    });
  });

  // === Search Suggestions (Live) ===
  const searchInput = document.querySelector('.header-search input');
  if (searchInput) {
    let searchTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      const query = this.value.trim();
      if (query.length < 2) return;
      searchTimer = setTimeout(() => {
        fetch(`/search/suggest.json?q=${query}&resources[type]=product&resources[limit]=5`)
          .then(res => res.json())
          .then(data => {
            // suggestions can be rendered here if needed
            console.log('Suggestions:', data);
          });
      }, 300);
    });
  }

  // === Sticky Header Shadow ===
  window.addEventListener('scroll', function () {
    const header = document.querySelector('.site-header');
    if (header) {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 16px rgba(0,0,0,0.12)'
        : '0 2px 8px rgba(0,0,0,0.06)';
    }
  });

  // === Mobile Nav Toggle ===
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      navToggle.textContent = mobileNav.classList.contains('open') ? '✕' : '☰';
    });
  }

  // === Smooth Scroll ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // === Image Lazy Loading Fallback ===
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
          }
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

});
