import { TuyaContext } from "@tuya/tuya-connector-nodejs";

// const context = new TuyaContext({
//   baseUrl: 'https://openapi.tuyaus.com',
//   accessKey: 'twx4sv975qurka4nndjw',
//   secretKey: '0436021dc204453dbddc178eed3e2054',
// });


// const device_id = "ebe5bf39812459df76zyfe";
const devicedetail = await context.deviceStatus.status({
  device_id: device_id,
});
if(!devicedetail.success) {
  new Error();
}

console.log("Device details:",JSON.stringify(devicedetail));
