import Country from '../models/Country.js';

async function getAll(req, res){
    try {
        const countries = await Country.find().lean();
        
        return res.status(200).json(countries);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Countries'})
    }
};

async function getByName(req, res){
    try {
        const regex = new RegExp(req.params.name, 'i');
        const countries = await Country.find({name: { $regex: regex }});
        
        return res.status(200).json(countries);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Countries'})
    }
};

async function getById(req, res){
    try {
        const countries = await Country.find({_id: req.params.id});
        
        return res.status(200).json(countries);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Countries'})
    }
};

export default {
    getAll,
    getByName,
    getById
};