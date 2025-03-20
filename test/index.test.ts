import { PrimusPageCoreTLS} from '../src/index';


describe('test', () => {
    jest.setTimeout(50000);
    // production
    const appId = "0xe319e567f70e2b2a153cb6ceaa73893648cde180";
    const appSecret = "0x4348563b2178adc171d851bcc27054d7879e07a41263ccfaa3b00d63d056559a";
    // test
    // const appId = "0x899dd126268e3010beaa1ac141a2a0aa98deba09";
    // const appSecret = "0x7da5d1cd2fdd494aa1176031151a6202734e30ddb14fd01dc3376616408ee0a7";
    it('generate', async () => {
        console.log('--------------process.env', process.env.NODE_ENV)
        try {
            // 1.
            const zkTLS = new PrimusPageCoreTLS();
            const result = await zkTLS.init(appId, appSecret);
            console.log("init result=", result);
            
            let request ={
                url: "https://www.okx.com/api/v5/public/instruments?instType=SPOT&instId=BTC-USD",
                method: "GET",
                header: {},
                body: ""
            };
            const responseResolves = [
                {
                    keyName: 'instType',
                    parsePath: '$.data[0].instType',
                    parseType: 'string'
                }
            ];
            // Generate attestation request.
            const generateRequest = zkTLS.generateRequestParams(request, responseResolves);
            // Set zkTLS mode, default is proxy model. (This is optional)
            generateRequest.setAttMode({
                algorithmType: "proxytls",
                resultType: "plain"
            });

            // Transfer request object to string.
            const generateRequestStr = generateRequest.toJsonString();

            // Sign request.
            const signedRequestStr = await zkTLS.sign(generateRequestStr);

            // For Production Example: Get signed resopnse from backend.
            // const response = await fetch(`http://localhost:9000/primus/sign?signParams=${encodeURIComponent(generateRequestStr)}`);
            // const responseJson = await response.json();
            // const signedRequestStr = responseJson.signResult;

            // Start attestation process.
            const attestation = await zkTLS.startAttestation(signedRequestStr);
            console.log("attestation=", attestation);

            const verifyResult = zkTLS.verifyAttestation(attestation);
            console.log("verifyResult=", verifyResult);
            if (verifyResult === true) {
                // Business logic checks, such as attestation content and timestamp checks
                // do your own business logic.
            } else {
                // If failed, define your own logic.
            }
        } catch (e) {
            console.log('-----------generate error =',  e);
        }
        
    });
  
});
