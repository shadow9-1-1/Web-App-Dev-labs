const { createClient } = require("redis");

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;
const channel = process.argv[2] || "lab9:updates";

const subscriber = createClient({
  url: `redis://${redisHost}:${redisPort}`
});

subscriber.on("error", (err) => {
  console.error("Redis subscriber error:", err);
});

async function start() {
  await subscriber.connect();
  console.log(`Listening on channel: ${channel}`);

  await subscriber.subscribe(channel, (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
  });
}

start().catch((error) => {
  console.error("Listener failed:", error);
});
