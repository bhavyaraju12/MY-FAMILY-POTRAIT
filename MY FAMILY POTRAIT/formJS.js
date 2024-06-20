const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
const url = "https://nbkplmfperjtegugcwzz.supabase.co";
const database = supabase.createClient(url, key);

const form = document.getElementById("medical-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const blood_type = document.getElementById("blood_type").value;
    const allergies = Array.from(document.getElementById("allergies").selectedOptions).map(option => option.value);
    const medications = document.getElementById("medications").value;
    const medical_conditions = Array.from(document.getElementById("medical_conditions").selectedOptions).map(option => option.value);
    const twin = document.getElementById("twin").value;
    const adopted = document.getElementById("adopted").value;
    const photo = document.getElementById("photo").files[0];

    // Collect relative's data
    const relatives = [];
    document.querySelectorAll(".relative-section").forEach(relativeSection => {
        const relative = {
            name: relativeSection.querySelector("input[id='r_name']").value,
            relationship: relativeSection.querySelector("input[id='r_rel']").value,
            height: relativeSection.querySelector("input[id='r_he']").value,
            weight: relativeSection.querySelector("input[id='r_wt']").value,
            medical_conditions: Array.from(relativeSection.querySelector("select[id='r_mc']").selectedOptions).map(option => option.value),
            age: relativeSection.querySelector("input[id='r_age']").value,
            photo: relativeSection.querySelector("input[id='r_image']").files[0],
        };
        relatives.push(relative);
    });
    console.log(relatives);

    

    try {
        // Insert patient data
        const { data, error } = await database
            .from('Patient Form')
            .insert([
                {
                    name, email, dob, gender, height, weight, blood_type, allergies, medications, medical_conditions, twin, adopted, photo
                }
            ]);

        if (error) {
            throw error;
        }

        console.log(data);

        // Insert relatives data
        for (const relative of relatives) {
            const { data: relativeData, error: relativeError } = await database
                .from('relatives')
                .insert({
                    name: relative.name,
                    relationship: relative.relationship,
                    height: relative.height,
                    weight: relative.weight,
                    medical_conditions: relative.medical_conditions,
                    age: relative.age,
                    photo: photo, // Assuming photo is properly prepared for database insertion
                });

            if (relativeError) {
                throw relativeError;
            }

            console.log(relativeData);
        }

        alert("Form submitted successfully!");
        form.reset();
        document.getElementById("relatives-container").innerHTML = "";
    } catch (error) {
        console.error("Error inserting data:", error);
        alert("An error occurred while submitting the form. Please try again.");
    }
});

function addRelative() {
    const template = document.getElementById('relative-template').content.cloneNode(true);
    template.querySelector('.relative-section').style.display = 'block';
    document.getElementById('relatives-container').appendChild(template);
}

function removeRelative(button) {
    button.parentElement.remove();
}
