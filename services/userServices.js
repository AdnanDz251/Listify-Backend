import User from '../models/User.js';
import help from'../helper/getFromToken.js';
import mailer from 'nodemailer';
import generatePassword from 'generate-password';
import ejs from 'ejs';
import axios from 'axios';
import fs from 'fs';
import Request from '../models/Request.js';
import Review from '../models/Review.js';


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
        const users = await User.find()
                        .populate({path: 'categories', select: 'name' });

        if(!users){
            return res.status(404).json({ error: 'Cant Find Users' });
        }
        
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({error: 'Error Getting All Users'})
    }
};


async function getByName(req, res){
    try {
        const users = await User.find({name: req.params.name })
                        .populate({path: 'categories', select: 'name' });

        if(!users){
            return res.status(404).json({ error: 'Cant Find Users' });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};


async function getByEmail(req, res){
    try {
        const users = await User.find({email: req.params.email })
                            .populate({path: 'categories', select: 'name -_id' });

        if(!users){
            return res.status(404).json({ error: 'Cant Find Users' });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};


async function getById(req, res) {
    try {
        const users = await User.findOne({_id: req.params.id })
                            .populate({path: 'categories', select: 'name' });
        
        if(!users){
            return res.status(404).json({ error: 'Cant Find Users' });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};


async function getByIsActive(req, res) {
    try {
        const users = await User.find({isActive: req.params.isActive})
                            .populate({path: 'categories', select: 'name' });

        if(!users){
            return res.status(404).json({ error: 'Cant Find Users' });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Get Users' });
    }
};


async function joinCompany(req, res){
    try {        

        await User.findByIdAndUpdate(
            {_id : req.body.user_id },
            {   
                company : req.body.company_id,
                joinedAt: new Date()
            }
        );

        return res.status(200).json({message: "Succesfuly Joined Company"});
    } catch (error) {
        return res.status(500).json({ error: 'Cant Add User To Company' });
    }
};

async function leaveCompany(req, res){
    try {        

        await User.findByIdAndUpdate(
            {_id : req.params.userId },
            {
                company : null,
                joinedAt : null,
            }
        );

        return res.status(200).json({message: "Succesfuly Left Company"});
    } catch (error) {
        return res.status(500).json({ error: 'Cant Remove User From Company' });
    }
};

async function getAdmitted(req, res) {
    try {
        const users = await User.find({isAdmitted: false, isBanned: false})
                            .populate({path: 'categories', select: 'name' });

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

        await Request.deleteMany({userId: req.params.id});
        await Review.deleteMany({userId: req.params.id});
   
        const token = updateUser.createJWT();

        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Ban User' });
    }
};

async function unBanUser(req, res){
    try {
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId},
            { isAdmitted: true,
                isBanned: false},
            { new: true }
        );

        const token = updateUser.createJWT();

        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: 'Cant UnBan User' });
    }
};

async function refresh(req, res){
    try {
        const user_id = await help.getId(req);
        
        const user = await User.findOne({_id : user_id});
        
        if(!user.isAdmitted){
            const authHeader = req.headers['authorization'];
            const tok = authHeader && authHeader.split(' ')[1];

            return res.status(300).json(tok);
        }

        const token = user.createJWT();

        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Refresh User' });
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

async function demoteFromAdmin(req, res){
    try {

        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.id},
            { isAdmin: flase},
            { new: true }
        );
   
        const token = updateUser.createJWT();

        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: 'Cant Update User' });
    }
};

async function disband(req, res){
    try {
        await User.deleteOne({_id : req.params.userId});

        return res.status(200).json({message: "User Deleted Succesfuly"});
    } catch (error) {
        return res.status(500).json({ error: 'Cant Delete User' });
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


async function sendAcceptanceMail(req, res){
    try{
        const user = await User.findOne({email: req.params.email})

        if(!user){
            return res.status(404).json({ message: 'User Not Found' });
        }

        const transporter = mailer.createTransport({
            host: "mail.skim.ba",
            port: 465,
            secure: true,
            auth: {
              user: process.env.MAILER_EMAIL,
              pass: process.env.MAILER_PASSWORD,
            },
        });

        const link = process.env.MAIL_URL
        const user_id = user._id;

        const mailOptions = {
            from: process.env.MAILER_EMAIL,
            to: req.params.email,
            subject: "[LISTIFY] Password Recovery Confirmation",
            html: ` <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Email template with CTA</title>
                        <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
                    </head>
                    
                    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
                        <table role="presentation"
                        style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
                        <tbody>
                            <tr>
                            <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                                <tbody>
                                    <tr>
                                    <td style="padding: 40px 0px 0px;">
                                        <div style="text-align: center;">
                                        <div style="padding-bottom: 20px;"><img src="https://i.imgur.com/VPkSySd.png" alt="Listify" style="width: 168px;"></div>
                                        </div>
                                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                        <div style="color: rgb(0, 0, 0); text-align: left;">
                                            <p style="padding-bottom: 16px">Hello,</p>
                                            <p style="padding-bottom: 16px">We received a request to reset your password. If you didn't make this request, you can
                                            ignore this email. To reset your password, click the button below: </p>
                                            <p style="padding-bottom: 16px"><a href="${link}/${user_id}" target="_blank"
                                                style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block;margin: 0.5rem 0;">Retrieve
                                                Password</a></p>
                                            <p style="padding-bottom: 16px"><span
                                                style="color: #FF0000">Please Press the Button Only Once</span></p>
                                            <p style="padding-bottom: 16px">Best regards,<br><span style="color: #999">SKIM Team</span></p>
                                        </div>
                                        </div>
                                        <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;"></div>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </body>`,
        };
    
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email Sent Successfully' });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Email Cant be Sent' });
    }
};


async function sendChangeMail(req, res){
    try{
        const user = await User.findOne({_id: req.params.user_id});

        if(!user){
            return res.status(404).json({ message: 'User Not Found' });
        }

        const newPassword = generatePassword.generate({
            length: 12,
            numbers: true,
            symbols: true,
            uppercase: true,
            lowercase: true,
        });

        await User.updatePassword(req.params.user_id, newPassword);

        const transporter = mailer.createTransport({
            host: "mail.skim.ba",
            port: 465,
            secure: true,
            auth: {
              user: process.env.MAILER_EMAIL,
              pass: process.env.MAILER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAILER_EMAIL,
            to: user.email,
            subject: "[LISTIFY] New Password",
            html: await ejs.renderFile(process.cwd() + '/views/emailTemplate.ejs', { newPassword }),
        };

        await transporter.sendMail(mailOptions);
        return res.status(200);
    }
    catch(error){
        return res.status(500).json({ error });
    }
};


async function approveNewUser(req, res){
    try{
        const user = await User.findOne({_id : req.params.user_id});

        if(!user){
            return res.status(404).json({message: "User Not Found"});
        }

        await User.updateOne(
                { _id: req.params.user_id},
                {isAdmitted : true},
                { new: true });

        return res.status(200).json({message: "User Approved"});
    }
    catch(error){
        return res.status(500).json({message : "Problem Approving Users"});
    }
};


async function info(req, res){
    return res.status(200).json({status: "Healthy"});
};

async function addUserImage(req, res){
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

        const userId = await help.getId(req);

        await User.findOneAndUpdate({_id: userId},
                                    {image: imgurResponse.data.data.link},
                                    {new: true});

        fs.unlinkSync(req.file.path);

        return res.status(200).json({message: "Immage Added Succefuly"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Problem Adding Image"});
    }
};

async function changePassword(req, res){
    try {
        const userId = await help.getId(req);
        
        const user = await User.findOne({_id: userId}).select('+password');;

        const passwordMatches = await user.comparePassword(req.body.oldPassword);
        console.log(passwordMatches);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        await User.updatePassword(userId, req.body.newPassword);
        
        return res.status(200).json("Password Updated");
    } catch (error) {
        return res.status(500).json({message: "Problem updating password"})
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
    promoteToAdmin,
    sendAcceptanceMail,
    sendChangeMail,
    approveNewUser,
    info,
    addUserImage,
    refresh,
    changePassword,
    disband,
    unBanUser,
    leaveCompany,
    demoteFromAdmin
};