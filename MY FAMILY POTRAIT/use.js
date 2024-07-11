const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
const url = "https://nbkplmfperjtegugcwzz.supabase.co";
const database = supabase.createClient(url, key);

console.log(database);

// Function to fetch and display user ID
async function fetchUserId() {
    const userIdElement = document.getElementById('userId');
    
    try {
        const { data, error } = await database
            .from('users') 
            .select('id')
            .limit(1);

        if (error) {
            console.error('Error fetching user ID:', error);
            userIdElement.textContent = 'Error fetching user ID';
            return;
        }

        if (data.length > 0) {
            const userId = data[0].id;
            userIdElement.textContent = `User ID: ${userId}`;
        } else {
            userIdElement.textContent = 'No users found';
        }
    } catch (error) {
        console.error('Error:', error);
        userIdElement.textContent = 'An error occurred';
    }
}