import Goods from "../models/goods.model.js";

export const validateGoods = async (product, quantity, goodsId = null) => {
  const errors = [];

  // Required field validation
  if (!product || typeof product !== "object") {
    errors.push("Product object is required");
  }

  if (quantity === undefined || quantity === null) {
    errors.push("Quantity is required");
  }

  // Product validation
  if (product && typeof product === "object") {
    const { name, details } = product;

    if (!name || name.trim() === "") {
      errors.push("Product name is required");
    }

    if (!details || details.trim() === "") {
      errors.push("Product details are required");
    }

    // Name validation
    if (name && name.trim()) {
      if (name.length < 2) {
        errors.push("Product name must be at least 2 characters long");
      }
      if (name.length > 100) {
        errors.push("Product name must be less than 100 characters");
      }
    }

    // Details validation
    if (details && details.trim()) {
      if (details.length < 3) {
        errors.push("Product details must be at least 10 characters long");
      }
      if (details.length > 100) {
        errors.push("Product details must be less than 100 characters");
      }
    }
  }

  // Quantity validation
  if (quantity !== undefined && quantity !== null) {
    if (typeof quantity !== "number" || isNaN(quantity)) {
      errors.push("Quantity must be a valid number");
    } else if (quantity < 0) {
      errors.push("Quantity cannot be negative");
    } else if (!Number.isInteger(quantity)) {
      errors.push("Quantity must be a whole number");
    } else if (quantity > 1000000) {
      errors.push("Quantity is too large");
    }
  }

  // Check for duplicate product name (optional - if you want unique product names)
  if (product?.name && product.name.trim()) {
    const query = {
      "product.name": {
        $regex: new RegExp(`^${product.name.trim()}$`, "i"),
      },
    };

    if (goodsId) {
      query._id = { $ne: goodsId };
    }

    const existingGoods = await Goods.findOne(query);
    if (existingGoods) {
      errors.push(`Product '${product.name.trim()}' already exists`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
