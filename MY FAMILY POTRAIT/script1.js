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
    const role = document.querySelector('input[name="role"]:checked').value;

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
        if (role === "patient") {
            const { data, error } = await database
                .from('users')
                .insert([
                    { firstname, lastname, email, password }
                ]);

            if (error) {
                throw error;
            }

            console.log(data);
            alert("Patient registered successfully!");
        } else if (role === "doctor") {
            const yoe = document.getElementById("yoe").value;
            const spec = document.getElementById("spec").value;
            const l_no = document.getElementById("l_no").value;

            // Check if doctor-specific fields are filled
            if (!yoe || !spec || !l_no) {
                alert("All doctor fields must be filled out!");
                return; // Stop form submission
            }

            const { data, error } = await database
                .from('doctors')
                .insert([
                    { firstname, lastname, email, password, yoe, spec, l_no }
                ]);

            if (error) {
                throw error;
            }

            console.log(data);
            alert("Doctor registered successfully!");
        }

        form_submit.reset();
    } catch (error) {
        console.error("Error inserting data:", error);
        alert("An error occurred while registering. Please try again.");
    }
});