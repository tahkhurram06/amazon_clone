// ================================
// Cart — localStorage utilities
// ================================
const CART_KEY = 'amazon_cart';
const RECENTLY_KEY = 'amazon_recently';

function addToRecentlyViewed(prod) {
    try {
        var list = JSON.parse(localStorage.getItem(RECENTLY_KEY)) || [];
        list = list.filter(function (p) { return p.name !== prod.name; });
        list.unshift({
            name: prod.name,
            img: prod.img,
            price: parseFloat((prod.price || '$0').replace(/[^0-9.]/g, ''))
        });
        if (list.length > 10) list = list.slice(0, 10);
        localStorage.setItem(RECENTLY_KEY, JSON.stringify(list));
    } catch (e) { }
}

function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}

function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function getCartCount() {
    return loadCart().reduce(function (s, i) { return s + i.qty; }, 0);
}

function syncCartBadge() {
    var el = document.getElementById('cartCount');
    if (el) el.textContent = getCartCount();
}

function addToCart(product, catId) {
    var cart = loadCart();
    var id = catId + '_' + product.name.replace(/\s+/g, '_').toLowerCase();
    var existing = cart.find(function (i) { return i.id === id; });
    var priceNum = parseFloat((product.price || '$0').replace(/[^0-9.]/g, ''));
    var origNum = parseFloat((product.origPrice || product.price || '$0').replace(/[^0-9.]/g, ''));
    if (existing) {
        if (existing.qty < 10) existing.qty += 1;
    } else {
        cart.push({
            id: id,
            name: product.name,
            img: product.img,
            sub: product.sub || '',
            price: priceNum,
            origPrice: origNum,
            qty: 1,
            inStock: true
        });
    }
    saveCart(cart);
    syncCartBadge();
}

// Sync badge on every page load
syncCartBadge();

// ================================
// Footer Year
// ================================
var footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ================================
// Mobile Side Menu
// ================================
var hamburgerBtn = document.getElementById('hamburgerBtn');
var sideMenu = document.getElementById('sideMenu');
var overlay = document.getElementById('overlay');
var closeSideMenuBtn = document.getElementById('closeSideMenu');
var allMenuBtn = document.getElementById('allMenuBtn');

function openSideMenu() {
    sideMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSideMenuFn() {
    sideMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSideMenu);
if (allMenuBtn) allMenuBtn.addEventListener('click', function (e) { e.preventDefault(); openSideMenu(); });
if (closeSideMenuBtn) closeSideMenuBtn.addEventListener('click', closeSideMenuFn);
if (overlay) overlay.addEventListener('click', closeSideMenuFn);

// ================================
// Account Dropdown
// ================================
var accountBtn = document.getElementById('accountBtn');
var accountDropdown = document.getElementById('accountDropdown');

if (accountBtn) {
    accountBtn.addEventListener('mouseenter', function () { accountDropdown.classList.add('open'); });
    accountBtn.parentElement.addEventListener('mouseleave', function () { accountDropdown.classList.remove('open'); });
}

// ================================
// Hero Slider
// ================================
var slides = document.querySelectorAll('.slide');
var dots = document.querySelectorAll('.dot');
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');
var current = 0;
var sliderTimer = null;

function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
}

function startAutoplay() {
    stopAutoplay();
    sliderTimer = setInterval(function () { goTo(current + 1); }, 4500);
}

function stopAutoplay() {
    clearInterval(sliderTimer);
}

if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAutoplay(); });
if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAutoplay(); });
dots.forEach(function (dot) {
    dot.addEventListener('click', function () { goTo(+dot.dataset.index); startAutoplay(); });
});

var heroSlider = document.getElementById('heroSlider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);
}

if (slides.length) startAutoplay();

