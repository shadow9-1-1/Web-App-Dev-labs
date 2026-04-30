const express = require("express");
const { createClient } = require("redis");

const app = express();
const port = process.env.PORT || 3000;
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

let dataSource = {
  message: "Slow data response",
  version: 1
};

const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Lab 9 app server is running.");
});

app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/cache-test", async (req, res) => {
  try {
    await connectRedis();
    await redisClient.set("lab9:status", "connected", { EX: 30 });
    const value = await redisClient.get("lab9:status");
    res.json({ redis: value });
  } catch (error) {
    res.status(500).json({ error: "Redis connection failed." });
  }
});

app.get("/data", async (req, res) => {
  const start = Date.now();
  const cacheKey = "lab9:data";
  const forceSlow = req.query.force === "1";

  try {
    await connectRedis();

    if (!forceSlow) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        res.set("X-Cache", "HIT");
        res.set("X-Server-Time-ms", String(Date.now() - start));
        return res.json({ source: "cache", data: JSON.parse(cached) });
      }
    }

    res.set("X-Cache", "MISS");
    await sleep(2000);
    const payload = {
      message: dataSource.message,
      version: dataSource.version,
      generatedAt: new Date().toISOString()
    };

    await redisClient.set(cacheKey, JSON.stringify(payload), { EX: 60 });
    res.set("X-Server-Time-ms", String(Date.now() - start));
    return res.json({ source: "fresh", data: payload });
  } catch (error) {
    return res.status(500).json({ error: "Data request failed." });
  }
});

app.delete("/data-cache", async (req, res) => {
  const cacheKey = "lab9:data";

  try {
    await connectRedis();
    const removed = await redisClient.del(cacheKey);
    return res.json({ cacheKey, removed });
  } catch (error) {
    return res.status(500).json({ error: "Cache delete failed." });
  }
});

app.post("/data", async (req, res) => {
  const { message } = req.body || {};
  const cacheKey = "lab9:data";

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    dataSource = {
      message,
      version: dataSource.version + 1
    };

    await connectRedis();
    await redisClient.del(cacheKey);
    return res.json({ data: dataSource, cacheCleared: true });
  } catch (error) {
    return res.status(500).json({ error: "Data update failed." });
  }
});

app.post("/publish", async (req, res) => {
  const channel = req.body?.channel || "lab9:updates";
  const message = req.body?.message || "Hello from Lab 9";

  try {
    await connectRedis();
    const receivers = await redisClient.publish(channel, message);
    return res.json({ channel, message, receivers });
  } catch (error) {
    return res.status(500).json({ error: "Publish failed." });
  }
});

app.post("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const userKey = `lab9:user:${userId}`;

  try {
    await connectRedis();
    await redisClient.hSet(userKey, req.body);
    const user = await redisClient.hGetAll(userKey);
    return res.json({ userId, user });
  } catch (error) {
    return res.status(500).json({ error: "User hash set failed." });
  }
});

app.patch("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const userKey = `lab9:user:${userId}`;
  const { field, value } = req.body || {};

  if (!field) {
    return res.status(400).json({ error: "Field is required." });
  }

  try {
    await connectRedis();
    await redisClient.hSet(userKey, field, value ?? "");
    const updated = await redisClient.hGet(userKey, field);
    return res.json({ userId, field, value: updated });
  } catch (error) {
    return res.status(500).json({ error: "User hash update failed." });
  }
});

app.get("/users/:id/field/:field", async (req, res) => {
  const userId = req.params.id;
  const field = req.params.field;
  const userKey = `lab9:user:${userId}`;

  try {
    await connectRedis();
    const value = await redisClient.hGet(userKey, field);
    return res.json({ userId, field, value });
  } catch (error) {
    return res.status(500).json({ error: "User hash lookup failed." });
  }
});

app.listen(port, () => {
  console.log(`App server listening on port ${port}`);
});
