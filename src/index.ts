import RingCentral from '@rc-ex/core';
import PubNubExtension from '@rc-ex/pubnub';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  rc.token = {access_token: process.env.RINGCENTRAL_TOKEN};
  console.log(rc.token?.access_token);
  const extInfo = await rc.restapi().account().extension().get();
  console.log(JSON.stringify(extInfo, null, 2));

  const pubNubExtension = new PubNubExtension();
  await rc.installExtension(pubNubExtension);
  const subInfo = await pubNubExtension.subscribe(
    [
      '/restapi/v1.0/account/~/telephony/sessions?direction=Inbound&missedCall=true',
    ],
    event => {
      console.log(JSON.stringify(event, null, 2));
    }
  );
  console.log(JSON.stringify(subInfo._subscriptionInfo, null, 2));
};

main();
