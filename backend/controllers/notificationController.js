const sendEmail = require('../utils/email');

exports.sendOrderConfirmation = async (userEmail, order) => {
  const subject = `Order Confirmation - ${order.orderNumber}`;
  const html = `
    <h3>Thank you for your order!</h3>
    <p>Your order <strong>${order.orderNumber}</strong> has been successfully placed.</p>
    <p>Total: ₹${order.pricing.total}</p>
    <p>We will notify you when your order is shipped.</p>
  `;

  try {
    await sendEmail(userEmail, subject, html);
  } catch (err) {
    console.error('Error sending order confirmation email:', err);
  }
};
