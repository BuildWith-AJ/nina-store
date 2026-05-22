 /* ── Mobile menu toggle ── */
    function toggleMenu() {
      const menu = document.getElementById('mobile-menu');
      menu.classList.toggle('hidden');
    }

    /* ── Cart helpers ── */
    function getCart() {
      return JSON.parse(localStorage.getItem('stepd_cart') || '[]');
    }

    function saveCart(cart) {
      localStorage.setItem('stepd_cart', JSON.stringify(cart));
    }

    function updateCartCount() {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.qty, 0);
      document.getElementById('cart-count').textContent = total;
    }

    /* ── Add to cart ── */
    function addToCart(btn) {
      const card      = btn.closest('.product-card');
      const sizeBtn   = card.querySelector('.size-btn.border-brand');
      const swatchBtn = card.querySelector('.swatch.ring-2');

      const size  = sizeBtn   ? sizeBtn.textContent.trim()       : 'One Size';
      const color = swatchBtn ? (swatchBtn.title || 'Default')   : 'Default';
      const id    = btn.dataset.id;
      const name  = btn.dataset.name;
      const price = parseInt(btn.dataset.price);

      const cart     = getCart();
      const key      = `${id}-${size}-${color}`;
      const existing = cart.find(i => i.key === key);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ key, id, name, price, size, color, qty: 1 });
      }

      saveCart(cart);
      updateCartCount();
      showToast(`${name} added!`);
    }

    /* ── Size selection ── */
    function selectSize(btn) {
      const card = btn.closest('.product-card');
      card.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('border-brand', 'text-brand', 'bg-brand-light');
        b.classList.add('border-gray-200', 'text-gray-500');
      });
      btn.classList.remove('border-gray-200', 'text-gray-500');
      btn.classList.add('border-brand', 'text-brand', 'bg-brand-light');
    }

    /* ── Swatch selection ── */
    function selectSwatch(btn) {
      const card = btn.closest('.product-card');
      card.querySelectorAll('.swatch').forEach(s => {
        s.classList.remove('ring-2', 'ring-brand');
      });
      btn.classList.add('ring-2', 'ring-brand');
    }

    /* ── Toast notification ── */
    function showToast(msg) {
      const toast = document.getElementById('cart-toast');
      toast.textContent = '✓ ' + msg;
      toast.classList.remove('opacity-0', 'translate-y-2');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
      }, 2500);
    }

    /* ── Init ── */
    updateCartCount();


    const Products = {

      /* ── Mobile menu ── */
      toggleMenu() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
      },

      /* ── Category filter ── */
      filterCategory(btn, category) {
        // Update active chip styles
        document.querySelectorAll('.filter-chip').forEach(chip => {
          chip.classList.remove('bg-brand', 'text-white', 'border-brand');
          chip.classList.add('bg-white', 'text-gray-500', 'border-gray-200');
        });
        btn.classList.remove('bg-white', 'text-gray-500', 'border-gray-200');
        btn.classList.add('bg-brand', 'text-white', 'border-brand');

        // Show/hide cards
        document.querySelectorAll('.product-card').forEach(card => {
          const match = category === 'all' || card.dataset.category === category;
          card.style.display = match ? 'flex' : 'none';
        });
      },

      /* ── Color variant: swap image ── */
      selectColor(btn) {
        const card = btn.closest('.product-card');

        // Update ring on swatches
        card.querySelectorAll('.color-btn').forEach(b => {
          b.classList.remove('ring-2', 'ring-brand');
        });
        btn.classList.add('ring-2', 'ring-brand');

        // Swap the image
        const imgEl  = card.querySelector('.card-img-display');
        const imgSrc = btn.dataset.img;

        if (imgSrc && imgSrc !== '') {
          // If a real image path is set → render an <img> tag
          imgEl.innerHTML = `<img src="${imgSrc}" alt="${btn.dataset.color}" class="w-full h-full object-cover" />`;
        } else {
          // No image yet → tint the background so user sees color changed
          const hex = btn.dataset.hex;
          imgEl.closest('.relative').style.backgroundColor = hex + '33'; // hex with 20% opacity
        }
      },

      /* ── Size selection ── */
      selectSize(btn) {
        const card = btn.closest('.product-card');
        card.querySelectorAll('.size-btn').forEach(b => {
          b.classList.remove('border-brand', 'text-brand', 'bg-brand-light');
          b.classList.add('border-gray-200', 'text-gray-500');
        });
        btn.classList.remove('border-gray-200', 'text-gray-500');
        btn.classList.add('border-brand', 'text-brand', 'bg-brand-light');
      },

      /* ── Cart helpers ── */
      getCart() {
        return JSON.parse(localStorage.getItem('stepd_cart') || '[]');
      },

      saveCart(cart) {
        localStorage.setItem('stepd_cart', JSON.stringify(cart));
      },

      updateCartCount() {
        const cart  = this.getCart();
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        document.getElementById('cart-count').textContent = total;
      },

      /* ── Add to cart ── */
      addToCart(btn) {
        const card      = btn.closest('.product-card');
        const sizeBtn   = card.querySelector('.size-btn.border-brand');
        const colorBtn  = card.querySelector('.color-btn.ring-brand');

        // Warn if no size selected
        if (!sizeBtn) {
          this.showToast('Please select a size first!', true);
          return;
        }

        const size  = sizeBtn.textContent.trim();
        const color = colorBtn ? colorBtn.dataset.color : 'Default';
        const img   = colorBtn ? colorBtn.dataset.img   : '';
        const id    = btn.dataset.id;
        const name  = btn.dataset.name;
        const price = parseInt(btn.dataset.price);

        const cart     = this.getCart();
        const key      = `${id}-${size}-${color}`;
        const existing = cart.find(i => i.key === key);

        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ key, id, name, price, size, color, img, qty: 1 });
        }

        this.saveCart(cart);
        this.updateCartCount();
        this.showToast(`${name} (${color}, ${size}) added!`);
      },

      /* ── Toast notification ── */
      showToast(msg, isError = false) {
        const toast = document.getElementById('cart-toast');
        toast.textContent = isError ? '⚠ ' + msg : '✓ ' + msg;
        toast.classList.toggle('border-red-500', isError);
        toast.classList.toggle('border-brand', !isError);
        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', 'translate-y-2');
        }, 2500);
      },

      /* ── Init ── */
      init() {
        this.updateCartCount();
      }
    };

    Products.init();