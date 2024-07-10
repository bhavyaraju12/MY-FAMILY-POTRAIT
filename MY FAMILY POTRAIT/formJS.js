const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3BsbWZwZXJqdGVndWdjd3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzQzMDUsImV4cCI6MjAzMzc1MDMwNX0.u52UJNzNT3jEhLQCVfzyeqxSCVwlYgdT538pqDB9Ap0";
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
  const allergies = Array.from(
    document.getElementById("allergies").selectedOptions
  ).map((option) => option.value);
  const medications = document.getElementById("medications").value;
  const medical_conditions = Array.from(
    document.getElementById("medical_conditions").selectedOptions
  ).map((option) => option.value);
  const twin = document.getElementById("twin").value;
  const adopted = document.getElementById("adopted").value;
  const photo = document.getElementById("photo").files[0];

  // Upload photo to Supabase storage
  let photoUrl = null;
  if (photo) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.-]/g, ""); // Generates a unique timestamp and removes special characters
      const customPhotoName = encodeURIComponent(
        `${name}_${timestamp}.${photo.name.split(".").pop()}`
      ); // Creates and encodes the custom file name

      console.log("custom name : " + customPhotoName);
      const { data, error } = await database.storage
        .from("Photo")
        .upload(`public/${customPhotoName}`, photo, {
          cacheControl: "3600",
          upsert: true, // Allow upserting to handle existing files
        });

      if (error) {
        console.log("error in uploading image : " + error);
      }

      console.log("Upload data:", data); // Log the upload data
      // Get the public URL of the uploaded file
      const { data:publicURL, error: getUrlError } = await database.storage
        .from("Photo")
        .getPublicUrl(data.path);

      if (getUrlError) {
        console.log(getUrlError);
      }

      console.log("Public URL:", publicURL); // Log the public URL

      photoUrl = publicURL;
    } catch (error) {
      console.error("Error uploading photo:", error.message);
      alert("Error uploading photo. Please try again.");
      return;
    }
  }
  console.log("Final photo URL:", photoUrl);

  // Collect relative's data
  const relatives = [];
  document.querySelectorAll(".relative-section").forEach((relativeSection) => {
    const relative = {
      name: relativeSection.querySelector("input[id='r_name']").value,
      relationship: relativeSection.querySelector("input[id='r_rel']").value,
      height: relativeSection.querySelector("input[id='r_he']").value,
      weight: relativeSection.querySelector("input[id='r_wt']").value,
      medical_conditions: Array.from(
        relativeSection.querySelector("select[id='r_mc']").selectedOptions
      ).map((option) => option.value),
      age: relativeSection.querySelector("input[id='r_age']").value,
      photo: relativeSection.querySelector("input[id='r_image']").files[0],
    };
    relatives.push(relative);
  });
  console.log(relatives);

  try {
    // Insert patient data and get the inserted ID
    const { data: patientData, error: patientError } = await database
      .from("Patient Form")
      .insert([
        {
          name,
          email,
          dob,
          gender,
          height,
          weight,
          blood_type,
          allergies,
          medications,
          medical_conditions,
          twin,
          adopted,
          photo_url: photoUrl,
        },
      ])
      .select(); // Add .select() to return the inserted data

    if (patientError) {
      throw patientError;
    }

    if (!patientData || patientData.length === 0) {
      throw new Error("Patient data insertion failed");
    }

    const patientId = patientData[0].id; // Assuming the returned data contains the inserted row

    console.log(patientData);

    // Insert relatives data
    for (const relative of relatives) {
      let relativePhotoUrl = null;
      if (relative.photo) {
        try {
          const timestamp = new Date().toISOString().replace(/[:.-]/g, ""); // Generates a unique timestamp and removes special characters
          const customRelativePhotoName = encodeURIComponent(
            `${relative.name}_${timestamp}.${relative.photo.name
              .split(".")
              .pop()}`
          ); // Creates and encodes the custom file name for relative

          const { data: uploadData, error: uploadError } =
            await database.storage
              .from("Photo")
              .upload(`public/${customRelativePhotoName}`, relative.photo, {
                cacheControl: "3600",
                upsert: true, // Allow upserting to handle existing files
              });

          if (uploadError) {
            throw uploadError;
          }

          console.log("Relative upload data:", uploadData); // Log the upload data for relatives

          const { data: relativePublicURL, error: getRelativeUrlError } =
            database.storage
              .from("Photo")
              .getPublicUrl(`public/${customRelativePhotoName}`);

          if (getRelativeUrlError) {
            throw getRelativeUrlError;
          }

          console.log("Relative public URL:", relativePublicURL); // Log the public URL for relatives

          relativePhotoUrl = relativePublicURL;
        } catch (error) {
          console.error("Error uploading relative photo:", error.message);
          alert("Error uploading relative photo. Please try again.");
          return;
        }
      }

      const { data: relativeData, error: relativeError } = await database
        .from("relatives")
        .insert({
          name: relative.name,
          relationship: relative.relationship,
          height: relative.height,
          weight: relative.weight,
          medical_conditions: relative.medical_conditions,
          age: relative.age,
          photo_url: relativePhotoUrl,
          patient_id: patientId, // Use the patient's ID as the foreign key
        })
        .select(); // Add .select() to return the inserted data

      if (relativeError) {
        throw relativeError;
      }

      if (!relativeData || relativeData.length === 0) {
        throw new Error("Relative data insertion failed");
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
  const template = document
    .getElementById("relative-template")
    .content.cloneNode(true);
  template.querySelector(".relative-section").style.display = "block";
  document.getElementById("relatives-container").appendChild(template);
}

function removeRelative(button) {
  button.parentElement.remove();
}
