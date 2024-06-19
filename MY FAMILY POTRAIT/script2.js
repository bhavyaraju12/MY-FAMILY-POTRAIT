const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
const url = "https://nbkplmfperjtegugcwzz.supabase.co";
const database = supabase.createClient(url, key);

console.log(database);

const login_submit = document.getElementById("form_submit");

form_submit.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if all fields are filled
    if (!email || !password) {
        alert("All fields must be filled out!");
        return; // Stop form submission
    }

    try {
        const { data, error } = await database
            .from('users')
            .select()
            .eq('email', email)
            .single();

        if (error) {
            throw error;
        }

        if (data && data.password === password) {
            alert("Login successful!");
            // Redirect to the dashboard or another page
            window.location.href = "db/d2.html";
        } else {
            alert("Invalid email or password.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("There was an error logging in. Please try again.");
    }
});