const http = require("http");
const Govee = require("node-govee-led");

const strips = new Govee({
    apiKey: "614f41d4-204d-404c-980a-9ae395653d1a",
    mac: "25:D2:A4:C1:38:70:1A:FB",
    model: "H6144",
});
const panels = new Govee({
    apiKey: "614f41d4-204d-404c-980a-9ae395653d1a",
    mac: "D0:E2:C4:39:32:35:30:49",
    model: "H6061",
});

let myDevices = [strips, panels];
let lightsChanged = false;

async function callTheChild(devices) {
    for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        await device.turnOn();
        await device.setBrightness(50);
        await device.setColor("#ff0000");
    }
}

const server = http.createServer((req, res) => {
    if (req.url === "/run" && req.method === "GET") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        callTheChild(myDevices)
            .then(() => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("Success!");
                lightsChanged = true;
            })
            .catch((error) => {
                console.error(error);
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
        setTimeout(() => {
            lightsChanged = false;
        }, 10000);
    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not found");
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
