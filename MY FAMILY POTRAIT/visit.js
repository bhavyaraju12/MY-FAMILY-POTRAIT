const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
const url = "https://nbkplmfperjtegugcwzz.supabase.co";
const database = supabase.createClient(url, key);

console.log(database);

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: users, error } = await database
            .from('doctors')
            .select('d_id, firstname, lastname, spec,l_no');

        if (error) {
            throw error;
        }

        const doctorsTable = document.getElementById('doctorsTable');
        doctorsTable.innerHTML = '';
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            const dashboardLink = `http://127.0.0.1:5500/dashboard.html${doctor.d_id}`;
            row.innerHTML = `
                <td class="py-2 px-8 border-b">${doctor.firstname} ${doctor.lastname}</td>
                <td class="py-2 px-8 border-b">${doctor.email}</td>
                <td class="py-2 px-4 border-b"><a href="${dashboardLink}" class="text-blue-500 underline">Dashboard</a></td>
        
            `;
             doctorsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching users:', error.message);
    }
});



