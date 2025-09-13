// Proxy route for fetching tutors from external API to bypass CORS
export async function GET(req) {
  // Fetch courses from Zoho People API with authentication
  const zohoUrl = "https://people.zoho.com/api/v1/courses";
  const ZOHO_API_TOKEN = process.env.ZOHO_API_TOKEN || "1000.e9579a940f95a9acb9f1dc7deddac0d6.83ab4880230fcc949ed270a3c1b22f04";
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
    const tutors = (data.courses || []).map((course, idx) => ({
      _id: course.course_id || `zoho-course-${idx}`,
      name: course.course_name || course.name || `Course ${idx+1}`,
      subjects: [course.category || 'General'],
      email: course.instructor_email || 'N/A',
      phone: '',
      experience: course.duration || 'N/A',
      course_url: course.course_url || '',
      description: course.description || '',
    }));
    return new Response(JSON.stringify({ data: tutors }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", details: err?.message || String(err) }), { status: 500 });
  }
}
