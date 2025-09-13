// Proxy route for fetching tutors from external API to bypass CORS
export async function GET(req) {
  // Accept access_token and api_domain as query parameters for dynamic token usage
  const { searchParams } = new URL(req.url);
  const access_token = searchParams.get("access_token") || process.env.ZOHO_API_TOKEN || "1000.8a3d73eb872b933a1ae817f3224da1e9.30315d7ee90c3156c165f1aaa3991460";
  const api_domain = searchParams.get("api_domain") || "https://www.zohoapis.com";
  if (!api_domain) {
    return new Response(JSON.stringify({ error: "Missing api_domain. Pass as query param or set ZOHO_API_DOMAIN in .env from the api_domain in your Zoho OAuth token response." }), { status: 500 });
  }
  const zohoUrl = `${api_domain}/people/api/v1/employee`;
  try {
    const res = await fetch(zohoUrl, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
        Accept: "application/json"
      }
    });
    if (res.status === 401) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Check your Zoho OAuth token." }),
        { status: 401 }
      );
    }
    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: "Failed to fetch courses from Zoho", details: errText }), { status: 500 });
    }
    const data = await res.json();
    // Transform Zoho results to a tutor/course-like structure for the frontend
    const tutors = (data.employees || []).map((emp, idx) => ({
    _id: emp.employeeId || `zoho-employee-${idx}`,
    name: emp.firstName + ' ' + emp.lastName,
    subjects: [emp.department || 'General'],
    email: emp.email || 'N/A',
    phone: emp.mobileNumber || '',
    experience: emp.designation || 'N/A',
    description: emp.role || '',
    }));

    return new Response(JSON.stringify({ data: tutors }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", details: err?.message || String(err) }), { status: 500 });
  }
}
