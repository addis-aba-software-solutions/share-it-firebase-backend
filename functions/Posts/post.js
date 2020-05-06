const { db, admin } = require('../utils/firebase');



exports.signup = async (req, res) => {
    try {
        //   const errors = validationResult(req);
        //   if (!errors.isEmpty())
        //     return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        // Register the user with email and password and get token
        const data = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password);
        const token = await data.user.getIdToken();

        // Get registered user data
        const userId = data.user.uid;
        const newUser = {
            userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            facebook: req.body.facebook,
            telegram: req.body.telegram,
            whatsapp: req.body.whatsapp,
            gender: req.body.gender,
            birthDay: req.body.birthDay,
            description: req.body.description,
            streetAddress: req.body.streetAddress,
            streetAddress2: req.body.streetAddress2,
            state: req.body.state,
            zipcode: req.body.zipcode,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // ADD user with email as a document id
        await db.doc(`/users/${newUser.email}`).set(newUser);
        // Return the token
        return res.status(201).json({
            message: `User ${data.user.uid} Successfully Registered!`,
            token,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
//  This will add new product item
exports.addProduct = async (req, res) => {
    const formData = req.body;
    const newPost = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        subCategory: formData.subCategory,
        termAndCondition: formData.termAndCondition,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: formData.imageUrl,
        // uid: formData.imageUrl,
    };
    try {
        const document = await db.collection("posts");
        document.add(newPost);
        return res.status(201).json({
            message: `Post Successfully added!`,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// This will get all items from the collections
exports.getProducts = async (req, res) => {

    // getItemsFromDatabase(res);
    try {
        const snapshot = await db
            .collection("posts")
            .orderBy("updatedAt", "desc")
            .limit(100)
            .get()

        res.send(snapshot.docs.map(doc => doc.data()))


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    // db.collection("cities").doc("LA").set({
    //     name: "Los Angeles",
    //     state: db.collection("states").doc("CA"),
    //     country: "USA",
    // });
};

const getItemsFromDatabase = async (res) => {
    let items = [];
    const database = await db
        .collection("posts").ref('/posts');
    return database.on('value', (snapshot) => {
        snapshot.forEach((item) => {
            items.push({
                id: item.key,
                item: item.val().item
            });
        });
        console.log(items);

        res.status(200).json(items);
    }, (error) => {
        res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
        })
    })
};

// get single item by id
exports.getProduct = async (req, res) => {
    try {
        const document = db.collection('posts').doc(req.query.id);
        let item = await document.get();
        let response = item.data();
        return res.status(200).send(response);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Returns list of items based on their category requested
exports.getProductByCatagory = async (req, res) => {
    try {
        const snapshot = await db.collection(`posts`).where('category', '==', req.query.category).limit(100).get()
        // console.log(snapshot);

        res.send(snapshot.docs.map(doc => doc.data()))

    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
// Returns list of items based on their category requested
exports.getProductBySubCatagory = async (req, res) => {
    try {
        const snapshot = await db.collection(`posts`)
            .where('category', '==', req.query.category)
            .where('subCategory', '==', req.query.subCategory).limit(100).get()
        res.send(snapshot.docs.map(doc => doc.data()))

    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
