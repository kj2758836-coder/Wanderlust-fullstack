const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))  // Index Route
  .post(                                    // Create Route
    isLoggedIn, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.createListing)
  ); 
  
// Search Route
router.get("/search", wrapAsync(listingController.search)); 

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);  

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))    // Read: Show Route
  .put(
    isLoggedIn, 
    isOwner, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing))   // Update Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));  // Delete Route

// Edit Route
router.get("/:id/edit",
   isLoggedIn, 
   isOwner,
   wrapAsync(listingController.renderEditForm)
);

module.exports = router;