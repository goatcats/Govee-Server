const http = require("http");
const Govee = require("node-govee-led");

const device = new Govee({
    apiKey: "614f41d4-204d-404c-980a-9ae395653d1a",
    mac: "D0:E2:C4:39:32:35:30:49",
    model: "H6061",
});

let lightsChanged = false;
let colorbool = true;

async function turnRed() {
    await device.turnOn()
    await device.setBrightness(50);
    await device.setColor("#ff0000");
}

async function callTheChild(device) {
    for (let i = 0; i < 6; i++) {
        await delay(1500);
        if (!colorbool) {
            await device.setColor("#0000ff");
        } else {
            await device.setColor("#ff0000");
        }
        colorbool = !colorbool;
        console.log(i, colorbool);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const server = http.createServer((req, res) => {
    if (req.url === "/run" && req.method === "GET") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        turnRed()
            .then(async () => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("Success!");
                lightsChanged = true;
                await callTheChild(device);
                lightsChanged = false;
            })
            .catch((error) => {
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain");
                res.end("Error changing color!");
            });
    } else if (req.url === "/check" && req.method === "GET") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (lightsChanged) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("changed");
        } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("pending");
        }
    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not found");
    }
});

const PORT = process.env.PORT || 3500;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
