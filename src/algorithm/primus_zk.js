// load wasm module
Module = {};
Module_callAlgorithm = null;
Module.onRuntimeInitialized = async () => {
  console.log("Module onRuntimeInitialized");
  Module_callAlgorithm = Module.cwrap('callAlgorithm', 'string', ['string']);
};

// // support websocket
// global.WebSocket = require('ws');

// // load wasm module
// Module_callAlgorithm = null;
// const Module = require("./client_plugin.js");
// Module.onRuntimeInitialized = async () => {
//   Module_callAlgorithm = Module.cwrap('callAlgorithm', 'string', ['string']);
// }

const callAlgorithm = async (params) => {
  console.log("callAlgorithm111 params=", params, Module_callAlgorithm);
  if (!Module_callAlgorithm) {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log("callAlgorithm222 params=", params, Module_callAlgorithm);
  return Module_callAlgorithm(params);
};

exports.init = async () => {
  const params = `{"method":"init","version":"1.1.1","params":{}}`;
  const result = await callAlgorithm(params);
  return JSON.parse(result);
};

exports.getAttestation = async (paramsObj) => {
  const _paramsObj = { method: "getAttestation", version: "1.1.1", params: paramsObj };
  const params = JSON.stringify(_paramsObj);
  const result = await callAlgorithm(params);
  return JSON.parse(result);
};

exports.getAttestationResult = async (timeout = 2 * 60 * 1000) => {
  const params = `{"method":"getAttestationResult","version":"1.1.1","params":{"requestid":"1"}}`;

  return new Promise((resolve, reject) => {
    const start = performance.now();
    const tick = async () => {
      const timeGap = performance.now() - start;
      let resObj = null;
      try {
        const res = await callAlgorithm(params);
        resObj = JSON.parse(res);
      } catch (err) {
      }

      if (resObj && (resObj.retcode == "0" || resObj.retcode == "2")) {
        resolve(resObj);
      } else if (timeGap > timeout) {
        reject({
          code: 'timeout',
          data: resObj
        });
      } else {
        setTimeout(tick, 1000);
      }
    };
    tick();
  });
}

exports.startOffline = async (paramsObj) => {
  const _paramsObj = { method: "startOffline", version: "1.1.1", params: paramsObj };
  const params = JSON.stringify(_paramsObj);
  const result = await callAlgorithm(params);
  return JSON.parse(result);
};
