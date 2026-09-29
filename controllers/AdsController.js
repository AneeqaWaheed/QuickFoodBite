import Ad from "../models/adModel.js";
import cloudinary from "../config/cloudinary.js";

// CREATE AD
export const createAdController = async (req, res) => {
  try {


    const { buttonText, buttonLink, isActive } = req.body;
    // Check image
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Promotional image is required",
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "quickfoodbite/promotional-ads",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    // Save Cloudinary URL in MongoDB
    const ad = await Ad.create({
      image: uploadResult.secure_url,
      buttonText: buttonText || "",
      buttonLink: buttonLink || "",
      isActive:
        isActive === undefined
          ? true
          : isActive === "true" || isActive === true,
    });

    return res.status(201).send({
      success: true,
      message: "Promotional ad created successfully",
      ad,
    });
  } catch (error) {
    console.error("CREATE AD ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error creating promotional ad",
      error: error.message,
    });
  }
};
// GET ALL ADS - ADMIN
export const getAllAdsController = async (req, res) => {
  try {
    const ads = await Ad.find({}).sort({
      createdAt: -1,
    });

    return res.status(200).send({
      success: true,
      count: ads.length,
      ads,
    });
  } catch (error) {
    console.log("GET ALL ADS ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error fetching advertisements",
      error: error.message,
    });
  }
};

// GET ACTIVE ADS - PUBLIC
export const getActiveAdsController = async (req, res) => {
  try {
    const ads = await Ad.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).send({
      success: true,
      count: ads.length,
      ads,
    });
  } catch (error) {
    console.log("GET ACTIVE ADS ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error fetching active advertisements",
      error: error.message,
    });
  }
};

// DELETE AD
export const deleteAdController = async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await Ad.findById(id);

    if (!ad) {
      return res.status(404).send({
        success: false,
        message: "Advertisement not found",
      });
    }

    // Delete image from Cloudinary
    if (ad.image) {
      try {
        const imageUrl = ad.image;

        const uploadIndex = imageUrl.indexOf("/upload/");

        if (uploadIndex !== -1) {
          let publicId = imageUrl.substring(
            uploadIndex + 8
          );

          // Remove version from URL
      publicId = publicId.replace(/^v\d+\//, "");
publicId = publicId.replace(/\.[^/.]+$/, "");

          console.log(
            "Deleting Cloudinary image:",
            publicId
          );

          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        // Do not stop database deletion if Cloudinary deletion fails
        console.log(
          "Cloudinary delete error:",
          cloudinaryError
        );
      }
    }

    await Ad.findByIdAndDelete(id);

    return res.status(200).send({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.log("DELETE AD ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error deleting advertisement",
      error: error.message,
    });
  }
};

// TOGGLE ACTIVE / INACTIVE
export const toggleAdStatusController = async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await Ad.findById(id);

    if (!ad) {
      return res.status(404).send({
        success: false,
        message: "Advertisement not found",
      });
    }

    ad.isActive = !ad.isActive;

    await ad.save();

    return res.status(200).send({
      success: true,
      message: `Advertisement ${
        ad.isActive ? "activated" : "deactivated"
      } successfully`,
      ad,
    });
  } catch (error) {
    console.log("TOGGLE AD ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error changing advertisement status",
      error: error.message,
    });
  }
};
