const redis = require("redis");

const keys = require("./keys");

const fib = (num) => {
    if (num == 1) {
        return 0
    } else if (num == 2) {
        return 1
    } else {
        return fib(num - 1) + fib(num - 2)
    }
}

const client = redis.createClient({
    port: keys.REDIS_PORT,
    host: keys.REDIS_HOST
});

const subscriber = client.duplicate();
client.on("error", (err) => {
    console.error(`Error with Redis: ${err}`)
})

subscriber.on("message", (_, value) => {
    client.hset("values", value, fib(value))
})

subscriber.subscribe("insert")