// ================================
// Category Data
// ================================
var categories = [
    {
        id: 'kitchen',
        title: 'Kitchen & Dining',
        sub: 'Starting from $12',
        link: 'Shop now',
        items: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ZFuKya09pI4LJkDVO_InT-CvkVobw8zUbiy3FISZcQ&s=10', label: 'Coffee Makers' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlvBj0l7t8ewNpCLU-N9maFfboORVHbPi5DBQ0WVHgQ&s=10', label: 'Cookware Sets' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZhcDHBN8Gh2PASfzIW_ytGGvBi4a9HSH3DxW34-I3Q&s=10', label: 'Blenders' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMklhzBNjNjmjfsMT2Fqc8ykbcdsOWzIOoa7gZoKXG2A&s=10', label: 'Storage & Jars' },
        ],
        products: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ZFuKya09pI4LJkDVO_InT-CvkVobw8zUbiy3FISZcQ&s=10', name: 'Premium Coffee Maker', price: '$49.99', origPrice: '$79.99', save: 'Save $30.00', stars: '★★★★☆', rating: '(4,201)', sub: 'Brew 12 cups, programmable', features: ['12-cup capacity with auto shut-off', 'Programmable 24-hr timer', 'Permanent reusable filter', 'Pause & pour feature'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlvBj0l7t8ewNpCLU-N9maFfboORVHbPi5DBQ0WVHgQ&s=10', name: 'Non-stick Cookware Set 10-Pc', price: '$39.99', origPrice: '$64.99', save: 'Save $25.00', stars: '★★★★★', rating: '(8,912)', sub: 'Dishwasher safe, even heat', features: ['PFOA-free non-stick coating', 'Works on all cooktops', 'Tempered glass lids', 'Riveted stainless handles'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZhcDHBN8Gh2PASfzIW_ytGGvBi4a9HSH3DxW34-I3Q&s=10', name: 'Personal Blender 600W', price: '$24.99', origPrice: '$39.99', save: 'Save $15.00', stars: '★★★★☆', rating: '(3,100)', sub: 'With travel cups included', features: ['600W powerful motor', '2 BPA-free 24oz travel cups', 'Easy one-touch operation', 'Dishwasher safe parts'] },
        ]
    },
    {
        id: 'fashion',
        title: 'Fashion for Less',
        sub: 'New styles daily',
        link: 'Explore now',
        items: [
            { img: 'https://m.media-amazon.com/images/I/81QmYmbz-SL._AC_SY500_.jpg', label: 'Women Tops' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUEyB4ssV8FRUrc5D1tryLI1zdYUW-WlABTA&s', label: 'Men Shirts' },
            { img: 'https://forestblu.pk/cdn/shop/files/FIN_9895.jpg?v=1737547192', label: 'Footwear' },
            { img: 'https://www.nitasuri.com/cdn/shop/articles/Hidesign_1200x1200.jpg?v=1508346807', label: 'Accessories' },
        ],
        products: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfO0C9WyR6GUItiueDahwcdPYbyxdaS9mQxw&s', name: "Women's Floral Wrap Dress", price: '$22.99', origPrice: '$38.99', save: 'Save $16.00', stars: '★★★★★', rating: '(6,540)', sub: 'Available in 8 colours', features: ['Soft breathable fabric', 'Available S–XXL', 'Machine washable', 'Flattering wrap silhouette'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUEyB4ssV8FRUrc5D1tryLI1zdYUW-WlABTA&s', name: "Men's Slim-Fit Oxford Shirt", price: '$19.99', origPrice: '$32.99', save: 'Save $13.00', stars: '★★★★☆', rating: '(2,870)', sub: 'Wrinkle-resistant cotton blend', features: ['60% cotton 40% polyester', 'Spread collar', 'Single chest pocket', 'Machine wash cold'] },
            { img: 'https://forestblu.pk/cdn/shop/files/FIN_9895.jpg?v=1737547192', name: 'Running Sneakers Lightweight', price: '$34.99', origPrice: '$54.99', save: 'Save $20.00', stars: '★★★★★', rating: '(11,200)', sub: 'Mesh upper, cushioned sole', features: ['Breathable mesh upper', 'Memory foam insole', 'Slip-resistant rubber outsole', 'Available sizes 6–13'] },
        ]
    },
    {
        id: 'electronics',
        title: 'Electronics',
        sub: 'Top deals today',
        link: 'See all deals',
        items: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq64KLjUQTGoNY35m4lGO9ku6EUa-ybZx5BA&s', label: 'Smartphones' },
            { img: 'https://media.wired.com/photos/6849bc049ce5751a283a2465/master/w_1600%2Cc_limit/Yoga%25209i%2520(14-inch%2C%25202025)%2520Luke%2520Larsen.png', label: 'Laptops' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRbm2MUK2nawuT3kUCu11IWpwRqkjrUi7Etw&s', label: 'Headphones' },
            { img: 'https://cubeonline.pk/cdn/shop/files/3_32a44e3d-b220-49b4-a924-74f06f0837c0_800x.webp?v=1743182179', label: 'Smart Watches' },
        ],
        products: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq64KLjUQTGoNY35m4lGO9ku6EUa-ybZx5BA&s', name: 'Wireless Earbuds ANC Pro', price: '$59.99', origPrice: '$89.99', save: 'Save $30.00', stars: '★★★★☆', rating: '(9,441)', sub: 'Active noise cancelling, 30hr battery', features: ['Active noise cancellation', '30-hour total battery life', 'IPX5 water resistant', 'Bluetooth 5.3'] },
            { img: 'https://media.wired.com/photos/6849bc049ce5751a283a2465/master/w_1600%2Cc_limit/Yoga%25209i%2520(14-inch%2C%25202025)%2520Luke%2520Larsen.png', name: '27" 4K Monitor 144Hz', price: '$229.99', origPrice: '$319.99', save: 'Save $90.00', stars: '★★★★★', rating: '(3,210)', sub: 'IPS panel, FreeSync Premium', features: ['3840×2160 4K UHD', '144Hz refresh rate', 'AMD FreeSync Premium', 'USB-C + HDMI + DisplayPort'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRbm2MUK2nawuT3kUCu11IWpwRqkjrUi7Etw&s', name: 'Smart Home Hub Plus', price: '$79.99', origPrice: '$119.99', save: 'Save $40.00', stars: '★★★★☆', rating: '(5,088)', sub: 'Voice control, 10 device slots', features: ['Works with Alexa & Google', 'Controls up to 10 devices', 'Built-in Zigbee hub', '2.4GHz + 5GHz Wi-Fi'] },
        ]
    },
    {
        id: 'gaming',
        title: 'Gaming',
        sub: 'Controllers, gear & more',
        link: 'Shop gaming',
        items: [
            { img: 'https://cdn.thewirecutter.com/wp-content/media/2025/04/BEST-PC-GAMING-CONTROLLERS-2048px-7242-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp', label: 'Controllers' },
            { img: 'https://m.media-amazon.com/images/I/91XqyL7RiYL.jpg', label: 'Headsets' },
            { img: 'https://i5.walmartimages.com/seo/Redragon-Impact-Elite-M913-RGB-USB-2-4G-Wireless-Gaming-Mouse-16000-DPI-16-Buttons-Programmable-Ergonomic-Mouse-PC-for-Gamers_8e00332e-be17-4ee2-a095-5e7a2bd5a6f8.fe471de95036b0486e7afb1f10f60f01.jpeg', label: 'Gaming Mice' },
            { img: 'https://img.drz.lazcdn.com/static/pk/p/5fe284c90ac95ee4eb31b0f2269b73ba.jpg_960x960q80.jpg_.webp', label: 'Keyboards' },
        ],
        products: [
            { img: 'https://cdn.thewirecutter.com/wp-content/media/2025/04/BEST-PC-GAMING-CONTROLLERS-2048px-7242-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp', name: 'Pro Wireless Gaming Controller', price: '$44.99', origPrice: '$64.99', save: 'Save $20.00', stars: '★★★★★', rating: '(7,823)', sub: 'PC, PS4, Switch compatible', features: ['Ergonomic grip design', '20-hour battery life', '2.4GHz lag-free wireless', 'Turbo & macro buttons'] },
            { img: 'https://m.media-amazon.com/images/I/91XqyL7RiYL.jpg', name: '7.1 Surround Sound Gaming Headset', price: '$34.99', origPrice: '$54.99', save: 'Save $20.00', stars: '★★★★☆', rating: '(4,501)', sub: 'Noise-cancelling mic, RGB', features: ['7.1 virtual surround sound', 'Noise-cancelling flip mic', 'RGB LED lighting', 'Compatible PC/PS/Xbox'] },
            { img: 'https://i5.walmartimages.com/seo/Redragon-Impact-Elite-M913-RGB-USB-2-4G-Wireless-Gaming-Mouse-16000-DPI-16-Buttons-Programmable-Ergonomic-Mouse-PC-for-Gamers_8e00332e-be17-4ee2-a095-5e7a2bd5a6f8.fe471de95036b0486e7afb1f10f60f01.jpeg', name: 'Mechanical Gaming Keyboard TKL', price: '$54.99', origPrice: '$79.99', save: 'Save $25.00', stars: '★★★★★', rating: '(6,110)', sub: 'Red switches, RGB backlit', features: ['Tenkeyless compact layout', 'Red linear switches', 'Per-key RGB backlight', 'Anti-ghosting N-key rollover'] },
        ]
    },
    {
        id: 'home',
        title: 'Home Essentials',
        sub: 'Refresh your space',
        link: 'Shop home',
        items: [
            { img: 'https://m.media-amazon.com/images/I/81QmYmbz-SL._AC_SY500_.jpg', label: 'Bedding' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlvBj0l7t8ewNpCLU-N9maFfboORVHbPi5DBQ0WVHgQ&s=10', label: 'Storage' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZhcDHBN8Gh2PASfzIW_ytGGvBi4a9HSH3DxW34-I3Q&s=10', label: 'Lighting' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMklhzBNjNjmjfsMT2Fqc8ykbcdsOWzIOoa7gZoKXG2A&s=10', label: 'Décor' },
        ],
        products: [
            { img: 'https://m.media-amazon.com/images/I/81QmYmbz-SL._AC_SY500_.jpg', name: 'Queen Microfibre Comforter Set', price: '$42.99', origPrice: '$69.99', save: 'Save $27.00', stars: '★★★★★', rating: '(12,340)', sub: '8-piece, all-season', features: ['Ultra-soft microfibre fill', '8-piece complete set', 'Machine washable', 'Hypoallergenic'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZhcDHBN8Gh2PASfzIW_ytGGvBi4a9HSH3DxW34-I3Q&s=10', name: 'LED Desk Lamp with USB Charging', price: '$28.99', origPrice: '$44.99', save: 'Save $16.00', stars: '★★★★☆', rating: '(3,800)', sub: '5 colour modes, memory function', features: ['5 colour temperatures', '5 brightness levels', 'USB-A charging port', 'Touch-sensitive controls'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlvBj0l7t8ewNpCLU-N9maFfboORVHbPi5DBQ0WVHgQ&s=10', name: 'Stackable Storage Bins 6-Pack', price: '$19.99', origPrice: '$32.99', save: 'Save $13.00', stars: '★★★★★', rating: '(5,600)', sub: 'BPA-free, fridge safe', features: ['BPA-free durable plastic', 'Airtight snap lids', 'Clear body to see contents', 'Stackable & fridge-safe'] },
        ]
    },
    {
        id: 'beauty',
        title: 'Beauty & Personal Care',
        sub: 'Top-rated products',
        link: 'Shop beauty',
        items: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq64KLjUQTGoNY35m4lGO9ku6EUa-ybZx5BA&s', label: 'Skincare' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRbm2MUK2nawuT3kUCu11IWpwRqkjrUi7Etw&s', label: 'Hair Care' },
            { img: 'https://cubeonline.pk/cdn/shop/files/3_32a44e3d-b220-49b4-a924-74f06f0837c0_800x.webp?v=1743182179', label: 'Fragrances' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ZFuKya09pI4LJkDVO_InT-CvkVobw8zUbiy3FISZcQ&s=10', label: 'Oral Care' },
        ],
        products: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq64KLjUQTGoNY35m4lGO9ku6EUa-ybZx5BA&s', name: 'Vitamin C Serum 30ml', price: '$14.99', origPrice: '$24.99', save: 'Save $10.00', stars: '★★★★★', rating: '(18,900)', sub: 'Brightening, anti-ageing', features: ['20% Vitamin C + Hyaluronic Acid', 'Reduces dark spots in 4 weeks', 'Dermatologist tested', 'Suitable for all skin types'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRbm2MUK2nawuT3kUCu11IWpwRqkjrUi7Etw&s', name: 'Ionic Hair Dryer 1800W', price: '$29.99', origPrice: '$49.99', save: 'Save $20.00', stars: '★★★★☆', rating: '(7,450)', sub: 'Negative ion, 3 heat settings', features: ['1800W powerful motor', 'Negative ion technology', '3 heat + 2 speed settings', 'Concentrator nozzle included'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ZFuKya09pI4LJkDVO_InT-CvkVobw8zUbiy3FISZcQ&s=10', name: 'Electric Toothbrush Sonic 5-Mode', price: '$24.99', origPrice: '$39.99', save: 'Save $15.00', stars: '★★★★★', rating: '(9,220)', sub: '4 brush heads, 30-day battery', features: ['40,000 strokes/min sonic motor', '5 cleaning modes', '4 replacement brush heads', '30-day battery on one charge'] },
        ]
    },
    {
        id: 'sports',
        title: 'Sports & Outdoors',
        sub: 'Gear up for your goals',
        link: 'Shop sports',
        items: [
            { img: 'https://cdn.thewirecutter.com/wp-content/media/2025/04/BEST-PC-GAMING-CONTROLLERS-2048px-7242-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp', label: 'Fitness' },
            { img: 'https://m.media-amazon.com/images/I/91XqyL7RiYL.jpg', label: 'Outdoor' },
            { img: 'https://i5.walmartimages.com/seo/Redragon-Impact-Elite-M913-RGB-USB-2-4G-Wireless-Gaming-Mouse-16000-DPI-16-Buttons-Programmable-Ergonomic-Mouse-PC-for-Gamers_8e00332e-be17-4ee2-a095-5e7a2bd5a6f8.fe471de95036b0486e7afb1f10f60f01.jpeg', label: 'Cycling' },
            { img: 'https://img.drz.lazcdn.com/static/pk/p/5fe284c90ac95ee4eb31b0f2269b73ba.jpg_960x960q80.jpg_.webp', label: 'Yoga' },
        ],
        products: [
            { img: 'https://cdn.thewirecutter.com/wp-content/media/2025/04/BEST-PC-GAMING-CONTROLLERS-2048px-7242-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp', name: 'Adjustable Dumbbell Set 5–52 lb', price: '$139.99', origPrice: '$189.99', save: 'Save $50.00', stars: '★★★★★', rating: '(4,630)', sub: 'Replaces 15 sets of weights', features: ['Adjusts in 2.5 lb increments', 'Compact tray storage', 'Durable moulded plastic', 'Great for home gyms'] },
            { img: 'https://m.media-amazon.com/images/I/91XqyL7RiYL.jpg', name: 'Yoga Mat Non-slip 6mm', price: '$17.99', origPrice: '$27.99', save: 'Save $10.00', stars: '★★★★☆', rating: '(22,100)', sub: '72" long, carrying strap', features: ['Extra thick 6mm cushioning', 'Non-slip textured surface', 'Moisture-wicking top layer', 'Includes carrying strap'] },
            { img: 'https://i5.walmartimages.com/seo/Redragon-Impact-Elite-M913-RGB-USB-2-4G-Wireless-Gaming-Mouse-16000-DPI-16-Buttons-Programmable-Ergonomic-Mouse-PC-for-Gamers_8e00332e-be17-4ee2-a095-5e7a2bd5a6f8.fe471de95036b0486e7afb1f10f60f01.jpeg', name: 'Resistance Bands Set 5-Pack', price: '$12.99', origPrice: '$19.99', save: 'Save $7.00', stars: '★★★★★', rating: '(15,400)', sub: '10–50 lb progressive levels', features: ['5 resistance levels 10–50 lb', 'Natural latex construction', 'Stackable up to 150 lb', 'Includes door anchor & guide'] },
        ]
    },
    {
        id: 'books',
        title: 'Books & Stationery',
        sub: 'Bestsellers & more',
        link: 'Browse books',
        items: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfO0C9WyR6GUItiueDahwcdPYbyxdaS9mQxw&s', label: 'Fiction' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUEyB4ssV8FRUrc5D1tryLI1zdYUW-WlABTA&s', label: 'Non-Fiction' },
            { img: 'https://forestblu.pk/cdn/shop/files/FIN_9895.jpg?v=1737547192', label: "Children's" },
            { img: 'https://www.nitasuri.com/cdn/shop/articles/Hidesign_1200x1200.jpg?v=1508346807', label: 'Stationery' },
        ],
        products: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfO0C9WyR6GUItiueDahwcdPYbyxdaS9mQxw&s', name: 'Atomic Habits – James Clear', price: '$13.99', origPrice: '$18.99', save: 'Save $5.00', stars: '★★★★★', rating: '(98,400)', sub: 'Paperback · 320 pages', features: ['#1 New York Times Bestseller', 'Proven framework for habits', 'Practical strategies & case studies', 'Great for personal development'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUEyB4ssV8FRUrc5D1tryLI1zdYUW-WlABTA&s', name: 'The Creative Act – Rick Rubin', price: '$17.99', origPrice: '$26.99', save: 'Save $9.00', stars: '★★★★☆', rating: '(12,300)', sub: 'Hardcover · 432 pages', features: ['Explores nature of creativity', 'By legendary music producer', 'Philosophical & practical insights', 'Beautifully designed edition'] },
            { img: 'https://forestblu.pk/cdn/shop/files/FIN_9895.jpg?v=1737547192', name: 'Premium Bullet Journal A5', price: '$16.99', origPrice: '$24.99', save: 'Save $8.00', stars: '★★★★★', rating: '(6,780)', sub: 'Dotted, 200gsm, lay flat', features: ['200gsm thick dotted pages', 'Lay-flat hardcover binding', 'Ribbon bookmark & pocket', 'Numbered pages with index'] },
        ]
    },
];

