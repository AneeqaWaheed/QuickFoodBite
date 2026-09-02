import Product from "../models/productModel.js";
import fs from "fs";
import { Types } from "mongoose";
import categoryModel from "../models/categoryModel.js";
import { error } from "console";
//create product
import cloudinary from "../config/cloudinary.js";

export const createProductController = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { name, price, category, type } = req.body;

    // Check required fields
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is Required",
      });
    }

    if (!price) {
      return res.status(400).send({
        success: false,
        message: "Price is Required",
      });
    }

    if (!category) {
      return res.status(400).send({
        success: false,
        message: "Category is Required",
      });
    }

    if (!type) {
      return res.status(400).send({
        success: false,
        message: "Type is Required",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Image is Required",
      });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(200).send({
        success: false,
        message: "Product already exists, please add another one",
      });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "quickfoodbite/products",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Save product
    const product = await new Product({
      name,
      price,
      category,
      type,
      image: result.secure_url,
    }).save();

    res.status(201).send({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.log("Create Product Error:", error);

    res.status(500).send({
      success: false,
      message: "Error while adding Product",
      error: error.message,
    });
  }
};

//get Products
export const getProductController = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(1000)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Error getting all products",
        error,
      });
  }
};
//get single product
export const singleProductController = async (req, res) => {
  try {
    // Use req.params.id if you're using a URL parameter
    const product = await Product.findOne({ _id: req.params.id }) // Assuming you're using MongoDB's default _id
      .select("-image")
      .populate("category");

    // Check if product is found
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Product Successfully Retrieved",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Single Product",
      error,
    });
  }
};

//get Product Image
export const productImageController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).select("image");
    // console.log(product)
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }
    console.log("Image");
    const image = product.image.data;
    //res.set('Content-type', product.images.contentType);
    return res.status(200).send({
      image,
      message: "Image",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting image",
      error,
    });
  }
};
//delete product
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting Product",
      error,
    });
  }
};


export const updateProductController = async (req, res) => {
  try {
    const { name, price, category, type } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({
          success: false,
          message: "Name is Required",
        });

      case !price:
        return res.status(400).send({
          success: false,
          message: "Price is Required",
        });

      case !category:
        return res.status(400).send({
          success: false,
          message: "Category is Required",
        });

      case !type:
        return res.status(400).send({
          success: false,
          message: "Type is Required",
        });
    }

    // Find existing product
    const existingProduct = await Product.findById(req.params.prId);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Keep existing image
    let image = existingProduct.image || "";

    // If a new image was selected
    if (req.file) {
      console.log("Uploading new image to Cloudinary...");

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "quickfoodbite/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file.buffer);
      });

      image = result.secure_url;

      console.log("Cloudinary URL:", image);
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.prId,
      {
        name,
        price,
        category,
        type,
        image,
      },
      {
        new: true,
      }
    );

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error: error.message,
    });
  }
};
//product filter
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.categories = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while filtering Products",
    });
  }
};
//product count
export const productCountController = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Product Count",
    });
  }
};
//product list
export const productListController = async (req, res) => {
  try {
    const perPage = 12;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const category = req.query.category || "All"; // Default to "All" if category is empty

    // Check if category is empty after setting a default
    if (category.trim() === "") {
      return res.status(400).send({
        success: false,
        message: "Category parameter cannot be empty.",
      });
    }

    const query = {};
    let categoryId;

    console.log("Category received:", category);

    if (category !== "All") {
      const foundCategory = await categoryModel.findOne({ name: category });

      if (!foundCategory) {
        return res.status(404).send({
          success: false,
          message: "Category not found.",
        });
      }

      categoryId = foundCategory._id;
      query.category = categoryId;
    }

    console.log("Query object:", query);

    const products = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / perPage);

    res.status(200).send({
      success: true,
      products,
      totalPages,
    });
  } catch (error) {
    console.error("Error in productListController:", error);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

//search Controller

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
    
      ],
    }).select("-images");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while searching Products",
    });
  }
};
