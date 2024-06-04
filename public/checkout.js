document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');

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
    
    document.querySelector('.pay-now').addEventListener('click', async () => {
        const totalAmount = totalPriceElement.textContent;
        const transactionId = `txn_${Date.now()}`;
        const payer = {
            partyIdType: 'MSISDN',
            partyId: '256774290781' // This should be dynamic based on user input
        };

        try {
            const response = await fetch('http://localhost:3000/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    currency: 'USD',
                    externalId: transactionId,
                    payer: payer,
                    payerMessage: 'Payment for goods',
                    payeeNote: 'Thank you for your purchase'
                })
            });
            const result = await response.json();
            if (response.ok) {
                alert('Payment initiated successfully. Transaction ID: ' + transactionId);
                checkPaymentStatus(transactionId);
            } else {
                alert('Payment initiation failed: ' + result.message);
            }
        } catch (error) {
            alert('Error initiating payment: ' + error.message);
        }
    });

    async function checkPaymentStatus(transactionId) {
        try {
            const response = await fetch(`http://localhost:3000/pay-status/${transactionId}`);
            const result = await response.json();
            if (response.ok) {
                if (result.status === 'SUCCESSFUL') {
                    alert('Payment successful!');
                } else {
                    alert('Payment status: ' + result.status);
                }
            } else {
                alert('Failed to check payment status: ' + result.message);
            }
        } catch (error) {
            alert('Error checking payment status: ' + error.message);
        }
    }

    renderCart();
});
