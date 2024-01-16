import Company from '../models/Company.js';
import Review from '../models/Review.js';

async function getByCompany(req, res){
    try {
        const reviews = await Review.find({companyId: req.params.company})

        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Review' });
    }
};

async function getById(req, res) {
    try {
        const review = await Review.find({_id: req.params.id });

        return res.status(200).json(review);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Review' });
    }
};

async function getByUserId(req, res){
    try{
        const review = await Review.find({userId: req.params.id });

        return res.status(200).json(review);
    } catch(error){
        return res.status(500).json({ error: 'Cant Get Reviews' });
    }
}

async function add(req, res) {
    try {
        await Review.create({
            userId: req.body.userId,
            companyId: req.body.companyId,
            text: req.body.text,
            rating: req.body.rating,
        });

        return res.status(200).json({message: 'Company Added Succesfuly'});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Adding Review' });
    }
};

async function update(req, res){
    try {
        const review = await Review.findOneAndUpdate(
            { _id: req.body.id},
            req.body,
            { new: true }
        );

        return res.status(200).json(review);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Update Review' });
    }
};

async function remove(req, res) {
    try {
        await Review.findOneAndDelete({ _id: req.params.id });

        return res.status(200).json({message: "Review Removed Succesfuly"});
    } catch (error) {
        return res.status(500).json({ error: 'Error Deleting A Review' });
    }
};

export default {
    getByCompany,
    getById,
    add,
    update,
    remove,
    getByUserId
};