// ================================
// Build Category Cards
// ================================
function buildCards() {
    var grid = document.getElementById('categoryGrid');
    if (!grid) return;

    grid.innerHTML = categories.map(function (cat, catIdx) {
        if (cat.sliderOnly) return '';
        return '<div class="cat-card" onclick="openCatModal(' + catIdx + ')">' +
            '<h3>' + cat.title + '</h3>' +
            (cat.sub ? '<p class="sub-label">' + cat.sub + '</p>' : '') +
            '<div class="card-grid-2x2">' +
            cat.items.map(function (item) {
                return '<div>' +
                    '<div class="card-thumb">' +
                    '<img src="' + item.img + '" alt="' + item.label + '" onerror="this.style.background=\'#f0f2f2\'" loading="lazy">' +
                    '</div>' +
                    '<p class="thumb-label">' + item.label + '</p>' +
                    '</div>';
            }).join('') +
            '</div>' +
            '<a class="card-footer" href="#">' + cat.link + '</a>' +
            '</div>';
    }).join('');
}

buildCards();

// ================================
// Product Modal — track current product
// ================================
var modalOverlay = document.getElementById('modalOverlay');
var modalClose = document.getElementById('modalClose');

var currentCatIdx = 0;
var currentProdIdx = 0;

window.openCatModal = function (catIdx) {
    currentCatIdx = catIdx;
    currentProdIdx = 0;
    var cat = categories[catIdx];
    var prod = cat.products[0];
    openProductModal(prod, cat, catIdx, 0);
};

function openProductModal(prod, cat, catIdx, prodIdx) {
    currentCatIdx = catIdx;
    currentProdIdx = prodIdx;

    addToRecentlyViewed(prod);

    var mainImg = document.getElementById('modalMainImg');
    mainImg.src = prod.img;
    mainImg.alt = prod.name;

    var thumbsEl = document.getElementById('modalThumbs');
    thumbsEl.innerHTML = cat.products.map(function (p, i) {
        return '<img src="' + p.img + '" alt="' + p.name + '" class="modal-thumb-img ' + (i === prodIdx ? 'active-thumb' : '') + '" onclick="switchModalProduct(' + catIdx + ',' + i + ')" onerror="this.style.background=\'#eee\'" loading="lazy">';
    }).join('');

    document.getElementById('modalTitle').textContent = prod.name;
    document.getElementById('modalSub').textContent = prod.sub;
    document.getElementById('modalStars').textContent = prod.stars;
    document.getElementById('modalRatingCount').textContent = prod.rating;
    document.getElementById('modalOrigPrice').textContent = prod.origPrice ? 'List: ' + prod.origPrice : '';
    document.getElementById('modalPrice').textContent = prod.price;
    document.getElementById('modalSave').textContent = prod.save || '';

    var featEl = document.getElementById('modalFeatures');
    featEl.innerHTML = (prod.features || []).map(function (f) {
        return '<div class="modal-feature">' + f + '</div>';
    }).join('');

    document.getElementById('modalCatTitle').textContent = 'More in ' + cat.title;
    var itemsGrid = document.getElementById('modalItemsGrid');
    itemsGrid.innerHTML = cat.items.map(function (item) {
        return '<div class="modal-item">' +
            '<img src="' + item.img + '" alt="' + item.label + '" class="modal-item-img" onerror="this.style.background=\'#f5f5f5\'" loading="lazy">' +
            '<p class="modal-item-name">' + item.label + '</p>' +
            '</div>';
    }).join('');

    var btn = document.getElementById('modalAddCart');
    if (btn) { btn.textContent = 'Add to Cart'; btn.style.background = ''; }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

window.switchModalProduct = function (catIdx, prodIdx) {
    currentCatIdx = catIdx;
    currentProdIdx = prodIdx;

    var cat = categories[catIdx];
    var prod = cat.products[prodIdx];

    document.getElementById('modalMainImg').src = prod.img;
    document.getElementById('modalTitle').textContent = prod.name;
    document.getElementById('modalSub').textContent = prod.sub;
    document.getElementById('modalStars').textContent = prod.stars;
    document.getElementById('modalRatingCount').textContent = prod.rating;
    document.getElementById('modalOrigPrice').textContent = prod.origPrice ? 'List: ' + prod.origPrice : '';
    document.getElementById('modalPrice').textContent = prod.price;
    document.getElementById('modalSave').textContent = prod.save || '';

    var featEl = document.getElementById('modalFeatures');
    featEl.innerHTML = (prod.features || []).map(function (f) {
        return '<div class="modal-feature">' + f + '</div>';
    }).join('');

    document.querySelectorAll('.modal-thumb-img').forEach(function (img, i) {
        img.classList.toggle('active-thumb', i === prodIdx);
    });

    var btn = document.getElementById('modalAddCart');
    if (btn) { btn.textContent = 'Add to Cart'; btn.style.background = ''; }
};

function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
});

// ================================
// Add to Cart — saves to localStorage
// ================================
var addCartBtn = document.getElementById('modalAddCart');
if (addCartBtn) {
    addCartBtn.addEventListener('click', function () {
        var cat = categories[currentCatIdx];
        var prod = cat.products[currentProdIdx];

        addToCart(prod, cat.id);

        addCartBtn.textContent = 'Added ✓';
        addCartBtn.style.background = '#28a745';
        setTimeout(function () {
            addCartBtn.textContent = 'Add to Cart';
            addCartBtn.style.background = '';
        }, 1800);
    });
}

// ================================
// Back to Top
// ================================
var backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    window.addEventListener('scroll', function () {
        backToTop.classList.toggle('active', window.scrollY > 100);
    });
    backToTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ================================
