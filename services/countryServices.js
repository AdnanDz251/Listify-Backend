import Country from '../models/Country.js';

async function getAll(req, res){
    try {
        const countries = await Country.find().lean();
        
        return res.status(200).json(countries);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Countries'})
    }
};

export default {
    getAll
};