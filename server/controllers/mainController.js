/**
 * GET /
 * Homepage
*/
exports.homepage = async (req, res) => {
  const locals = {
    title: "Notes App - Organize Your Thoughts",
    description: "Free NodeJS Notes App with beautiful design and powerful features.",
  }
  res.render('index', {
    locals,
    layout: '../views/layouts/front-page'
  });
}


/**
 * GET /about
 * About
*/
exports.about = async (req, res) => {
  const locals = {
    title: "About - Notes App",
    description: "Learn more about Notes App.",
  }
  res.render('about', locals);
}

/**
 * GET /features
 * Features page
*/
exports.features = async (req, res) => {
  const locals = {
    title: "Features - Notes App",
    description: "Discover all the amazing features of Notes App.",
  }
  res.render('features', locals);
}

/**
 * GET /faqs
 * FAQs page
*/
exports.faqs = async (req, res) => {
  const locals = {
    title: "FAQs - Notes App",
    description: "Frequently asked questions about Notes App.",
  }
  res.render('faqs', locals);
}