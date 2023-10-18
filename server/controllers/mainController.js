exports.homepage = async (req,res) => {
    res.render('index',{layout: '../views/layouts/front-page'});
}

exports.about = async (req,res) => {
    res.render('about');
}