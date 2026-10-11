import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const secret = Deno.env.get("SEND_SMS_HOOK_SECRET");
  const apiKey = Deno.env.get("TEXTLOCALS_API_KEY");
  const sender = Deno.env.get("TEXTLOCALS_SENDER_ID");
  const templateId = Deno.env.get("TEXTLOCALS_DLT_TEMPLATE_ID");

  if (!secret || !apiKey || !sender || !templateId) {
    console.error("SMS configuration is incomplete");
    return json({ error: "SMS service unavailable" }, 503);
  }

  let event: {
    user?: { phone?: string };
    sms?: { otp?: string };
  };

  try {
    const rawBody = await req.text();
    const signingKey = secret.replace(/^v1,whsec_/, "");
    const webhook = new Webhook(signingKey);
    event = webhook.verify(
      rawBody,
      Object.fromEntries(req.headers),
    ) as typeof event;
  } catch {
    return json({ error: "Invalid webhook signature" }, 401);
  }

  const phone = event.user?.phone ?? "";
  const otp = event.sms?.otp ?? "";

  if (!/^\+91[6-9]\d{9}$/.test(phone) || !/^\d{6}$/.test(otp)) {
    return json({ error: "Invalid SMS request" }, 400);
  }

  const message =
    `Your Jeevan Sutra verification code is ${otp}. ` +
    `Valid for 30 seconds. Do not share this code with anyone.`;

  const params = new URLSearchParams({
    key: apiKey,
    campaign: "0",
    routeid: "13",
    type: "text",
    contacts: phone.slice(3),
    senderid: sender,
    msg: message,
    template_id: templateId,
  });

  try {
    const response = await fetch(
      "https://sms.textlocals.in/app/smsapi/index.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        signal: AbortSignal.timeout(8000),
      },
    );

    const result = (await response.text()).trim();

    if (!response.ok || !result.startsWith("SMS-SHOOT-ID")) {
      console.error("SMS provider rejected the request", {
        status: response.status,
      });
      return json({ error: "SMS delivery request failed" }, 502);
    }

    return json({});
  } catch {
    console.error("SMS provider request failed");
    return json({ error: "SMS service unavailable" }, 502);
  }
});