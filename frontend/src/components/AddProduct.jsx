import React, { useState } from "react";
import axios from "../axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    desc: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
  });

  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("imageFile", image);

      formData.append(
        "product",
        new Blob(
          [JSON.stringify(product)],
          {
            type: "application/json",
          }
        )
      );

      const response = await axios.post(
        "/product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Product added successfully:",
        response.data
      );

      alert("Product added successfully");
    } catch (error) {
      console.error(
        "Error adding product:",
        error
      );

      if (error.response?.status === 403) {
        alert("You are not authorized to add products.");
      } else {
        alert("Error adding product");
      }
    }
  };

  return (
    <div
      className="center-container"
      style={{ marginTop: "7rem" }}
    >
      <h2>Add Product</h2>

      <form
        className="row g-3 pt-1"
        onSubmit={submitHandler}
      >
        <div className="col-md-6">
          <label className="form-label">
            <h6>Name</h6>
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            onChange={handleInputChange}
            value={product.name}
            name="name"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <h6>Brand</h6>
          </label>

          <input
            type="text"
            name="brand"
            className="form-control"
            placeholder="Enter your Brand"
            value={product.brand}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">
            <h6>Description</h6>
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Add product description"
            value={product.desc}
            name="desc"
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-5">
          <label className="form-label">
            <h6>Price</h6>
          </label>

          <input
            type="number"
            className="form-control"
            placeholder="Eg: ₹1000"
            onChange={handleInputChange}
            value={product.price}
            name="price"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <h6>Category</h6>
          </label>

          <select
            className="form-select"
            value={product.category}
            onChange={handleInputChange}
            name="category"
            required
          >
            <option value="">
              Select category
            </option>

            <option value="Laptop">
              Laptop
            </option>

            <option value="Headphone">
              Headphone
            </option>

            <option value="Mobile">
              Mobile
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Toys">
              Toys
            </option>

            <option value="Fashion">
              Fashion
            </option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">
            <h6>Stock Quantity</h6>
          </label>

          <input
            type="number"
            className="form-control"
            placeholder="Stock Remaining"
            onChange={handleInputChange}
            value={product.stockQuantity}
            name="stockQuantity"
            min="0"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">
            <h6>Release Date</h6>
          </label>

          <input
            type="date"
            className="form-control"
            value={product.releaseDate}
            name="releaseDate"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">
            <h6>Image</h6>
          </label>

          <input
            className="form-control"
            type="file"
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;