const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
const url = "https://nbkplmfperjtegugcwzz.supabase.co";
const database = supabase.createClient(url, key);

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("form_submit");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("All fields must be filled out!");
      return;
    }

    try {
      let { data: userData, error: userError } = await database
        .from("users")
        .select()
        .eq("email", email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error("Error checking users table:", userError);
        alert("Error checking users table.");
        return;
      }

      if (userData && userData.password === password) {
        alert("Login successful!");
        localStorage.setItem("userID",userData.userid)
        const redirectUrl = userData.role === "admin" ? "admin.html" : "db/d2.html";
        window.location.href = redirectUrl;
        return;
      }

      let { data: doctorData, error: doctorError } = await database
        .from("doctors")
        .select()
        .eq("email", email)
        .single();

      if (doctorError && doctorError.code !== 'PGRST116') {
        console.error("Error checking doctors table:", doctorError);
        alert("Error checking doctors table.");
        return;
      }

      if (doctorData && doctorData.password === password) {
        alert("Login successful!");
        localStorage.setItem("doctorId", doctorData.d_id);
        window.location.href = "dbdoc.html";
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("There was an error logging in. Please try again.");
    }
  });
});
