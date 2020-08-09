const express = require('express');
const { Pool } = require('pg');
const redis = require("redis");
const cors = require('cors')

const keys = require("./keys");

/******************************/
/********** POSTGRES **********/
/******************************/
const pool = new Pool({
    user: keys.POSTGRES_USER,
    host: keys.POSTGRES_HOST,
    database: keys.POSTGRES_DB,
    password: keys.POSTGRES_PASSWORD,
    port: keys.POSTGRES_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error(
            `Error acquiring PG DB (${keys.POSTGRES_DB}): ${err.stack}`
        )
    }
    else {
        const query = `CREATE TABLE IF NOT EXISTS values (
            number int
        )`;
        client.query(query, (err, res) => {
            release();
            if (err) {
                console.error(`Error creating PG table: ${err.stack}`)
            } else {
                console.log("Table values successfully created in PG")
            }
        })
    }
});

/***************************/
/********** REDIS **********/
/***************************/
const client = redis.createClient({
    port: keys.REDIS_PORT,
    host: keys.REDIS_HOST
});
const publisher = client.duplicate();
client.on("error", (err) => {
    console.error(`Error with Redis: ${err}`)
})

/*****************************/
/********** EXPRESS **********/
/*****************************/
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const port = 5000

app.get('/', (req, res) => {
    res.status(200).send('Express API Health Checkup successful!')
})

app.get("/values/current", (req, res) => {
    const query = `SELECT * FROM values`;
    pool.query(query, (err, values) => {
        if (err) {
            console.error(`Error retrieving values from PG table: ${err.stack}`)
        } else {
            res.status(200).json(values.rows.map(
                value => value.number
            ));
        }
    })
})

app.get("/values/all", (req, res) => {
    client.hgetall('values', (err, values) => {
        if (err) {
            console.error(`Unable to retrieve values from Redis: ${err}`)
        } else {
            res.status(200).json(values);
        }
    })
})

app.post("/values", (req, res) => {
    const { value } = req.body;
    pool.connect((err, client, release) => {
        if (err) {
            console.error(
                `Error acquiring PG DB (${keys.POSTGRES_DB}): ${err.stack}`
            )
            res.status(500).send();
        }
        else {
            const query = `INSERT INTO values (number)
                VALUES (${value})
            `;
            client.query(query, (err, _) => {
                release();
                if (err) {
                    console.error(`Error inserting into PG table: ${err.stack}`)
                    res.status(500).send();
                } else {
                    console.log("Value successfully added in PG table")
                    res.status(201).send()
                }
            })
        }
    });

    client.hset('values', value, 'NA', (err, rep) => {
        if (err) {
            console.log('Error inserting value into Redis')
        } else {
            publisher.publish('insert', value)
        }
    })

})

app.listen(port, () => {
    console.log(`Listening at PORT: ${port}`)
})