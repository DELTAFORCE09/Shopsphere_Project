package com.telusko.ecomproj.service;

import com.telusko.ecomproj.model.Product;
import com.telusko.ecomproj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProduct(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile)
            throws IOException {

        // Availability is determined by stock
        product.setAvailable(product.getStockQuantity() > 0);

        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageData(imageFile.getBytes());
        }

        return repo.save(product);
    }

    public Product updateProduct(
            int id,
            Product product,
            MultipartFile imageFile
    ) throws IOException {

        Product existingProduct = repo.findById(id).orElse(null);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(product.getName());
        existingProduct.setDesc(product.getDesc());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setReleaseDate(product.getReleaseDate());

        existingProduct.setStockQuantity(
                product.getStockQuantity()
        );

        // Automatically determine availability from stock
        existingProduct.setAvailable(
                product.getStockQuantity() > 0
        );

        // Only replace image if a new image was supplied
        if (imageFile != null && !imageFile.isEmpty()) {
            existingProduct.setImageName(
                    imageFile.getOriginalFilename()
            );

            existingProduct.setImageType(
                    imageFile.getContentType()
            );

            existingProduct.setImageData(
                    imageFile.getBytes()
            );
        }

        return repo.save(existingProduct);
    }

    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}