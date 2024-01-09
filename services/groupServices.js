import Group from '../models/Groups.js';
import Company from '../models/Company.js';

async function getAll(req, res){
    try {
        const groups = await Group.find().lean();
        
        return res.status(200).json(groups);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Countries'})
    }
};

async function add(req, res) {
    try {
        const groups = await Group.findOne({ name: req.body.name });

        if (groups) {
            return res.status(400).json({ error: 'Group Already Exists' });
        }

        await Group.create({name : req.body.name});

        return res.status(201).json({message: 'Group Added Succesfuly'});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Adding Group' });
    }
};

async function getById(req, res) {
    try {
        const groups = await Group.find({ _id: req.params.id });

        return res.status(201).json({groups});
    } catch (error) {
        return res.status(500).json({ error: 'Problem Adding Group' });
    }
};

async function update(req, res){
    try {
        const updateGroup = await Group.findOneAndUpdate(
            { _id: req.body.id},
            req.body,
            { new: true }
        );

        return res.status(200).json(updateGroup);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Update Group' });
    }
};

async function delet(req, res) {
    try {
        await Group.findOneAndDelete({ _id: req.params.id });

        await Company.updateMany(
            {group: req.params.id},
            {group: null}
        );

        return res.status(200).json({message: "Group Removed Succesfuly"});
    } catch (error) {
        return res.status(500).json({ error: 'Error Deleting A Group' });
    }
};

export default {
    getAll,
    getById,
    add,
    delet,
    update
};