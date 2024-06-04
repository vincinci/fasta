document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = document.querySelectorAll('.product');
    const cartItems = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    products.forEach(product => {
        product.querySelector('.add-to-cart').addEventListener('click', () => {
            const productId = product.getAttribute('data-id');
            const productName = product.getAttribute('data-name');
            const productPrice = parseFloat(product.getAttribute('data-price'));
            
            const cartItem = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            };
            
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(cartItem);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });
    
    function renderCart() {
        cartItems.innerHTML = '';
        let totalPrice = 0;
        
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            cartItems.appendChild(li);
            totalPrice += item.price * item.quantity;
        });
        
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
    
    document.querySelector('.checkout').addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    renderCart();
});
