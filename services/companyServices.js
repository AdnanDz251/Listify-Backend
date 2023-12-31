import Company from '../models/Company.js';
import User from '../models/User.js';

async function getAll(req, res){
    try {
        const companies = await Company.find().lean();
        
        return res.status(200).json(companies);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Companies'})
    }
};

async function getByName(req, res){
    try {
        const company = await Company.find({name: { $regex: new RegExp(req.body.name, 'i') } });

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Company' });
    }
};

async function getByGroup(req, res){
    try {
        const company = await Company.find({group: req.params.group });

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Company' });
    }
};

async function getById(req, res) {
    try {
        const company = await Company.findOne({_id: req.params.id });

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Company' });
    }
};

async function add(req, res) {
    try {
        const existingCompanies = await Company.find({ name: req.body.name });

        if (existingCompanies.length > 0) {
            return res.status(400).json({ error: 'Company Already Exists' });
        }

        await Company.create({
            name : req.body.name,
            description : req.body.description,
            logo : req.body.logo,
            websiteURL : req.body.websiteURL,
            linkedinURL : req.body.linkedinURL,
            hq : req.body.hq,
            countries : req.body.countries,
            group : req.body.group,
        });

        return res.status(201).json({message: 'Company Added Succesfuly'});
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

async function delet(req, res, next) {
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
        const company = await Company.find({countries: req.params.country });

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Company' });
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
    delet
};