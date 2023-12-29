const User = require('../models/User.js');

async function register (req, res){
    try{
        if(req.body.password === req.body.confirmPassword){
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
                

                res.status(200).json( registeredUser );
            }  
        else{
            res.status(400).json({ error: 'Passwords Do Not Match' });
        }
    }
    catch(e){
        res.status(500).json({error: "Error Registering User"});
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
        
        const sanitizedUser = {
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email 
        };
    
        res.status(200).json({sanitizedUser});
    } catch (error) {
        res.status(500).json({ error: "Failed to Log In" });
    }
};
  
  
module.exports = {
    register: register,
    login: login,
};