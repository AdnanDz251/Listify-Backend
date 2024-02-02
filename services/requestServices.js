import Request from '../models/Request.js';

async function getAll(req, res){
    try {
        const request = await Request.find()

        return res.status(200).json(request);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Request' });
    }
};

async function getById(req, res) {
    try {
        const request = await Request.find({_id: req.params.id });

        return res.status(200).json(request);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Request' });
    }
};

async function getByUserId(req, res){
    try{
        const request = await Request.find({userId: req.params.userId });

        return res.status(200).json(request);
    } catch(error){
        return res.status(500).json({ error: 'Cant Get Request' });
    }
};

async function getByCompanyId(req, res){
    try{
        const request = await Request.find({companyId: req.params.companyId });

        return res.status(200).json(request);
    } catch(error){
        return res.status(500).json({ error: 'Cant Get Request' });
    }
}

async function add(req, res) {
    try {
        await Request.create({
            userId: req.body.userId,
            companyId: req.body.companyId,
            text: req.body.text,
            type: req.body.type,
        });

        return res.status(200).json({message: 'Request Added Succesfuly'});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Adding Request' });
    }
};

async function remove(req, res) {
    try {
        await Request.findOneAndDelete({ _id: req.params.id });

        return res.status(200).json({message: "Request Removed Succesfuly"});
    } catch (error) {
        return res.status(500).json({ error: 'Error Deleting A Request' });
    }
};

export default {
    getByCompanyId,
    getById,
    add,
    getAll,
    remove,
    getByUserId
};