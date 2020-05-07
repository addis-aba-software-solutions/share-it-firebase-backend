const { db, admin, firebaseConfig } = require('../utils/firebase');
const Promises = require('promise');

// This will get all items from the collections
exports.getProducts = async (req, res) => {
  // getItemsFromDatabase(res);
  try {
    const snapshot = await db
      .collection('posts')
      .orderBy('updatedAt', 'desc')
      .limit(100)
      .get();

    const posts = [];
    snapshot.docs.map((doc) => {
      posts.push({ post: doc.data(), id: doc.id });
    });
    return res.status(200).json({
      posts,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get single item by id
exports.getProduct = async (req, res) => {
  try {
    const document = db.collection('posts').doc(req.query.id);
    let item = await document.get();
    let id = document.id;
    let post = item.data();
    return res.status(200).json({ post, id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Returns list of items based on their category requested
exports.getProductByCatagory = async (req, res) => {
  try {
    const snapshot = await db
      .collection(`posts`)
      .where('category', '==', req.query.category)
      .limit(100)
      .get();
    const posts = [];
    snapshot.docs.map((doc) => {
      posts.push({ post: doc.data(), id: doc.id });
    });
    return res.status(200).json({
      posts,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// Returns list of items based on their category requested
exports.getProductBySubCatagory = async (req, res) => {
  try {
    const snapshot = await db
      .collection(`posts`)
      .where('category', '==', req.query.category)
      .where('subCategory', '==', req.query.subCategory)
      .limit(100)
      .get();
    const posts = [];
    snapshot.docs.map((doc) => {
      posts.push({ post: doc.data(), id: doc.id });
    });
    return res.status(200).json({
      posts,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// post item with image
exports.postItem = (req, res) => {
  const Busboy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  // Instantiate busboy
  const busboy = new Busboy({ headers: req.headers });

  let imageFileName = {};
  let imagesToUpload = [];
  let imageToAdd = {};
  //This triggers for each file type that comes in the form data
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted!' });
    } else {
      // Getting extension of any image
      const imageExtension = filename.split('.')[
        filename.split('.').length - 1
      ];
      // Setting filename
      imageFileName = `${Math.round(
        Math.random() * 1000000000
      )}.${imageExtension}`;
      // Creating path
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToAdd = {
        imageFileName,
        filepath,
        mimetype,
      };
      file.pipe(fs.createWriteStream(filepath));
      imagesToUpload.push(imageToAdd);
    }
  });
  let formData = new Map();
  busboy.on('field', (fieldname, val) => {
    formData.set(fieldname, val);
  });
  busboy.on('finish', async () => {
    let promises = [];
    let imageUrls = [];
    imagesToUpload.forEach((imageToBeUploaded) => {
      imageUrls.push(
        `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageToBeUploaded.imageFileName}?alt=media`
      );
      promises.push(
        admin
          .storage()
          .bucket()
          .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageToBeUploaded.mimetype,
              },
            },
          })
      );
    });
    try {
      await Promises.all(promises);
      const newPost = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        condition: formData.get('condition'),
        category: formData.get('category'),
        subCatagory: formData.get('subCatagory'),
        termAndCondition: formData.get('termAndCondition'),
        sold: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        email: req.user.email,
        postImage: imageUrls,
      };
      try {
        const doc = await db.collection('posts').add(newPost);
        return res.status(201).json({
          message: `Post Successfully added!`,
          postId: doc.id,
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    } catch (err) {
      return err;
    }
  });
  busboy.end(req.rawBody);
};

exports.subCatagory = (req, res) => {
  let catagory = req.body.catagory;
  const subProduct = ['product1', 'product2', 'product3'];
  const subSevice = ['service1', 'service2', 'service3'];
  const subDigital = ['digital1', 'digital2', 'digital3'];

  switch (catagory) {
    case 'Product':
      res.status(200).json({ subCatagory: subProduct });
      break;
    case 'Service':
      res.status(200).json({ subCatagory: subSevice });
      break;
    case 'Digital':
      res.status(200).json({ subCatagory: subDigital });
      break;
    default:
      return null;
  }
};
exports.updatePostStatus = async (req, res) => {
  try {
    const post = await db
      .collection('posts')
      .doc(req.query.id)
      .update({ sold: true });
    return res.status(200).json({
      message: 'Item Status changed sold or rented',
    });
  } catch (error) {
    return res.status(500).json({ error: error.code });
  }
};