// Product Sliders Data (original 2)
// ================================
var sliderSections = [
    {
        id: 'bestsellers_clothing',
        title: 'Best Sellers in Clothing, Shoes & Jewelry',
        seeAllText: 'See all best sellers',
        products: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Hanes Men's T-Shirt 6-Pack Tagless Cotton Crew", price: '$21.99', origPrice: '$34.99', save: 'Save $13.00', stars: '★★★★★', rating: '(62,400)', sub: 'Tagless, pre-shrunk, S–3XL', features: ['100% pre-shrunk cotton', 'Tagless neck label — no itch', 'Reinforced collar stays in shape', 'Available S to 3XL in 5 colours'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Carhartt Men's K87 Pocket T-Shirt", price: '$18.99', origPrice: '$26.99', save: 'Save $8.00', stars: '★★★★★', rating: '(38,700)', sub: 'Heavyweight 6.75 oz, workwear fit', features: ['6.75 oz heavyweight cotton blend', 'Left chest pocket', 'Rib-knit collar holds shape', 'Available in 20+ colours'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Fruit of the Loom Men's White Crew Tees 5-Pack", price: '$14.99', origPrice: '$22.99', save: 'Save $8.00', stars: '★★★★★', rating: '(44,200)', sub: 'Classic fit, eversoft fabric', features: ['Eversoft fabric stays softer longer', 'Stays-new collar welt', 'Tag-free design', 'Machine washable'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Amazon Essentials Women's Classic-Fit Short-Sleeve T-Shirt", price: '$12.90', origPrice: '$19.99', save: 'Save $7.09', stars: '★★★★☆', rating: '(29,500)', sub: 'Relaxed jersey knit, XS–5X', features: ['Relaxed classic fit', 'Lightweight jersey knit', 'Available in 30+ colours', 'Machine wash cold'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Crocs Unisex Classic Clog", price: '$44.99', origPrice: '$59.99', save: 'Save $15.00', stars: '★★★★★', rating: '(87,600)', sub: 'Lightweight Croslite foam, sizes 4–15', features: ['Lightweight Croslite foam construction', 'Ventilation ports add breathability', 'Pivoting heel straps for fit', 'Easy to clean, odour-resistant'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Levi's Women's 501 Original Fit Jean", price: '$39.99', origPrice: '$59.50', save: 'Save $19.51', stars: '★★★★☆', rating: '(21,300)', sub: 'High-rise, straight leg, 00–18', features: ['Iconic high-rise straight silhouette', '5-pocket styling', '99% cotton for authentic feel', 'Available in 8 washes'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Amazon Essentials Men's Slim-Fit Chino Pant", price: '$27.50', origPrice: '$39.99', save: 'Save $12.49', stars: '★★★★★', rating: '(17,800)', sub: 'Stretch twill, 28"–40" waist', features: ['Stretch cotton-blend twill', 'Slim fit through hip and thigh', '5-pocket styling', 'Machine wash & tumble dry'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Dickies Men's Relaxed Fit Straight-Leg Cargo Pant", price: '$28.99', origPrice: '$42.99', save: 'Save $14.00', stars: '★★★★★', rating: '(33,100)', sub: 'Stain & wrinkle resistant, 30"–44"', features: ['Stain & wrinkle resistant fabric', 'Relaxed seat & thigh', 'Multi-pocket cargo design', 'Reinforced seams for durability'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Under Armour Men's Tech 2.0 Short-Sleeve T-Shirt", price: '$22.00', origPrice: '$30.00', save: 'Save $8.00', stars: '★★★★★', rating: '(24,900)', sub: 'HeatGear fabric, anti-odour tech', features: ['Charged Cotton tech stays dry', 'Material wicks sweat & dries fast', 'Anti-odour technology built in', 'Fitted cut, 4-way stretch'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Skechers Men's Go Walk Max Slip-On Sneaker", price: '$54.99', origPrice: '$79.99', save: 'Save $25.00', stars: '★★★★★', rating: '(15,600)', sub: 'Max Cushioning insole, memory foam', features: ['Air-cooled Memory Foam insole', 'Lightweight cushioned midsole', 'Easy slip-on design', 'Machine washable upper'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Hanes Women's Originals Jogger Sweatpants", price: '$18.00', origPrice: '$26.00', save: 'Save $8.00', stars: '★★★★★', rating: '(19,200)', sub: 'Soft fleece, pockets, XS–2X', features: ['Soft fleece fabric blend', 'Side pockets & back pocket', 'Adjustable drawstring waist', 'Ribbed cuffs at ankles'] },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgy2qj-89wktpxdHFl8mbaPKMT8OotWyKLA&s', name: "Columbia Men's Watertight II Packable Rain Jacket", price: '$59.99', origPrice: '$80.00', save: 'Save $20.01', stars: '★★★★☆', rating: '(28,400)', sub: 'Omni-Tech waterproof, packable', features: ['Omni-Tech waterproof/breathable shell', 'Packable into its own pocket', 'Adjustable hood & cuffs', 'Zippered side pockets'] }
        ]
    },
    {
        id: 'popular_season',
        title: 'Popular Items This Season',
        seeAllText: 'See all popular items',
        products: [
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'HoMedics Ultrasonic Cool Mist Humidifier', price: '$34.99', origPrice: '$49.99', save: 'Save $15.00', stars: '★★★★☆', rating: '(12,300)', sub: '1.5 Gal, auto shut-off, whisper quiet', features: ['1.5-gallon tank runs up to 16 hrs', 'Auto shut-off when empty', 'Whisper-quiet ultrasonic operation', 'Adjustable mist output'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Crest 3D Whitestrips Glamorous White 14 Treatments', price: '$27.99', origPrice: '$44.99', save: 'Save $17.00', stars: '★★★★★', rating: '(31,800)', sub: 'Noticeably whiter in 3 days', features: ['14 treatments = 28 strips', 'Noticeably whiter teeth in 3 days', 'Enamel-safe whitening formula', 'No-slip grip stays on while worn'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Crest 3DWhite Brilliance Toothpaste 3-Pack', price: '$14.97', origPrice: '$22.99', save: 'Save $8.02', stars: '★★★★★', rating: '(48,600)', sub: 'Vibrant Peppermint, 4.6 oz each', features: ['Whitens teeth in 3 days', 'Removes up to 95% of surface stains', 'Fluoride protection', 'Enamel-safe daily formula'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Crest 3D White Deep Stain Remover Toothpaste 2-Pack', price: '$11.97', origPrice: '$17.99', save: 'Save $6.02', stars: '★★★★★', rating: '(22,100)', sub: 'Removes 10-year old stains', features: ['Removes stains up to 10 years old', 'Micro-cleansing whiteners formula', 'Fluoride cavity protection', 'ADA accepted'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Crest 3DWhite Brilliance 4.6oz Toothpaste Value Pack', price: '$9.99', origPrice: '$14.99', save: 'Save $5.00', stars: '★★★★★', rating: '(57,400)', sub: 'Whiter teeth in 3 days, peppermint', features: ['Whiter teeth in just 3 days', 'Deep cleans & polishes', 'Prevents future stains', 'Refreshing vibrant peppermint flavour'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Oral-B Pro 1000 Electric Rechargeable Toothbrush', price: '$49.94', origPrice: '$79.99', save: 'Save $30.05', stars: '★★★★★', rating: '(67,200)', sub: 'CrossAction head, 1 mode', features: ['CrossAction brush head', 'Removes 300% more plaque', 'Pressure sensor stops overdoing it', '2-min timer with 30-sec quadrant'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Arm & Hammer Spinbrush Pro Clean Battery Toothbrush', price: '$6.97', origPrice: '$10.99', save: 'Save $4.02', stars: '★★★★☆', rating: '(8,900)', sub: 'Battery powered, soft bristles', features: ['Dual-action spinning & oscillating', 'Soft/medium replaceable brush head', 'AA battery included', 'Ergonomic handle grip'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Listerine Cool Mint Antiseptic Mouthwash 1L', price: '$6.97', origPrice: '$10.49', save: 'Save $3.52', stars: '★★★★★', rating: '(24,600)', sub: 'Kills 99.9% of bad-breath germs', features: ['Kills 99.9% of germs causing bad breath', 'ADA accepted for fighting plaque', 'Cool mint flavour', '1 litre value size'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Sensodyne Pronamel Gentle Whitening Toothpaste 2-Pack', price: '$12.49', origPrice: '$18.99', save: 'Save $6.50', stars: '★★★★★', rating: '(14,700)', sub: 'Strengthens enamel, gentle whitening', features: ['Strengthens and re-hardens enamel', 'Gentle daily whitening', 'Fluoride cavity protection', 'Low-abrasion formula'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Philips Sonicare ProtectiveClean 4100 Toothbrush', price: '$39.95', origPrice: '$59.95', save: 'Save $20.00', stars: '★★★★★', rating: '(36,500)', sub: 'BrushSync pressure sensor, 2-min timer', features: ['Up to 62,000 brush movements/min', 'Pressure sensor protects gums', 'Interval timer every 30 sec', '14-day battery life'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'Colgate Total Whitening Toothpaste 6-Pack 4.8oz', price: '$16.49', origPrice: '$24.99', save: 'Save $8.50', stars: '★★★★★', rating: '(19,400)', sub: '12hr antibacterial protection', features: ['12-hour antibacterial protection', 'Whitens while it cleans', 'Strengthens enamel', 'Fights cavities, plaque & gingivitis'] },
            { img: 'https://m.media-amazon.com/images/G/01/flips/2026/Toys/Browse/26Flips_Toys_SpringSummer_15055_Browse_Herotator_MOB_770x584._SX621_QL85_.jpg', name: 'GUM Soft-Picks Advanced Dental Picks 250-Count', price: '$9.97', origPrice: '$14.99', save: 'Save $5.02', stars: '★★★★☆', rating: '(11,800)', sub: 'Rubber bristles, stimulates gums', features: ['Flexible rubber bristles', 'Removes food & plaque between teeth', 'Gentle on gums, dentist recommended', '250 picks per bag'] }
        ]
    }
];

// ================================
// Extra Slider Sections (2 new — 12 pics each)
// ================================
var extraSliderSections = [
    {
        id: 'top_computers',
        title: 'Best Sellers in Computers & Accessories',
        seeAllText: 'See all in Computers',
        products: [
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', name: 'Logitech MX Master 3S Wireless Mouse', price: '$89.99', origPrice: '$109.99', save: 'Save $20.00', stars: '★★★★★', rating: '(14,200)', sub: '8K DPI, silent clicks, USB-C', features: ['8,000 DPI sensor on any surface', 'Quiet click buttons', 'USB-C fast charging', 'Ergonomic sculpted design'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Samsung 1TB T7 Portable SSD', price: '$89.99', origPrice: '$129.99', save: 'Save $40.00', stars: '★★★★★', rating: '(28,100)', sub: 'USB 3.2 Gen 2, 1050MB/s', features: ['1050MB/s read speed', 'USB 3.2 Gen 2 interface', 'Shock-resistant AES 256-bit', 'Compact lightweight design'] },
            { img: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL320_.jpg', name: 'Anker USB-C Hub 7-in-1', price: '$35.99', origPrice: '$49.99', save: 'Save $14.00', stars: '★★★★★', rating: '(19,800)', sub: '4K HDMI, 100W PD, 5Gbps USB', features: ['4K@30Hz HDMI output', '100W Power Delivery pass-through', '3x USB-A 5Gbps ports', 'SD & microSD card readers'] },
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', name: 'CORSAIR K70 RGB Mechanical Keyboard', price: '$109.99', origPrice: '$149.99', save: 'Save $40.00', stars: '★★★★★', rating: '(11,500)', sub: 'Cherry MX Red, per-key RGB', features: ['Cherry MX Red linear switches', 'Per-key dynamic RGB backlight', 'Aircraft-grade anodised aluminium', 'Dedicated multimedia controls'] },
            { img: 'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_SL320_.jpg', name: 'WD 2TB Elements Portable Hard Drive', price: '$54.99', origPrice: '$79.99', save: 'Save $25.00', stars: '★★★★★', rating: '(33,900)', sub: 'USB 3.0, plug & play', features: ['USB 3.0 & 2.0 compatible', 'Plug-and-play formatting', 'Compact pocket-sized design', 'WD quality & reliability'] },
            { img: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL320_.jpg', name: 'Anker Wireless Charging Pad 15W', price: '$15.99', origPrice: '$24.99', save: 'Save $9.00', stars: '★★★★☆', rating: '(22,400)', sub: 'Qi certified, multi-device', features: ['15W fast wireless charging', 'Qi-certified universal compatibility', 'LED charging indicator', 'Non-slip surface pad'] },
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', name: 'TP-Link AX3000 Wi-Fi 6 Router', price: '$79.99', origPrice: '$109.99', save: 'Save $30.00', stars: '★★★★★', rating: '(9,600)', sub: 'Dual band, 3.0 Gbps total', features: ['Wi-Fi 6 AX3000 technology', 'OFDMA & MU-MIMO support', '4 Gigabit LAN ports', 'Easy app-based setup'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Razer DeathAdder V3 Gaming Mouse', price: '$69.99', origPrice: '$99.99', save: 'Save $30.00', stars: '★★★★★', rating: '(7,300)', sub: '30K DPI optical, 90hr battery', features: ['30,000 DPI Focus Pro sensor', '90-hour battery life wireless', 'Razer HyperSpeed 2.4GHz', 'Ergonomic lightweight 63g'] },
            { img: 'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_SL320_.jpg', name: 'Seagate 4TB Backup Plus Desktop Drive', price: '$79.99', origPrice: '$109.99', save: 'Save $30.00', stars: '★★★★☆', rating: '(16,200)', sub: 'USB 3.0, 2-year data recovery', features: ['4TB of storage capacity', 'USB 3.0 high-speed transfer', 'Works PC & Mac out of box', '2-year data recovery services'] },
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', name: 'Dell 27" S2722DC USB-C Monitor', price: '$249.99', origPrice: '$329.99', save: 'Save $80.00', stars: '★★★★★', rating: '(5,100)', sub: 'QHD IPS, 75Hz, USB-C 65W', features: ['2560x1440 QHD IPS panel', '75Hz refresh rate', 'USB-C 65W power delivery', 'AMD FreeSync adaptive sync'] },
            { img: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL320_.jpg', name: 'Crucial 32GB DDR4 RAM Kit', price: '$59.99', origPrice: '$84.99', save: 'Save $25.00', stars: '★★★★★', rating: '(18,700)', sub: '2x16GB, 3200MT/s, PC4-25600', features: ['2x16GB dual-channel kit', '3200 MT/s DDR4 speed', 'Compatible with Intel & AMD', 'Unbuffered non-ECC UDIMM'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Webcam 4K with Ring Light 60fps', price: '$79.99', origPrice: '$119.99', save: 'Save $40.00', stars: '★★★★☆', rating: '(6,800)', sub: 'Sony sensor, built-in mic, USB-C', features: ['4K Sony STARVIS sensor', '60fps silky smooth video', 'Built-in noise-cancelling mic', 'Adjustable ring light 3 modes'] }
        ]
    },
    {
        id: 'top_picks_pakistan',
        title: 'Top Picks for Pakistan',
        seeAllText: 'See all top picks',
        products: [
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Philips Air Purifier AC1215 True HEPA', price: '$129.99', origPrice: '$179.99', save: 'Save $50.00', stars: '★★★★★', rating: '(8,200)', sub: 'Removes 99.97% particles, 269 sq ft', features: ['True HEPA H13 filter', 'Removes allergens, dust & smoke', 'Auto mode with air quality sensor', 'Quiet sleep mode 16.5 dB'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Dawlance 1.5 Ton DC Inverter AC', price: '$599.99', origPrice: '$749.99', save: 'Save $150.00', stars: '★★★★★', rating: '(4,100)', sub: 'A+++ energy rating, wifi control', features: ['A+++ energy efficiency rating', 'DC inverter compressor technology', 'Wi-Fi smart app control', '5 year compressor warranty'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Haier 16kg Top-Load Washing Machine', price: '$399.99', origPrice: '$499.99', save: 'Save $100.00', stars: '★★★★☆', rating: '(3,400)', sub: 'Fully automatic, 8 wash programs', features: ['16 kg large capacity tub', '8 wash programs + quick wash', 'Child safety lock feature', 'Automatic imbalance detection'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Xiaomi Mi 11i 5G Smartphone 8+256GB', price: '$349.99', origPrice: '$449.99', save: 'Save $100.00', stars: '★★★★★', rating: '(6,900)', sub: 'Snapdragon 888, 108MP, AMOLED', features: ['Snapdragon 888 5G chipset', '108MP triple camera system', '120Hz AMOLED display', '4520mAh with 67W fast charge'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Reckitt Dettol Antibacterial Soap 6-Pack', price: '$12.99', origPrice: '$18.99', save: 'Save $6.00', stars: '★★★★★', rating: '(21,300)', sub: 'Kills 99.9% germs, original scent', features: ['Kills 99.9% of bacteria & viruses', 'Trusted by hospitals worldwide', 'pH balanced for sensitive skin', '6 x 100g value pack'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'National Pressure Cooker 10-Litre', price: '$49.99', origPrice: '$69.99', save: 'Save $20.00', stars: '★★★★★', rating: '(9,700)', sub: 'Stainless steel, safety valve', features: ['18/10 food-grade stainless steel', 'Multiple safety pressure valves', 'Suitable for all cooktops', '5-year manufacturer warranty'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Lahori Zeera Sparkling Drink 6-Can Pack', price: '$8.99', origPrice: '$13.99', save: 'Save $5.00', stars: '★★★★☆', rating: '(5,500)', sub: 'Original cumin soda, 250ml each', features: ['Authentic zeera/cumin flavour', 'Naturally sparkling formula', 'No artificial preservatives', '6 x 250ml convenient pack'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Orient Venus 50" 4K Smart TV', price: '$499.99', origPrice: '$649.99', save: 'Save $150.00', stars: '★★★★★', rating: '(3,800)', sub: 'Android TV, HDR10, Dolby Audio', features: ['50" 4K UHD LED panel', 'Android TV 11 built-in', 'HDR10 & HLG support', 'Dolby Audio + DTS surround'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Kenwood Chef XL Kitchen Machine', price: '$379.99', origPrice: '$479.99', save: 'Save $100.00', stars: '★★★★★', rating: '(4,600)', sub: '1400W, 6.7L bowl, 5 attachments', features: ['1400W heavy-duty motor', '6.7L stainless mixing bowl', 'Planetary mixing action', 'Includes dough hook, beater & whisk'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Anker PowerCore 20000mAh Power Bank', price: '$39.99', origPrice: '$59.99', save: 'Save $20.00', stars: '★★★★★', rating: '(44,900)', sub: 'USB-C PD 18W, dual USB-A output', features: ['20,000mAh massive capacity', 'USB-C 18W power delivery', 'Multi-protect safety system', 'Charges 2 devices simultaneously'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Philips Mixer Grinder 750W 3-Jar', price: '$59.99', origPrice: '$84.99', save: 'Save $25.00', stars: '★★★★☆', rating: '(7,200)', sub: '750W copper motor, 2yr warranty', features: ['750W full copper motor', '3 jars: 1.5L, 1L, 0.4L', 'Anti-drip spout & unbreakable jars', '2-year motor warranty'] },
            { img: 'https://i5.walmartimages.com/seo/Penguin-Stuffed-Animal-Plushie-Kawaii-Plush-Toy-Plushies-for-All-Ages_4792bcd5-0d4e-48d6-a37d-6f79c8f1c767.dcb05e40920aad2dcde99a3a53e56d80.jpeg', name: 'Dawlance Refrigerator 12 CFT Inverter', price: '$449.99', origPrice: '$599.99', save: 'Save $150.00', stars: '★★★★★', rating: '(2,900)', sub: 'UHD inverter, 10yr compressor warranty', features: ['UHD inverter compressor tech', '10-year compressor warranty', 'Energy saving A+ rating', 'Anti-bacterial inner liner'] }
        ]
    }
];

// ================================
// Extra Slider Sections 2 (2 more — 12 pics each)
// ================================
var extraSliderSections2 = [
    {
        id: 'best_home_appliances',
        title: 'Best in Home Appliances',
        seeAllText: 'See all home appliances',
        products: [
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Instant Pot Duo 7-in-1 Pressure Cooker 8Qt', price: '$89.99', origPrice: '$129.99', save: 'Save $40.00', stars: '★★★★★', rating: '(278,400)', sub: 'Pressure cook, slow cook, sauté & more', features: ['7-in-1 multi-cooker functions', '8-quart large family size', 'UL certified safety features', '14 smart built-in programs'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Ninja AF101 Air Fryer 4Qt', price: '$99.99', origPrice: '$129.99', save: 'Save $30.00', stars: '★★★★★', rating: '(64,200)', sub: 'Guilt-free crispy results, 4 quart', features: ['4-quart ceramic-coated basket', 'Air fry, roast, reheat, dehydrate', 'Up to 75% less fat than frying', 'Dishwasher safe parts'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Keurig K-Classic Coffee Maker K-Cup Pod', price: '$69.99', origPrice: '$99.99', save: 'Save $30.00', stars: '★★★★★', rating: '(42,100)', sub: '6-10 oz brew sizes, 48oz reservoir', features: ['Compatible with all K-Cup pods', '48oz removable reservoir', 'Brews in under 1 minute', 'Auto-off energy saving'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'iRobot Roomba 694 Robot Vacuum', price: '$179.99', origPrice: '$274.99', save: 'Save $95.00', stars: '★★★★☆', rating: '(28,700)', sub: 'Wi-Fi connected, works with Alexa', features: ['3-stage cleaning system', 'Wi-Fi connected & Alexa compatible', 'Dirt Detect sensors', 'Cliff-detect avoids stairs'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Vitamix 5200 Blender Professional-Grade', price: '$349.95', origPrice: '$449.95', save: 'Save $100.00', stars: '★★★★★', rating: '(16,800)', sub: '2HP motor, self-cleaning, variable speed', features: ['Aircraft-grade stainless steel blades', 'Variable speed control + pulse', 'Self-cleaning in 30-60 seconds', '7-year full warranty'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Dyson V8 Absolute Cordless Vacuum', price: '$299.99', origPrice: '$399.99', save: 'Save $100.00', stars: '★★★★★', rating: '(21,300)', sub: '40min runtime, HEPA filter', features: ['Fade-free 40-min battery power', 'Whole-machine HEPA filtration', 'Lightweight 5.6lb design', 'Converts to handheld in seconds'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Cuisinart TOA-60 AirFryer Toaster Oven', price: '$199.95', origPrice: '$249.95', save: 'Save $50.00', stars: '★★★★☆', rating: '(11,900)', sub: '0.6 cubic ft, 7 functions', features: ['7 cooking functions in one', '0.6 cubic foot interior capacity', 'Air fry, bake, broil, toast', 'Non-stick easy-clean interior'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Hamilton Beach 2-Slice Toaster', price: '$19.99', origPrice: '$29.99', save: 'Save $10.00', stars: '★★★★☆', rating: '(33,400)', sub: 'Extra-wide slots, 6 shade settings', features: ['Extra-wide slots for thick bread', '6 browning shade settings', 'Bagel, defrost, cancel functions', 'Removable crumb tray'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'BLACK+DECKER Hand Mixer MX3200B', price: '$24.99', origPrice: '$39.99', save: 'Save $15.00', stars: '★★★★★', rating: '(18,700)', sub: '5 speeds + turbo boost, 250W', features: ['5 speeds plus turbo boost', '250-watt powerful motor', 'Includes beaters & dough hooks', 'Snap-on storage case included'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Whirlpool 1.1 Cu Ft Microwave Oven', price: '$109.99', origPrice: '$149.99', save: 'Save $40.00', stars: '★★★★★', rating: '(9,200)', sub: '10 power levels, 1000W, stainless', features: ['1,000 watts for fast cooking', '10 power levels', 'Stainless steel interior', 'Child lock safety feature'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'KitchenAid KSM150PSER Stand Mixer 5Qt', price: '$379.99', origPrice: '$499.99', save: 'Save $120.00', stars: '★★★★★', rating: '(7,600)', sub: '10-speed, tilt-head, empire red', features: ['5-quart stainless steel bowl', '10 speed settings', 'Includes flat beater, dough hook, whisk', 'Over 10 attachments available'] },
            { img: 'https://abwholesale.pk/cdn/shop/files/O1CN01XMTwqy1Dgi5HVx9OQ__3192780246-0-cib.jpg?v=1779179384', name: 'Breville BOV800XL Smart Oven', price: '$249.95', origPrice: '$329.95', save: 'Save $80.00', stars: '★★★★★', rating: '(14,500)', sub: '1800W, 9 functions, Element IQ', features: ['1800W Element IQ technology', '9 smart cooking functions', 'Interior oven light', 'Non-stick easy-clean interior'] }
        ]
    },
    {
        id: 'trending_gadgets',
        title: 'Trending Gadgets & Tech',
        seeAllText: 'See all gadgets',
        products: [
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Apple AirPods Pro 2nd Generation', price: '$189.99', origPrice: '$249.00', save: 'Save $59.01', stars: '★★★★★', rating: '(88,400)', sub: 'Active Noise Cancellation, USB-C', features: ['Active Noise Cancellation (ANC)', 'Transparency mode for surroundings', 'Adaptive Audio intelligently blends', 'Up to 30hrs battery with case'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Samsung Galaxy Watch 6 44mm', price: '$249.99', origPrice: '$329.99', save: 'Save $80.00', stars: '★★★★★', rating: '(22,100)', sub: 'Advanced health monitoring, GPS', features: ['Advanced sleep coaching', 'Body composition analysis', 'Built-in GPS tracking', 'Up to 40hrs battery life'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Kindle Paperwhite 16GB Signature Edition', price: '$139.99', origPrice: '$189.99', save: 'Save $50.00', stars: '★★★★★', rating: '(47,300)', sub: '300ppi display, wireless charging', features: ['300ppi glare-free display', 'Wireless charging compatible', 'Adjustable warm light', 'Up to 10 weeks battery'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Ring Video Doorbell 4', price: '$99.99', origPrice: '$139.99', save: 'Save $40.00', stars: '★★★★★', rating: '(31,600)', sub: '1080p HD, colour pre-roll, Wi-Fi', features: ['1080p HD video with HDR', 'Colour pre-roll preview', 'Two-way talk & motion zones', 'Works with Alexa'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'GoPro HERO12 Black Action Camera', price: '$299.99', origPrice: '$399.99', save: 'Save $100.00', stars: '★★★★★', rating: '(9,800)', sub: '5.3K60, HyperSmooth 6.0, waterproof', features: ['5.3K60 + 4K120 video', 'HyperSmooth 6.0 stabilisation', 'Waterproof to 10m without housing', 'Max Lens Mod 2.0 compatible'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Anker SOLIX C300 Portable Power Station', price: '$219.99', origPrice: '$299.99', save: 'Save $80.00', stars: '★★★★★', rating: '(6,700)', sub: '288Wh, 300W AC, solar ready', features: ['288Wh LFP battery cells', '300W AC output (600W peak)', 'Solar charging compatible', 'Full charge in 1 hour'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Bose QuietComfort 45 Headphones', price: '$229.00', origPrice: '$329.00', save: 'Save $100.00', stars: '★★★★★', rating: '(36,500)', sub: 'ANC + Aware mode, 24hr battery', features: ['World-class noise cancellation', 'Aware mode for ambient sound', '24-hour battery life', 'TriPort acoustic architecture'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Tile Mate 4-Pack Bluetooth Tracker', price: '$59.99', origPrice: '$79.99', save: 'Save $20.00', stars: '★★★★☆', rating: '(18,200)', sub: '250ft range, 3yr battery, waterproof', features: ['250ft Bluetooth range', '3-year replaceable battery', 'Water resistant IP67', 'Find with Google Assistant'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Amazon Echo Dot 5th Gen Smart Speaker', price: '$49.99', origPrice: '$64.99', save: 'Save $15.00', stars: '★★★★★', rating: '(62,000)', sub: 'Alexa built-in, motion detection', features: ['Improved audio vs prior gen', 'Built-in motion detection', 'Eero Wi-Fi extender', 'Temperature sensor built-in'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Garmin Forerunner 165 GPS Running Watch', price: '$249.99', origPrice: '$299.99', save: 'Save $50.00', stars: '★★★★★', rating: '(8,100)', sub: 'AMOLED display, 19 day battery', features: ['Bright AMOLED display', '19-day battery in smartwatch mode', 'Daily Suggested Workouts', 'HRV Status monitoring'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'DJI Mini 4 Pro Drone Fly More Combo', price: '$959.00', origPrice: '$1099.00', save: 'Save $140.00', stars: '★★★★★', rating: '(4,300)', sub: '4K60 HDR, 34min flight, omnidirectional', features: ['4K/60fps HDR video', '34-minute max flight time', 'Omnidirectional obstacle sensing', '249g under drone regulations'] },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', name: 'Wyze Cam v4 Security Camera 2-Pack', price: '$49.98', origPrice: '$69.98', save: 'Save $20.00', stars: '★★★★☆', rating: '(14,600)', sub: '2K colour night vision, AI detection', features: ['2K colour night vision', 'AI motion & sound detection', '14-day free cloud storage', 'Works with Alexa & Google'] }
        ]
    }
];

// ================================
// Promo Card Grid Data (4 cards)
// ================================
var promoCards = [
    {
        title: 'Have more fun with family',
        bg: '#f0f9ff',
        accentColor: '#0066c0',
        items: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ZFuKya09pI4LJkDVO_InT-CvkVobw8zUbiy3FISZcQ&s=10', label: 'Board Games' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlvBj0l7t8ewNpCLU-N9maFfboORVHbPi5DBQ0WVHgQ&s=10', label: 'Outdoor Sets' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZhcDHBN8Gh2PASfzIW_ytGGvBi4a9HSH3DxW34-I3Q&s=10', label: 'Building Toys' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMklhzBNjNjmjfsMT2Fqc8ykbcdsOWzIOoa7gZoKXG2A&s=10', label: 'STEM Kits' },
        ],
        link: 'See more'
    },
    {
        title: 'Most-loved travel essentials',
        bg: '#fffbf0',
        accentColor: '#c45500',
        items: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ZFuKya09pI4LJkDVO_InT-CvkVobw8zUbiy3FISZcQ&s=10', label: 'Backpacks' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlvBj0l7t8ewNpCLU-N9maFfboORVHbPi5DBQ0WVHgQ&s=10', label: 'Luggage' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZhcDHBN8Gh2PASfzIW_ytGGvBi4a9HSH3DxW34-I3Q&s=10', label: 'Travel Pillows' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMklhzBNjNjmjfsMT2Fqc8ykbcdsOWzIOoa7gZoKXG2A&s=10', label: 'Accessories' },
        ],
        link: 'Discover more'
    },
    {
        title: 'Curate your space',
        bg: '#f5fff5',
        accentColor: '#007600',
        items: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ZFuKya09pI4LJkDVO_InT-CvkVobw8zUbiy3FISZcQ&s=10', label: 'Wall Art' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlvBj0l7t8ewNpCLU-N9maFfboORVHbPi5DBQ0WVHgQ&s=10', label: 'Candles' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZhcDHBN8Gh2PASfzIW_ytGGvBi4a9HSH3DxW34-I3Q&s=10', label: 'Indoor Plants' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMklhzBNjNjmjfsMT2Fqc8ykbcdsOWzIOoa7gZoKXG2A&s=10', label: 'Storage' },
        ],
        link: 'See more'
    },
    {
        title: 'Gear up to get fit',
        bg: '#fff5f5',
        accentColor: '#c7511f',
        items: [
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ZFuKya09pI4LJkDVO_InT-CvkVobw8zUbiy3FISZcQ&s=10', label: 'Activewear' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlvBj0l7t8ewNpCLU-N9maFfboORVHbPi5DBQ0WVHgQ&s=10', label: 'Trackers' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZhcDHBN8Gh2PASfzIW_ytGGvBi4a9HSH3DxW34-I3Q&s=10', label: 'Equipment' },
            { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMklhzBNjNjmjfsMT2Fqc8ykbcdsOWzIOoa7gZoKXG2A&s=10', label: 'Nutrition' },
        ],
        link: 'Discover more'
    }
];

// ================================
// Build Promo Card Grid (after original sliders)
// ================================
function buildPromoGrid() {
    var wrap = document.getElementById('promoCardGrid');
    if (!wrap) return;

    // Register each promo card as a category so popup menu can look products up
    var promoCatStart = categories.length;
    promoCards.forEach(function (card) {
        categories.push({
            id: 'promo-' + card.title.replace(/\s+/g, '-').toLowerCase(),
            title: card.title,
            sub: '',
            link: '',
            sliderOnly: true,
            items: card.items.map(function (i) { return { img: i.img, label: i.label }; }),
            products: card.items.map(function (item) {
                return {
                    name: item.label,
                    img: item.img,
                    price: '$19.99',
                    origPrice: '$29.99',
                    stars: '★★★★☆',
                    rating: '(1,234)',
                    features: ['Quality product', 'Fast shipping', 'Easy returns'],
                    highlights: []
                };
            })
        });
    });

    wrap.innerHTML =
        '<div class="promo-grid-section">' +
        '<div class="promo-grid-inner">' +
        promoCards.map(function (card, cIdx) {
            var catIdx = promoCatStart + cIdx;
            return '<div class="promo-card" style="background:' + card.bg + '">' +
                '<h3 class="promo-card-title">' + card.title + '</h3>' +
                '<div class="promo-card-grid">' +
                card.items.map(function (item, iIdx) {
                    return '<div class="promo-card-item" onclick="openSliderCard(' + catIdx + ',' + iIdx + ')" style="cursor:pointer">' +
                        '<img src="' + item.img + '" alt="' + item.label + '" loading="lazy" onerror="this.style.background=\'#eee\'">' +
                        '<p>' + item.label + '</p>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '<a href="#" class="promo-card-link" style="color:' + card.accentColor + '">' + card.link + '</a>' +
                '</div>';
        }).join('') +
        '</div>' +
        '</div>';
}

// ================================
// Promo Card Grid 2 Data (4 cards — second set)
// ================================
var promoCards2 = [
    {
        title: 'Top Electronics Picks',
        bg: '#f0f5ff',
        accentColor: '#0052cc',
        items: [
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', label: 'Headphones' },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', label: 'Smartwatches' },
            { img: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL320_.jpg', label: 'Cameras' },
            { img: 'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_SL320_.jpg', label: 'Speakers' }
        ],
        link: 'Shop Electronics'
    },
    {
        title: 'Kitchen Must-Haves',
        bg: '#fff8f0',
        accentColor: '#c45500',
        items: [
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', label: 'Coffee Makers' },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', label: 'Air Fryers' },
            { img: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL320_.jpg', label: 'Blenders' },
            { img: 'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_SL320_.jpg', label: 'Vacuums' }
        ],
        link: 'See all kitchen'
    },
    {
        title: 'Sports & Fitness',
        bg: '#f0fff5',
        accentColor: '#007600',
        items: [
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', label: 'Yoga & Mats' },
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', label: 'Dumbbells' },
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', label: 'Running Gear' },
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', label: 'Water Bottles' }
        ],
        link: 'Explore fitness'
    },
    {
        title: 'Trending This Week',
        bg: '#fef0ff',
        accentColor: '#6600cc',
        items: [
            { img: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL320_.jpg', label: 'Smart Home' },
            { img: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL320_.jpg', label: 'Power Banks' },
            { img: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL320_.jpg', label: 'Drones' },
            { img: 'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_SL320_.jpg', label: 'Wearables' }
        ],
        link: 'See what\'s trending'
    }
];

function buildPromoGrid2() {
    var wrap = document.getElementById('promoCardGrid2');
    if (!wrap) return;

    var promoCatStart = categories.length;
    promoCards2.forEach(function (card) {
        categories.push({
            id: 'promo2-' + card.title.replace(/\s+/g, '-').toLowerCase(),
            title: card.title,
            sub: '',
            link: '',
            sliderOnly: true,
            items: card.items.map(function (i) { return { img: i.img, label: i.label }; }),
            products: card.items.map(function (item) {
                return {
                    name: item.label,
                    img: item.img,
                    price: '$24.99',
                    origPrice: '$34.99',
                    save: 'Save $10.00',
                    stars: '★★★★★',
                    rating: '(2,341)',
                    features: ['Premium quality', 'Fast shipping', 'Easy returns'],
                    highlights: []
                };
            })
        });
    });

    wrap.innerHTML =
        '<div class="promo-grid-section">' +
        '<div class="promo-grid-inner">' +
        promoCards2.map(function (card, cIdx) {
            var catIdx = promoCatStart + cIdx;
            return '<div class="promo-card" style="background:' + card.bg + '">' +
                '<h3 class="promo-card-title">' + card.title + '</h3>' +
                '<div class="promo-card-grid">' +
                card.items.map(function (item, iIdx) {
                    return '<div class="promo-card-item" onclick="openSliderCard(' + catIdx + ',' + iIdx + ')" style="cursor:pointer">' +
                        '<img src="' + item.img + '" alt="' + item.label + '" loading="lazy" onerror="this.style.background=\'#eee\'">' +
                        '<p>' + item.label + '</p>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '<a href="#" class="promo-card-link" style="color:' + card.accentColor + '">' + card.link + '</a>' +
                '</div>';
        }).join('') +
        '</div>' +
        '</div>';
}

// ================================
// Combine all categories for modal use
// ================================
var SLIDER_CAT_OFFSET = categories.length;
sliderSections.forEach(function (ss) {
    categories.push({
        id: ss.id,
        title: ss.title,
        sub: '',
        link: '',
        sliderOnly: true,
        items: ss.products.slice(0, 4).map(function (p) {
            return { img: p.img, label: p.name.split(' ').slice(0, 3).join(' ') + '…' };
        }),
        products: ss.products
    });
});

var EXTRA_SLIDER_CAT_OFFSET = categories.length;
extraSliderSections.forEach(function (ss) {
    categories.push({
        id: ss.id,
        title: ss.title,
        sub: '',
        link: '',
        sliderOnly: true,
        items: ss.products.slice(0, 4).map(function (p) {
            return { img: p.img, label: p.name.split(' ').slice(0, 3).join(' ') + '…' };
        }),
        products: ss.products
    });
});

var EXTRA_SLIDER_CAT_OFFSET2 = categories.length;
extraSliderSections2.forEach(function (ss) {
    categories.push({
        id: ss.id,
        title: ss.title,
        sub: '',
        link: '',
        sliderOnly: true,
        items: ss.products.slice(0, 4).map(function (p) {
            return { img: p.img, label: p.name.split(' ').slice(0, 3).join(' ') + '…' };
        }),
        products: ss.products
    });
});

// Build both promo grids AFTER all slider categories are in `categories`
buildPromoGrid();
buildPromoGrid2();

// Open slider card product in the existing modal
window.openSliderCard = function (catIdx, prodIdx) {
    var cat = categories[catIdx];
    var prod = cat.products[prodIdx];
    openProductModal(prod, cat, catIdx, prodIdx);
};

// Scroll slider track left or right
window.psScroll = function (btn, dir) {
    var wrapper = btn.closest('.ps-wrapper');
    var track = wrapper.querySelector('.ps-track');
    var scrollAmt = track.clientWidth * 0.8;
    track.scrollBy({ left: dir * scrollAmt, behavior: 'smooth' });
};

function updatePsArrows(track) {
    var wrapper = track.closest('.ps-wrapper');
    if (!wrapper) return;
    var prevBtnEl = wrapper.querySelector('.ps-prev');
    var nextBtnEl = wrapper.querySelector('.ps-next');
    var atStart = track.scrollLeft <= 10;
    var atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 10;
    if (prevBtnEl) { prevBtnEl.style.opacity = atStart ? '0' : '1'; prevBtnEl.style.pointerEvents = atStart ? 'none' : 'all'; }
    if (nextBtnEl) { nextBtnEl.style.opacity = atEnd ? '0' : '1'; nextBtnEl.style.pointerEvents = atEnd ? 'none' : 'all'; }
}

function buildSlidersInto(wrapId, sectionsArr, catOffset) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;

    sectionsArr.forEach(function (section, sIdx) {
        var catIdx = catOffset + sIdx;
        var sectionEl = document.createElement('div');
        sectionEl.className = 'ps-section';

        var cardsHtml = section.products.map(function (prod, pIdx) {
            return '<div class="ps-card ps-card--img-only" onclick="openSliderCard(' + catIdx + ',' + pIdx + ')">' +
                '<div class="ps-card-img-wrap"><img class="ps-card-img" src="' + prod.img + '" alt="' + prod.name + '" loading="lazy" onerror="this.src=\'https://via.placeholder.com/200x200?text=No+Image\'"></div>' +
                '</div>';
        }).join('');

        sectionEl.innerHTML =
            '<div class="ps-header">' +
            '<h2 class="ps-title">' + section.title + '</h2>' +
            '<a href="#" class="ps-see-all">' + section.seeAllText + ' ›</a>' +
            '</div>' +
            '<div class="ps-wrapper">' +
            '<button class="ps-btn ps-prev" onclick="psScroll(this,-1)">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>' +
            '</button>' +
            '<div class="ps-track">' + cardsHtml + '</div>' +
            '<button class="ps-btn ps-next" onclick="psScroll(this,1)">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>' +
            '</button>' +
            '</div>';

        wrap.appendChild(sectionEl);

        var track = sectionEl.querySelector('.ps-track');
        track.addEventListener('scroll', function () { updatePsArrows(track); });
        setTimeout(function () { updatePsArrows(track); }, 200);
    });
}

// Build original 2 sliders
buildSlidersInto('prodSlidersWrap', sliderSections, SLIDER_CAT_OFFSET);

// Build 2 extra sliders (12 pics each)
buildSlidersInto('extraSlidersWrap', extraSliderSections, EXTRA_SLIDER_CAT_OFFSET);

// Build 2nd set of extra sliders (12 pics each)
buildSlidersInto('extraSlidersWrap2', extraSliderSections2, EXTRA_SLIDER_CAT_OFFSET2);

// ================================
// Quick Add to Cart from slider cards
// ================================
window.quickAddToCart = function (catIdx, prodIdx, btn) {
    var cat = categories[catIdx];
    var prod = cat.products[prodIdx];
    addToCart(prod, cat.id);
    btn.textContent = 'Added ✓';
    btn.style.background = '#28a745';
    btn.style.borderColor = '#219a38';
    setTimeout(function () {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
        btn.style.borderColor = '';
    }, 1800);
};

// ================================
// Popup Context Menu
// ================================
var popupMenu = document.getElementById('popupMenu');
var popupBackdrop = document.getElementById('popupBackdrop');
var popupMenuHeader = document.getElementById('popupMenuHeader');
var _popupCatIdx = 0;
var _popupProdIdx = 0;

window.showPopupMenu = function (e, catIdx, prodIdx) {
    e.preventDefault();
    e.stopPropagation();
    _popupCatIdx = catIdx;
    _popupProdIdx = prodIdx;

    var prod = categories[catIdx].products[prodIdx];
    popupMenuHeader.textContent = prod.name.length > 30 ? prod.name.slice(0, 30) + '…' : prod.name;

    // Position menu near cursor, keep it in viewport
    var x = e.clientX;
    var y = e.clientY;
    var mw = 240;
    var mh = 220;
    if (x + mw > window.innerWidth) x = window.innerWidth - mw - 10;
    if (y + mh > window.innerHeight) y = window.innerHeight - mh - 10;

    popupMenu.style.left = x + 'px';
    popupMenu.style.top = y + 'px';
    popupMenu.classList.add('open');
    popupBackdrop.classList.add('open');
};

function closePopupMenu() {
    popupMenu.classList.remove('open');
    popupBackdrop.classList.remove('open');
}

if (popupBackdrop) popupBackdrop.addEventListener('click', closePopupMenu);
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopupMenu(); });

document.getElementById('popupAddCart').addEventListener('click', function () {
    var cat = categories[_popupCatIdx];
    var prod = cat.products[_popupProdIdx];
    addToCart(prod, cat.id);
    this.textContent = '✓ Added to Cart!';
    this.style.color = '#007600';
    var btn = this;
    setTimeout(function () { btn.textContent = 'Add to Cart'; btn.style.color = ''; closePopupMenu(); }, 1200);
});

document.getElementById('popupViewDetails').addEventListener('click', function () {
    closePopupMenu();
    window.openSliderCard(_popupCatIdx, _popupProdIdx);
});

document.getElementById('popupWishlist').addEventListener('click', function () {
    this.textContent = '✓ Added to Wish List';
    this.style.color = '#c45500';
    var btn = this;
    setTimeout(function () { btn.textContent = 'Add to Wish List'; btn.style.color = ''; closePopupMenu(); }, 1200);
});

document.getElementById('popupCompare').addEventListener('click', function () {
    var prod = categories[_popupCatIdx].products[_popupProdIdx];
    alert('Compare: ' + prod.name + '\nPrice: ' + prod.price + '\nOriginal: ' + prod.origPrice);
    closePopupMenu();
});

document.getElementById('popupShare').addEventListener('click', function () {
    var prod = categories[_popupCatIdx].products[_popupProdIdx];
    var text = prod.name + ' — ' + prod.price;
    if (navigator.share) {
        navigator.share({ title: prod.name, text: text, url: window.location.href });
    } else {
        navigator.clipboard && navigator.clipboard.writeText(text).then(function () {
            alert('Product link copied to clipboard!');
        });
    }
    closePopupMenu();
});

// Also allow right-click on category cards and slider cards
document.addEventListener('contextmenu', function (e) {
    var card = e.target.closest('.ps-card');
    if (!card) { closePopupMenu(); }
});
