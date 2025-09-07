// controllers/productController.js
const Product = require('../models/product');
const BestSeller = require('../models/bestSeller');
/**
 * @desc    Create or update a product. Uses upsert to avoid duplicates.
 * @route   POST /api/products
 * @access  Private
 */
exports.addProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Basic validation
    if (!productData.id || !productData.title) {
      return res.status(400).json({ msg: 'Product must have an id and title' });
    }

    // In a real application, you would handle image uploads here first,
    // then save the file paths to productData.images before saving to DB.

    // Use updateOne with upsert to create or update the product
    await Product.updateOne(
      { id: productData.id },
      { $set: productData },
      { upsert: true }
    );

    res.status(201).json({ msg: 'Product created/updated successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Fetch all products within a specific sub-category
 * @route   GET /api/products/category/:subSlug
 * @access  Public
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const { subSlug } = req.params;
    console.log(subSlug)
    const products = await Product.find({ 'category.subCategory.slug': subSlug });

    if (!products.length) {
      return res.status(404).json({ msg: `No products found in category: ${subSlug}` });
    }

    res.json(products);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Fetch a single product by its unique id
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};




/**
 * @desc    Get all best-selling products
 * @route   GET /api/products/bestseller
 * @access  Public
 */
exports.getBestSellers = async (req, res) => {
  try {
    const bestSellers = await BestSeller.find().populate('product');
    res.json(bestSellers);
  } catch (err) {
    console.error(err.message, "here");
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Add a product to the best sellers list
 * @route   POST /api/products/bestseller
 * @access  Private
 */
exports.addBestSeller = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: 'Product ID is required' });
    }

    // Check if the product is already a best seller
    const existing = await BestSeller.findOne({ product: productId });
    if (existing) {
      return res.status(400).json({ msg: 'Product is already a best seller' });
    }

    const newBestSeller = new BestSeller({
      product: productId,
    });

    await newBestSeller.save();
    res.status(201).json({ msg: 'Product added to best sellers' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Delete a product from the best sellers list
 * @route   DELETE /api/products/bestseller/:id
 * @access  Private
 */
exports.deleteBestSeller = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleted = await BestSeller.findOneAndDelete({ product: productId });

    if (!deleted) {
      return res.status(404).json({ msg: 'Best seller entry not found' });
    }

    res.json({ msg: 'Product removed from best sellers' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



/**
 * @desc    Search products by name (case-insensitive, partial match)
 * @route   GET /api/products/search?name=keyword
 * @access  Public
 */
exports.searchProductsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ msg: 'Search query (name) is required' });
    }

    const products = await Product.find({
      $text: { $search: name }, // case-insensitive regex
    });

    if (!products.length) {
      return res.status(404).json({ msg: `No products found matching: ${name}` });
    }

    res.json(products);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


/**
 * @desc    Get a list of all unique brands (vendors)
 * @route   GET /api/products/brands
 * @access  Public
 */
exports.getAllBrands = async (req, res) => {
  try {
    // .distinct() is an efficient way to get all unique values for a field
    const brands = await Product.distinct('vendor');
    res.json(brands);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get all products for a specific brand
 * @route   GET /api/products/brand/:brandName
 * @access  Public
 */
exports.getProductsByBrand = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.params.brandName });
    if (!products.length) {
      return res.status(404).json({ msg: 'No products found for this brand' });
    }
    res.json(products);
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
