const env = require('dotenv');

const fetch = require('node-fetch');

const Article = require('../models/article');
const githubUrl = 'https://api.github.com/users/AndrewJBateman';

// Display articles list in date order
exports.article_list = async (req, res) => {
	try {
		const articles = await Article.find().sort({ createdAt: 'desc' });
		const totalArticles = articles.length;
		const articlesString = articles.length === 1 ? ' article' : ' articles';
		res.render('articles/index', {
			articles,
			totalArticles,
			articlesString,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Display new article
exports.new_article = async (req, res) => {
	try {
		res.render('articles/new', { article: new Article() });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Find article to edit
exports.find_to_edit = async (req, res) => {
	try {
		const article = await Article.findById(req.params.id);
		res.render('articles/edit', { article: article });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Find article to display
exports.find_to_show = async (req, res) => {
	try {
		const article = await Article.findOne({ slug: req.params.slug });
		if (article == null) res.redirect('/');
		res.render('articles/display_all', { article: article });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Presave new article
exports.presave_new_article = async (req, res, next) => {
	try {
		req.article = new Article();
		next();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Presave edited article
exports.presave_edited_article = async (req, res, next) => {
	try {
		req.article = await Article.findById(req.params.id);
		next();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Delete article
exports.delete_article = async (req, res) => {
	try {
		await Article.findByIdAndDelete(req.params.id);
		res.redirect('/');
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Fetch Github profile info to show in Contact page
exports.fetch_github_profile = async (req, res) => {
	try {
		const response = await fetch(githubUrl);
		const user = await response.json();
		console.log('user: ', user);
		res.render('articles/contact', { user })
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
