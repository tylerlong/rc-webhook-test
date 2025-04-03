import RingCentral from "@rc-ex/core";
import DebugExtension from "@rc-ex/debug";

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });

  const debugExtension = new DebugExtension();
  await rc.installExtension(debugExtension as any);

  const r = await rc
    .restapi()
    .subscription()
    .post({
      eventFilters: ["/restapi/v1.0/account/~/telephony/sessions"],
      deliveryMode: {
        transportType: "WebHook",
        address: process.env.WEBHOOK_URL,
      },
      expiresIn: 600,
    });
  console.log(JSON.stringify(r, null, 2));
};

main();
