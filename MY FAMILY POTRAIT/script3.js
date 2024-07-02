const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
const url = "https://nbkplmfperjtegugcwzz.supabase.co";
const database = supabase.createClient(url, key);

console.log(database);
async function loadAboutContent() {
    const aboutSection = document.getElementById('about');
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) {
        aboutSection.innerHTML = '<p class="text-center text-red-500">No doctor logged in.</p>';
        return;
    }

    try {
        const { data: doctor, error } = await database
            .from('doctors')
            .select('d_id, firstname, lastname, email, yoe, spec, l_no')
            .eq('d_id', doctorId)
            .single();

        if (error) {
            throw error;
        }

        aboutSection.innerHTML = `
            <div class="w-2/3 h-screen mx-auto p-20 bg-white shadow rounded-md">
                <h1 class="text-2xl font-bold text-center color-green mb-28">About Dr. ${doctor.firstname} ${doctor.lastname}</h1>
                <div class="flex items-center justify-center mb-24">
                    <label for="photo" class="profile-pic bg-gray-200">
                        <img id="preview" src="#" alt="Doctor's Photo">
                        <input type="file" id="photo" name="photo" accept="image/*" class="hidden">
                    </label>
                </div>
                <div class="doctor-info">
                    <p><strong>Name :</strong> Dr. ${doctor.firstname} ${doctor.lastname}</p>
                    <p><strong>Email :</strong> ${doctor.email}</p>
                    <p><strong>Years of Experience:</strong> ${doctor.yoe}</p>
                    <p><strong>Specialization :</strong> ${doctor.spec}</p>
                    <p><strong>License Number :</strong> ${doctor.l_no}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching doctor information:', error.message);
        aboutSection.innerHTML = <p class="text-center text-red-500">Error fetching doctor information: ${error.message}</p>;
    }
}

document.addEventListener('DOMContentLoaded', loadAboutContent);


document.addEventListener('DOMContentLoaded', () => {
    showSection('about');
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: users, error } = await database
            .from('users')
            .select('userid, firstname, lastname, email');

        if (error) {
            throw error;
        }

        const usersTable = document.getElementById('usersTable');
        usersTable.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            const dashboardLink = http://127.0.0.1:5500/dashboard.html${user.userid};
            row.innerHTML = `
                <td class="py-2 px-8 border-b">${user.firstname} ${user.lastname}</td>
                <td class="py-2 px-8 border-b">${user.email}</td>
                <td class="py-2 px-4 border-b"><a href="${dashboardLink}" class="text-blue-500 underline">Dashboard</a></td>
        
            `;
             usersTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching users:', error.message);
    }
});