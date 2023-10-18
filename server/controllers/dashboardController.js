const Note = require('../models/Note');
const mongoose = require('mongoose');


exports.dashboard = async (req,res) => {

    try {
        const notes = await Note.find({});
        res.render('dashboard/index',{
            userName: req.user.firstName,
            notes,
            layout: '../views/layouts/dashboard'});
    } catch (error) {
        console.log(error);
    }

}

exports.dashboardViewNote = async(req,res) =>{
    const note = await Note.findById({_id: req.params.id})
    .where({user: req.user.id}).lean(); //Нужно, чтобы чужой не могу посмотреть
  
    if(note) {
        
        res.render('dashboard/view-note',{
            noteID: req.params.id,
            note,
            layout: '../views/layouts/dashboard'
        });
    } else {
        res.send("Something went wrong.")
    }
}


exports.dashboardUpdateNote = async (req, res) => {
    try {
      await Note.findOneAndUpdate(
        { _id: req.params.id },
        { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
      ).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

exports.dashboardDeleteNote = async (req, res) => {
try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
} catch (error) {
    console.log(error);
}
};

exports.dashboardAddNote = async (req, res) => {
    res.render("dashboard/add", {
      layout: "../views/layouts/dashboard",
    });
  };

exports.dashboardAddNoteSubmit = async (req, res) => {
try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
} catch (error) {
    console.log(error);
}
};
  
exports.dashboardSearchSubmit = async (req, res) => {
try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
    $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
    ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
    searchResults,
    layout: "../views/layouts/dashboard",
    });
} catch (error) {
    console.log(error);
}
};