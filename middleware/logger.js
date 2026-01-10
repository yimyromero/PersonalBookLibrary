const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { stat } = require("node:fs");

const LOG_DIR = path.join(__dirname, "..", "logs");
const MAX_LOG_SIZE = 5 * 1024 * 1024;

const logEvents = async (MessageChannel, logFileName) => {
	const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
	const logItem = `${dateTime}\t${uuid()}\t${MessageChannel}\n`;
	const logFilePath = path.join(LOG_DIR, logFileName);

	try {
		if (!fs.existsSync(LOG_DIR)) {
			await fsPromises.mkdir(LOG_DIR);
		}

		let shouldOverwrite = false;

		if (fs.existsSync(logFilePath)) {
			const { size } = await fsPromises.stat(logFilePath);
			if (size > MAX_LOG_SIZE) {
				shouldOverwrite = true;
			}
		}

		if (shouldOverwrite) {
			await fsPromises.writeFile(logFilePath, logItem);
		} else {
			await fsPromises.appendFile(logFilePath, logItem);
		}
	} catch (err) {
		console.log(err);
	}
};

const logger = (req, res, next) => {
	logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
	console.log(`${req.method} ${req.path}`);
	next();
};

module.exports = { logEvents, logger };
