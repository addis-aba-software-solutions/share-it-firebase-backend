const { db, admin, firebaseConfig } = require('../utils/firebase');
const Promises = require('promise');
exports.uploadPostImage = (req, res) => {
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
      //Add the image to the array
      imagesToUpload.push(imageToAdd);
      return null;
    }
  });

  busboy.on('finish', async () => {
    let promises = [];
    let imageUrls = [];
    imagesToUpload.forEach((imageToBeUploaded) => {
      console.log('the file name is');
      console.log(imageToBeUploaded);
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
      res
        .status(200)
        .json({ msg: 'Successfully uploaded all images', imageUrls });
    } catch (err) {
      console.log('the error is');
      console.log(err);

      res.status(500).json(err);
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
