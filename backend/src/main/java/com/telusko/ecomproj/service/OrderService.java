package com.telusko.ecomproj.service;

import com.telusko.ecomproj.model.Cart;
import com.telusko.ecomproj.model.CartItem;
import com.telusko.ecomproj.model.Order;
import com.telusko.ecomproj.model.OrderItem;
import com.telusko.ecomproj.model.Product;
import com.telusko.ecomproj.model.User;
import com.telusko.ecomproj.repo.CartRepo;
import com.telusko.ecomproj.repo.OrderRepo;
import com.telusko.ecomproj.repo.ProductRepo;
import com.telusko.ecomproj.repo.UserRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;


    @Transactional
    public Order checkout(String username) {

        // 1. Find user
        User user = userRepo.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }


        // 2. Get user's cart
        Cart cart = cartRepo.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found")
                );


        // 3. Check cart
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }


        // 4. Create order
        Order order = new Order();

        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus("PLACED");

        BigDecimal totalAmount = BigDecimal.ZERO;

        ArrayList<OrderItem> orderItems = new ArrayList<>();


        // 5. Process every cart item
        for (CartItem cartItem : cart.getItems()) {

            int productId = cartItem.getProduct().getId();
            int quantity = cartItem.getQuantity();


            // Lock product row while checkout is happening
            Product product = productRepo.findByIdForUpdate(productId)
                    .orElseThrow(() ->
                            new RuntimeException("Product not found")
                    );


            // 6. Check availability
            if (!product.isAvailable()) {
                throw new RuntimeException(
                        product.getName() + " is currently unavailable"
                );
            }


            // 7. Check stock
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException(
                        "Not enough stock for " + product.getName()
                );
            }


            // 8. Calculate item total
            BigDecimal itemTotal =
                    product.getPrice()
                            .multiply(BigDecimal.valueOf(quantity));

            totalAmount = totalAmount.add(itemTotal);


            // 9. Create OrderItem
            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);

            // Save price at the time of purchase
            orderItem.setPriceAtPurchase(product.getPrice());

            orderItems.add(orderItem);


            // 10. Reduce stock
            int remainingStock =
                    product.getStockQuantity() - quantity;

            product.setStockQuantity(remainingStock);

            // If stock reaches zero, mark unavailable
            if (remainingStock == 0) {
                product.setAvailable(false);
            }

            productRepo.save(product);
        }


        // 11. Set order details
        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);


        // 12. Save order
        Order savedOrder = orderRepo.save(order);


        // 13. Clear cart
        cart.getItems().clear();
        cartRepo.save(cart);


        // 14. Return order
        return savedOrder;
    }
}