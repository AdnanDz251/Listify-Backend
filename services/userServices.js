import User from '../models/User.js';
import help from'../helper/getFromToken.js';

async function register(req, res){
    try{
        if(req.body.password !== req.body.confirmPassword){
            return res.status(400).json({ error: 'Passwords Do Not Match' });
        }

        const user = await User.findOne({ email: req.body.email });
        
        if (user) {
            return res.status(400).json({ error: 'Email Already Exists' });
        }

        let registeredUser = await User.create({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password,
        });
            
        const token = registeredUser.createJWT();

        return res.status(200).json(token);
    }
    catch(error){
        console.log(error)
       return res.status(500).json({error: error});
    }
};
  
async function login(req, res) {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ error: "Email or Password Not Entered" });
        }
    
        const user = await User.findOne({ email }).select('+password');
    
        if (!user) {
            return res.status(404).json({ error: "User Not found" });
        }
    
        const passwordMatches = await user.comparePassword(password);

        if (!passwordMatches) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        
        const token = user.createJWT();

        return res.status(200).json({token});
    } catch (error) {
        return res.status(500).json({error:"Failed to Log In"});
    }
};
  
async function getAll(req, res){
    try {
        const users = await User.find().lean();
        
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Users'})
    }
};

async function getByName(req, res){
    try {
        const users = await User.find({name: req.params.name });

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};

async function getByEmail(req, res){
    try {
        const users = await User.find({email: req.params.email });

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};

async function getById(req, res) {
    try {
        const users = await User.findOne({_id: req.params.id });

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};

async function getByIsActive(req, res) {
    try {
        const users = await User.find({isActive: req.params.isActive});

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};

async function joinCompany(req, res){
    try {        

        await User.findByIdAndUpdate(
            {_id : req.body.user_id },
            {company : req.body.company_id}
        );

        return res.status(200).json({message: "Succesfuly Joined Company"});
    } catch (error) {
        return res.status(500).json({ error: 'Cant Add User To Company' });
    }
};

async function getAdmitted(req, res) {
    try {
        const users = await User.find({isAdmitted: false, isBanned: false});

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};

async function banUser(req, res){
    try {

        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.id},
            { isAdmitted: false,
                isBanned: true,
                isAdmin: false},
            { new: true }
        );
   
        const token = updateUser.createJWT();

        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Ban User' });
    }
};

async function promoteToAdmin(req, res){
    try {

        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.id},
            { isAdmin: true},
            { new: true }
        );
   
        const token = updateUser.createJWT();

        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Update User' });
    }
};


async function update(req, res){
    try {
        const userId = await help.getId(req);

        const updateUser = await User.findOneAndUpdate(
            { _id: userId},
            req.body,
            { new: true }
        );
   
        const token = updateUser.createJWT();

        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Update User' });
    }
};

async function deactivate(req, res) {
    try {
        await User.updateOne(
            { _id: req.body.id }, 
            { $set: { isAdmitted: req.body.isAdmitted } } 
        );

        return res.status(200).json({message: "User Deactivated Succesfuly"});
    } catch (error) {
        return res.status(500).json({ error: 'Error Deactivating User' });
    }
};

export default {
    register,
    login,
    getAll,
    getByName,
    getByEmail,
    getById,
    getByIsActive,
    getAdmitted,
    update,
    deactivate,
    joinCompany,
    banUser,
    promoteToAdmin
};