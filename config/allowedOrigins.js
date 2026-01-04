const allowedOrigins =
	process.env.NODE_ENV === "production"
		? ["https://romerolibrary.onrender.com"]
		: ["http://localhost:5173", "http://localhost:3000"];

module.exports = allowedOrigins;
