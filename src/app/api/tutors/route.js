// Proxy route for fetching tutors from external API to bypass CORS
export async function GET(req) {
  // Fetch courses from Zoho People API with authentication
  // Use the Zoho People api_domain from environment variable (set this from your OAuth token response)
  const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN; // e.g., https://people.zoho.com
  const ZOHO_API_TOKEN = process.env.ZOHO_API_TOKEN || "1000.d970a93e0cd4d450c9984c45fa7ff936.1ace73ac23eea47495c18bad10e85a96";
  if (!ZOHO_API_DOMAIN) {
    return new Response(JSON.stringify({ error: "Missing ZOHO_API_DOMAIN. Set this in your .env from the api_domain in your Zoho OAuth token response." }), { status: 500 });
  }
  const zohoUrl = `${ZOHO_API_DOMAIN}/people/api/v1/employee`;
  try {
    const res = await fetch(zohoUrl, {
      headers: {
        Authorization: `Zoho-oauthtoken ${ZOHO_API_TOKEN}`,
        Accept: "application/json"
      }
    });
    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: "Failed to fetch courses from Zoho", details: errText }), { status: 500 });
    }
    const data = await res.json();
    // Transform Zoho results to a tutor/course-like structure for the frontend
    const tutors = (data.data || []).map((emp, idx) => ({
      _id: emp.EmployeeID || `zoho-employee-${idx}`,
      name: emp.FirstName + ' ' + emp.LastName,
      subjects: [emp.Department || 'General'],
      email: emp.EmailID || 'N/A',
      phone: emp.Mobile || '',
      experience: emp.Designation || 'N/A',
      course_url: '', // Not available for employees
      description: emp.Role || '',
    }));
    return new Response(JSON.stringify({ data: tutors }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", details: err?.message || String(err) }), { status: 500 });
  }
}
