import RingCentral from '@rc-ex/core';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  rc.token = {access_token: process.env.RINGCENTRAL_TOKEN};
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });

  // Create sub
  const r = await rc
    .restapi()
    .subscription()
    .post({
      eventFilters: ['/restapi/v1.0/account/~/telephony/sessions'],
      deliveryMode: {
        transportType: 'WebHook',
        address: 'https://4bb1-67-188-100-185.ngrok.io/webhook',
      },
      expiresIn: 1800,
    });
  console.log(r.id);

  // // Delete sub
  // await rc
  //   .restapi()
  //   .subscription('61ef4105-29bc-4101-8f53-1f881d79676e')
  //   .delete();

  // // trigger notification
  // const extensionId = (await rc.restapi().account().extension().get())
  //   .id as unknown as string;
  // await rc
  //   .restapi()
  //   .account()
  //   .extension()
  //   .companyPager()
  //   .post({from: {extensionId}, to: [{extensionId}], text: 'Hello world'});

  await rc.revoke();
};

main();
