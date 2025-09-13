export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "Missing code" }, { status: 400 });
  }

  // Replace with your actual client ID, secret, and redirect URI
  const client_id = process.env.ZOHO_CLIENT_ID;
  const client_secret = process.env.ZOHO_CLIENT_SECRET;
  const redirect_uri = "https://jtutorlink.vercel.app/api/oauthredirect";

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id,
    client_secret,
    redirect_uri,
    code,
  });

  try {
    const tokenRes = await fetch("https://accounts.zoho.com/oauth/v2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return Response.json({ error: "Failed to get token", details: tokenData }, { status: 500 });
    }

    // For demo: Show the token in the browser (DO NOT DO THIS IN PRODUCTION)
    // In production, store the token securely (e.g., in a DB or encrypted store)
    return Response.json(tokenData);
  } catch (err) {
    return Response.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}