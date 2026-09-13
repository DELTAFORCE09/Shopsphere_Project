import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    desc: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `/product/${id}`
        );

        setProduct(response.data);

        const responseImage = await axios.get(
          `/product/${id}/image`,
          {
            responseType: "blob",
          }
        );

        const imageFile = new File(
          [responseImage.data],
          response.data.imageName,
          {
            type: responseImage.data.type,
          }
        );

        setImage(imageFile);

        setUpdateProduct({
          ...response.data,
          desc: response.data.desc || "",
        });

      } catch (error) {
        console.error(
          "Error fetching product:",
          error
        );
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = new FormData();

      if (image) {
        updatedProduct.append(
          "imageFile",
          image
        );
      }

      updatedProduct.append(
        "product",
        new Blob(
          [JSON.stringify(updateProduct)],
          {
            type: "application/json",
          }
        )
      );

      const response = await axios.put(
        `/product/${id}`,
        updatedProduct,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Product updated successfully:",
        response.data
      );

      alert(
        "Product updated successfully!"
      );

    } catch (error) {
      console.error(
        "Error updating product:",
        error
      );

      if (error.response?.status === 403) {
        alert(
          "You are not authorized to update products."
        );
      } else {
        alert(
          "Failed to update product. Please try again."
        );
      }
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(
      e.target.files[0]
    );
  };

  return (
    <div
      className="center-container"
      style={{
        marginTop: "7rem",
      }}
    >
      <h2>Update Product</h2>

      <form
        className="row g-3 pt-1"
        onSubmit={handleSubmit}
      >
        <div className="col-md-6">
          <label className="form-label">
            <h6>Name</h6>
          </label>

          <input
            type="text"
            className="form-control"
            value={updateProduct.name}
            onChange={handleChange}
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
            value={updateProduct.brand}
            onChange={handleChange}
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
            name="desc"
            value={updateProduct.desc}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-5">
          <label className="form-label">
            <h6>Price</h6>
          </label>

          <input
            type="number"
            className="form-control"
            onChange={handleChange}
            value={updateProduct.price}
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
            value={updateProduct.category}
            onChange={handleChange}
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
            onChange={handleChange}
            value={
              updateProduct.stockQuantity
            }
            name="stockQuantity"
            min="0"
            required
          />
        </div>

        <div className="col-md-8">
          <label className="form-label">
            <h6>Image</h6>
          </label>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt={product.imageName}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                padding: "5px",
                margin: "0",
              }}
            />
          )}

          <input
            className="form-control"
            type="file"
            onChange={handleImageChange}
            name="imageUrl"
            id="imageUrl"
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;