const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
const url = "https://nbkplmfperjtegugcwzz.supabase.co";
const database = supabase.createClient(url, key);

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('form_submit');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert("All fields must be filled out!");
            return;
        }

        try {
            let { data, error } = await database
                .from('users')
                .select()
                .eq('email', email)
                .single();

            if (error) {
                console.error("Error checking users table:", error);
            }

            if (data && data.password === password) {
                if (data.role === 'admin') {
                    alert("Login successful!");
                    window.location.href = "admin.html";
                    return;
                } else {
                    alert("Login successful!");
                    window.location.href = "db/d2.html";
                    return;
                }
            }

            ({ data, error } = await database
                .from('doctors')
                .select()
                .eq('email', email)
                .single());

            if (error) {
                throw error;
            }

            if (data && data.password === password) {
                alert("Login successful!");
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
