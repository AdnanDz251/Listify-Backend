import Category from '../models/Category.js';
import help from'../helper/getFromToken.js';

async function getAll(req, res){
    try {
        const category = await Category.find().lean();
        
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Categories'})
    }
};

async function add(req, res) {
    try {
        const category = await Category.findOne({ name: req.body.name });

        if (category) {
            return res.status(400).json({ error: 'Category Already Exists' });
        }

        await Category.create({name : req.body.name});

        return res.status(201).json({message: 'Category Added Succesfuly'});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Adding Category' });
    }
};

async function getByName(req, res) {
    try {
        const category = await Category.find({name: { $regex: new RegExp(req.body.name, 'i') }});

        return res.status(201).json({category});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Getting Categories' });
    }
};

async function getByUserId(req, res) {
    try {
        const category = await Category.find({_id: req.params.id});

        return res.status(201).json({category});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Getting Categories' });
    }
};

async function addCategoryToUser(req, res){
    try {
        const userId = await help.getId(req);

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { user_id: userId } },
            { new: true }
          );
        
        return res.status(201).json({updatedCategory});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Adding Categories to User' });
    }
};

async function update(req, res){
    try {
        const updateCategory = await Category.findOneAndUpdate(
            { _id: req.body.id},
            req.body,
            { new: true }
        );

        return res.status(200).json(updateCategory);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Update Category' });
    }
};

async function delet(req, res) {
    try {
        await Category.findOneAndDelete({ _id: req.params.id });

        return res.status(200).json({message: "Category Removed Succesfuly"});
    } catch (error) {
        return res.status(500).json({ error: 'Error Deleting A Category' });
    }
};

export default {
    getAll,
    getByName,
    getByUserId,
    addCategoryToUser,
    add,
    delet,
    update
};