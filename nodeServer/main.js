const Govee = require("node-govee-led");
const strips = new Govee({
    apiKey: "614f41d4-204d-404c-980a-9ae395653d1a",
    mac: "25:D2:A4:C1:38:70:1A:FB",
    model: "H6144"
})
const panels = new Govee({
    apiKey: "614f41d4-204d-404c-980a-9ae395653d1a",
    mac: "D0:E2:C4:39:32:35:30:49",
    model: "H6061"
})
// client.getDevices().then(data => console.log(data));
let myDevices = [strips, panels];
async function callTheChild(devices) {
    for (let i=0; i<devices.length; i++) {
        const device = devices[i];
        await device.turnOn();
        await device.setBrightness(50);
        await device.setColor("#ff0000");
    }
}
callTheChild(myDevices);