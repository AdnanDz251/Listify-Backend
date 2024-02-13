import Company from '../models/Company.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import axios from 'axios';
import fs from 'fs';

async function getAll(req, res){
    try {
        const companies = await Company.find()
                                .populate({path: 'countries', select: 'name '})
                                .populate({path: 'categories', select: 'name' })
                                .populate({path: 'hq', select: 'name' });

        return res.status(200).json(companies);
    } catch (error) {
        return res.status(500).json({error})
    }
};

async function getByName(req, res){
    try {
        const regex = new RegExp(req.params.name, 'i');
        const company = await Company.find({name: { $regex: regex }})
                                .populate({path: 'countries', select: 'name'})
                                .populate({path: 'categories', select: 'name' })
                                .populate({path: 'hq', select: 'name' });

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Company' });
    }
};

async function getByGroup(req, res){
    try {
        const company = await Company.find({group: req.params.group })
                            .populate({path: 'countries', select: 'name'})
                            .populate({path: 'categories', select: 'name' })
                            .populate({path: 'hq', select: 'name' });

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Company' });
    }
};

async function getById(req, res) {
    try {
        const company = await Company.findOne({_id: req.params.id })
                            .populate({path: 'countries', select: 'name'})
                            .populate({path: 'categories', select: 'name' })
                            .populate({path: 'hq', select: 'name' })
                            .lean();

        const reviews = await Review.find({ companyId: req.params.id });

        let totalRating = 0;

        if (reviews.length > 0) {
            totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            totalRating = totalRating / reviews.length;
        }
        
        company.avg = totalRating;

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json(error);
    }
};

async function add(req, res) {
    try {
        const existingCompanies = await Company.find({ name: req.body.name });

        if (existingCompanies.length > 0) {
            return res.status(400).json({ error: 'Company Already Exists' });
        }

        const comp = await Company.create({
            name : req.body.name,
            description : req.body.description,
            logo : req.body.logo,
            websiteURL : req.body.websiteURL,
            linkedinURL : req.body.linkedinURL,
            hq : req.body.hq,
            countries : req.body.countries,
            group: req.body.group
        });

        return res.status(201).json({message: 'Company Added Succesfuly', company_id : comp._id});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Adding Company' });
    }
};

async function update(req, res){
    try {
        const updateCompany = await Company.findOneAndUpdate(
            { _id: req.body.id},
            req.body,
            { new: true }
        );

        return res.status(200).json(updateCompany);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Update Company' });
    }
};

async function remove(req, res, next) {
    try {
        await Company.findOneAndDelete({ _id: req.params.id });

        await User.updateMany(
                {company: req.params.id},
                {company: null}
            );

        return res.status(200).json({message: "Company Removed Succesfuly"});
    } catch (error) {
        return res.status(500).json({ error: 'Error Deleting A Company' });
    }
};

async function getByCountry(req, res){
    try {
        const company = await Company.find({countries: req.params.country })
                                .populate({path: 'countries', select: 'name'})
                                .populate({path: 'categories', select: 'name' })
                                .populate({path: 'hq', select: 'name' });

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Company' });
    }
};

async function getAllUsersInCompany(req, res){
    try{
        const users = await User.find({company : req.params.companyId});

        return res.status(200).json(users);
    } catch(error){
        return res.status(500).json({error: "Cant Get Users"});
    }
};

async function addImageToCompany(req, res){
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const imageData = fs.readFileSync(req.file.path);

        const base64ImageData = imageData.toString('base64');

        const imgurResponse = await axios.post('https://api.imgur.com/3/image', {
            image: base64ImageData,
        }, {
            headers: {
                'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            },
        });

        await Company.findOneAndUpdate({_id: req.params.companyId},
                                    {logo: imgurResponse.data.data.link},
                                    {new: true});
        
        fs.unlinkSync(req.file.path);

        return res.status(200).json({message: "Immage Added Succefuly"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Problem Adding Image"});
    }
};

export default {
    getAll,
    getByName,
    getById,
    add,
    update,
    getByGroup,
    getByCountry,
    remove,
    getAllUsersInCompany,
    addImageToCompany
};