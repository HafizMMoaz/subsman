import aj from "../config/arcjet.js";
import { ARCJET_ENV } from "../config/env.js";

const arcjetMiddleware = async (req, res, next) => {
    try {

        const userAgent = req.headers['user-agent'] || "";
        const isDev = ARCJET_ENV !== 'production';
        const isPostman = userAgent.includes("PostmanRuntime");

        if (isDev && isPostman) {
            console.log("Bypassing Arcjet for Postman in development");
            return next();
        }

        for (const { reason } of decision.results) {
            if (reason.isError()) {
                console.warn("Arcjet error", reason.message);
                res.writeHead(503, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Service unavailable" }));
                return;
            }
        }

        const decision = await aj.protect(req, { requested: 1 });
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) return res.status(429).json({ error: "Rate limit exceeded" });

            if (decision.reason.isBot()) return res.status(403).json({ error: "BOT Detected" });

            return res.status(403).json({ error: "Access denied" });
        }

        next();
    }
    catch (error) {
        console.error("ArcJet middleware error:", error);
        next(error);
    }
} 

export default arcjetMiddleware;