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


    
    const Checkout = {

      /*
      ─────────────────────────────────────
        !! IMPORTANT — YOUR PAYSTACK KEY !!
        Replace the key below with your own
        Paystack PUBLIC key from:
        https://dashboard.paystack.com/#/settings/developer
        It starts with "pk_live_..." (live)
        or "pk_test_..." (testing)
      ─────────────────────────────────────
      */
      PAYSTACK_KEY: 'pk_test_REPLACE_WITH_YOUR_PAYSTACK_PUBLIC_KEY',

      /* ── Mobile menu ── */
      toggleMenu() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
      },

      /* ── Cart helpers ── */
      getCart() {
        return JSON.parse(localStorage.getItem('stepd_cart') || '[]');
      },

      saveCart(cart) {
        localStorage.setItem('stepd_cart', JSON.stringify(cart));
      },

      formatPrice(amount) {
        return '₦' + amount.toLocaleString('en-NG');
      },

      /* ── Update cart count badge ── */
      updateCartCount() {
        const cart  = this.getCart();
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        document.getElementById('cart-count').textContent = total;
      },

      /* ── Calculate totals ── */
      getSubtotal() {
        return this.getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
      },

      getDeliveryFee(subtotal) {
        // Free delivery on orders above ₦20,000
        return subtotal >= 20000 ? 0 : 2500;
      },

      /* ── Remove single item from cart ── */
      removeItem(key) {
        let cart = this.getCart();
        cart = cart.filter(item => item.key !== key);
        this.saveCart(cart);
        this.renderSummary();
        this.updateCartCount();
      },

      /* ── Update item quantity ── */
      updateQty(key, delta) {
        let cart = this.getCart();
        const item = cart.find(i => i.key === key);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
          cart = cart.filter(i => i.key !== key);
        }
        this.saveCart(cart);
        this.renderSummary();
        this.updateCartCount();
      },

      /* ── Clear entire cart ── */
      clearCart() {
        if (!confirm('Are you sure you want to clear your cart?')) return;
        localStorage.removeItem('stepd_cart');
        this.renderSummary();
        this.updateCartCount();
      },

      /* ── Render order summary ── */
      renderSummary() {
        const cart         = this.getCart();
        const container    = document.getElementById('order-items');
        const subtotalEl   = document.getElementById('subtotal');
        const deliveryEl   = document.getElementById('delivery-fee');
        const totalEl      = document.getElementById('total-amount');
        const layout       = document.getElementById('checkout-layout');
        const emptyState   = document.getElementById('empty-cart');
        const payBtn       = document.getElementById('pay-btn');

        // Empty cart state
        if (cart.length === 0) {
          layout.classList.add('hidden');
          emptyState.classList.remove('hidden');
          emptyState.classList.add('flex');
          return;
        }

        layout.classList.remove('hidden');
        emptyState.classList.add('hidden');
        emptyState.classList.remove('flex');

        // Build item rows
        container.innerHTML = cart.map(item => `
          <div class="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">

            <!-- Thumbnail -->
            <div class="w-14 h-14 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0 overflow-hidden">
              ${item.img
                ? `<img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover" />`
                : `<span class="text-2xl">👟</span>`
              }
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">${item.name}</p>
              <p class="text-xs text-gray-400 mt-0.5">${item.color} · Size ${item.size}</p>

              <!-- Qty controls -->
              <div class="flex items-center gap-2 mt-2">
                <button onclick="Checkout.updateQty('${item.key}', -1)"
                  class="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand text-sm font-bold transition-colors">−</button>
                <span class="text-sm font-bold text-gray-900 w-4 text-center">${item.qty}</span>
                <button onclick="Checkout.updateQty('${item.key}', 1)"
                  class="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand text-sm font-bold transition-colors">+</button>
              </div>
            </div>

            <!-- Price + Remove -->
            <div class="flex flex-col items-end gap-2 flex-shrink-0">
              <p class="text-sm font-black text-brand">${this.formatPrice(item.price * item.qty)}</p>
              <button onclick="Checkout.removeItem('${item.key}')"
                class="text-xs text-gray-300 hover:text-red-500 transition-colors font-semibold">
                Remove
              </button>
            </div>

          </div>
        `).join('');

        // Totals
        const subtotal    = this.getSubtotal();
        const deliveryFee = this.getDeliveryFee(subtotal);
        const total       = subtotal + deliveryFee;

        subtotalEl.textContent  = this.formatPrice(subtotal);
        deliveryEl.textContent  = deliveryFee === 0 ? 'Free' : this.formatPrice(deliveryFee);
        deliveryEl.className    = deliveryFee === 0
          ? 'text-green-600 font-semibold text-sm'
          : 'text-gray-900 font-semibold text-sm';
        totalEl.textContent     = this.formatPrice(total);
        payBtn.textContent      = `🔒 Pay ${this.formatPrice(total)} with Paystack`;
      },

      /* ── Validate form ── */
      validateForm() {
        const fields = ['first-name', 'last-name', 'email', 'phone', 'address', 'city', 'state'];
        const errorEl = document.getElementById('form-error');
        let valid = true;

        fields.forEach(id => {
          const el = document.getElementById(id);
          if (!el.value.trim()) {
            el.classList.add('border-red-400');
            valid = false;
          } else {
            el.classList.remove('border-red-400');
          }
        });

        // Basic email check
        const emailVal = document.getElementById('email').value;
        if (emailVal && !emailVal.includes('@')) {
          document.getElementById('email').classList.add('border-red-400');
          valid = false;
        }

        errorEl.classList.toggle('hidden', valid);
        return valid;
      },

      /* ── Paystack payment ── */
      pay() {
        if (!this.validateForm()) return;

        const cart     = this.getCart();
        if (cart.length === 0) return;

        const firstName = document.getElementById('first-name').value.trim();
        const lastName  = document.getElementById('last-name').value.trim();
        const email     = document.getElementById('email').value.trim();
        const phone     = document.getElementById('phone').value.trim();
        const address   = document.getElementById('address').value.trim();
        const city      = document.getElementById('city').value.trim();
        const state     = document.getElementById('state').value;
        const notes     = document.getElementById('notes').value.trim();

        const subtotal    = this.getSubtotal();
        const deliveryFee = this.getDeliveryFee(subtotal);
        const total       = subtotal + deliveryFee;

        // Paystack expects amount in kobo (multiply by 100)
        const handler = PaystackPop.setup({
          key:       this.PAYSTACK_KEY,
          email:     email,
          amount:    total * 100,
          currency:  'NGN',
          ref:       'STEPD-' + Date.now(),
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name',     variable_name: 'customer_name',    value: `${firstName} ${lastName}` },
              { display_name: 'Phone',             variable_name: 'phone',            value: phone },
              { display_name: 'Delivery Address',  variable_name: 'address',          value: `${address}, ${city}, ${state}` },
              { display_name: 'Order Notes',       variable_name: 'notes',            value: notes || 'None' },
              { display_name: 'Items',             variable_name: 'items',            value: cart.map(i => `${i.name} (${i.color}, Sz ${i.size}) x${i.qty}`).join(' | ') },
            ]
          },

          callback: (response) => {
            // Payment successful
            this.onPaymentSuccess(response, `${firstName} ${lastName}`);
          },

          onClose: () => {
            // User closed the Paystack modal without paying
            console.log('Payment window closed');
          }
        });

        handler.openIframe();
      },

      /* ── On successful payment ── */
      onPaymentSuccess(response, customerName) {
        // Clear the cart
        localStorage.removeItem('stepd_cart');
        this.updateCartCount();

        // Show success modal
        document.getElementById('success-name').textContent = `Hi ${customerName}, your order is confirmed! 🎉`;
        document.getElementById('success-ref').textContent  = `Reference: ${response.reference}`;
        document.getElementById('success-modal').classList.remove('hidden');
      },

      /* ── Init ── */
      init() {
        this.updateCartCount();
        this.renderSummary();

        // Re-render if cart changes in another tab
        window.addEventListener('storage', () => {
          this.renderSummary();
          this.updateCartCount();
        });
      }

    };

    Checkout.init();