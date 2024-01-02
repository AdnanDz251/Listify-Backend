const User = require('../models/User.js');
const addFunct = require('../middleware/additionalFunct.js');

async function register (req, res){
    try{
        if(req.body.password === req.body.confirmPassword){
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: 'Email Already Exists' });
            }

            if (await addFunct.isPasswordPwned(req.body.password) > 0) {
                return res.status(400).json({ error: 'Password has been Pwned' });
            } else {
      
                let registeredUser = await User.create({
                email: req.body.email,
                name: req.body.name,
                surname: req.body.surname,
                password: req.body.password,
                });
                
                const token = registeredUser.createJWT();

                res.status(200).json( token );
            }
        }  
        else{
            res.status(400).json({ error: 'Passwords Do Not Match' });
        }
    }
    catch(error){
        res.status(500).json({error:"Error Registering User"});
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
    
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({error:"Failed to Log In"});
    }
};
  
  
module.exports = {
    register: register,
    login: login,
};