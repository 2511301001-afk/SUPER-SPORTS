/**
 * SUPER SPORTS - Interactions & Mock Data
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const themeToggle = document.getElementById('theme-toggle');
    const cartBtn = document.querySelector('.cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartModal = document.getElementById('cart-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const cartBadge = document.getElementById('cart-badge');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // --- State ---
    let cartCount = 0;
    let cartTotal = 0;
    const cartData = [];

    // --- Header Scrolled State ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
            header.style.background = getComputedStyle(document.body).getPropertyValue('--bg-primary') + 'f2'; // adding slight transparency
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // --- Mobile Menu Toggle ---
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });

    // --- Theme Toggle (Dark/Light) ---
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        
        if (document.body.classList.contains('light-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // --- Cart Modal Logic ---
    function openCart() {
        cartModal.classList.add('open');
        modalBackdrop.classList.add('show');
        updateCartUI();
    }

    function closeCart() {
        cartModal.classList.remove('open');
        modalBackdrop.classList.remove('show');
    }

    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    modalBackdrop.addEventListener('click', closeCart);

    // Add to Cart Functionality (Mock)
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('.product-title').innerText;
            // Parse price
            let priceText = card.querySelector('.product-price').innerText;
            // Handle if there's an old price span
            if(priceText.includes('$')) {
                const parts = priceText.split('$');
                priceText = parts[parts.length - 1]; // get the last price, which is the current one
            }
            const price = parseFloat(priceText);

            // Add to data array
            cartData.push({ title, price });
            
            // Update counts
            cartCount++;
            cartTotal += price;
            
            // Update Badge
            cartBadge.innerText = cartCount;

            // Visual feedback on button
            const originalText = btn.innerText;
            btn.innerText = "Added!";
            btn.style.background = "var(--accent-green)";
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = ""; // return to css class state
            }, 1000);
        });
    });

    function removeCartItem(index) {
        cartCount--;
        cartTotal -= cartData[index].price;
        cartData.splice(index, 1);
        cartBadge.innerText = cartCount;
        updateCartUI();
    }

    // Attach function to window so inline onclick can find it (for simplicity in mock)
    window.removeCartItem = removeCartItem;

    function updateCartUI() {
        if (cartData.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            cartTotalPrice.innerText = '$0.00';
            return;
        }

        let html = '';
        cartData.forEach((item, index) => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="remove-item" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        cartTotalPrice.innerText = '$' + cartTotal.toFixed(2);
    }

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default if it's just '#'
            if (this.getAttribute('href') === '#') return;
            
            // Allow default for category link since we will smooth scroll but also we handle filtering below
            // Instead we just handle smooth scrolling manually.
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Product Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const productCards = document.querySelectorAll('.product-card');

    function filterProducts(category) {
        // Update active class on filter buttons
        filterBtns.forEach(btn => {
            if(btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Hide/Show products
        productCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                // optional: add a small fade-in animation by resetting animation
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = null; 
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Attach to category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const category = card.getAttribute('data-category');
            if(category) {
                filterProducts(category);
            }
        });
    });

    // Attach to filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-filter');
            filterProducts(category);
        });
    });

    // --- Form Submission Mock ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerText = 'Message Sent Successfully!';
                btn.style.background = 'var(--accent-green)';
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                }, 3000);
            }, 1000);
        });
    }
});
