const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://user-admin:admin@cluster0.s94xp.mongodb.net/tree', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('connected to MongoDB'))
    .catch((err) => console.log('could not connect to MongoDB',err))

    //create user Schema
    const userSchema = new mongoose.Schema({ 
        parentId:{type:String},
        name: {
            type: String,
            required: true
        } 
    });

    const Users = mongoose.model('User', userSchema);

    app.use(express.static(path.join(__dirname, 'public')));
    
    //Post Data for Root
    app.post('/postData', async(req,res) =>{
        const parent = new Users({ 
            name:req.body.name
        })        
        const result = await parent.save();
        console.log(result);
    });

    //Post Data
    app.post('/postData/child', async(req,res) =>{
        const child = new Users({ 
            parentId:req.body.parentId,
            name:req.body.name 
        })
        
        const result = await child.save();
        console.log(result);
        res.redirect('/');
    });

    //Get All Data
    app.get('/allData', async(req,res) =>{
        const details = await Users.find();
        res.status(200).json(details)
    });

    //Get root Data
    app.get('/getData', async(req,res) =>{
        const details = await Users.find({_id:"603b66b8ab61560fea7d7077"}); //By default set first root id 
        res.status(200).json(details)
    });

    //Get Childs
    app.get('/getData/childs/:id', async(req,res) =>{
        const details = await Users.find({parentId:req.params.id});
        res.status(200).json(details)
        
    });

    //update child
    app.put('/putData/child/:id', async (req,res) => {
        const putChild = await Users.findById(req.params.id)
        if(!putChild) return res.status(404).send('Not Found');
   
        putChild.set({
            name:req.body.name 
        });        
        const result = await putChild.save();
        console.log(result);
    });

    //move child
    app.put('/putData/moveChild/:id', async (req,res) => {
        const putChild = await Users.findById(req.params.id)
        if(!putChild) return res.status(404).send('Not Found');
   
        putChild.set({
            parentId:req.body.parentId
        });        
        const result = await putChild.save();
        console.log(result);
    });

    //Delete Child
    app.delete('/deleteData/child/:id', async (req,res) => {
        // not existing, return 404
        const deleteChild = await Users.findById(req.params.id)
        if(!deleteChild) return res.status(404).send('Not Found');
        
        //delete
        const result = await Users.deleteOne({_id:deleteChild});
        const resl = await Users.deleteMany({parentId:req.params.id});
        console.log(result);
    });
    //set port number
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Server running on port %d', PORT);
    });
