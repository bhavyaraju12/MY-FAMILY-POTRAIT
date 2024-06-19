const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
const url = "https://nbkplmfperjtegugcwzz.supabase.co";
const database = supabase.createClient(url, key);

console.log(database);

const form_submit = document.getElementById("form_submit");

form_submit.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    // Check if all fields are filled
    if (!firstname || !lastname || !email || !password || !confirmpassword) {
        alert("All fields must be filled out!");
        return; // Stop form submission
    }

    // Check if passwords match
    if (password !== confirmpassword) {
        alert("Passwords do not match!");
        return; // Stop form submission
    }

    try {
        const { data, error } = await database
            .from('users')
            .insert([
                { firstname, lastname, email, password }
            ]);

        if (error) {
            throw error;
        }

        console.log(data);
        alert("User registered successfully!");
        form_submit.reset();
    } catch (error) {
        console.error("Error inserting data:", error);
        alert("There was an error submitting your form. Please try again.");
    }
});