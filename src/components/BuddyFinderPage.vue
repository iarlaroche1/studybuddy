<template>


    <div class="pos-f-t">
        <div class="collapse" id="navbarToggleExternalContent">
            <div class="bg-custom p-4">
                <h5 class="text-white h4">Collapsed content</h5>
                <span class="text-muted">Toggleable via the navbar brand.</span>
            </div>
        </div>
        <nav class="navbar navbar-dark bg-custom">
            <button class="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </nav>
    </div>

    <!-- Main container for the page -->
    <div class="main-container">

        <!-- Wrapper div for the content and header image -->
        <div class="content-wrapper">

            <!-- Header image -->
            <img class="header-image" alt="Header" :src="header" />

            <!-- Academic Info form container -->
            <div class="academic-form-container">

                <!-- Section containing the text prompting the user to enter academic details -->
                <div class="academic-text-container">
                    <p class="academic-text"> Please select your year and the optional modules you want to study :</p>
                </div>



                <!-- input field section -->
                <div class="dropdown-container">

                    <select v-model="selectedYear" @change="updateModules">
                        <option disabled value="">Select Year</option>
                        <option v-for="year in years" :key="year" :value="year">Year {{ year }}</option>
                    </select>
                

                    <div v-if="selectedYear" class="optional-modules">



                        <h3>Select Optional Module(s) (CTRL + click to select Multiple)</h3>
                        <div class="dropdown-container">
                            <label>
                                <select class="selectpicker" v-model="selectedOptionalModules" multiple>
                                    <option v-for="module in filteredModules" :key="module" :value="module">
                                        {{ module }}
                                    </option>

                                </select>
                            </label>
                        </div>

                    </div>


                </div>

              

                 <!-- Submit Button: Only shows if at least one optional module is selected -->
        <button v-if="selectedOptionalModules.length > 0" @click="storeAcademicDetails" class="text-wrapper-2">
          Find your Study-Buddy here
        </button>

            </div>

            <!-- Footer section with text and small image -->
            <div class="footer">
                <div class="footer-text">2024 Study-Buddy App</div>
                <img class="footer-image" alt="Tempimageonpho" :src="tempImage" />
            </div>

        </div>
    </div>
</template>

<script>


export default {
    name: "BuddyFinderPage2",
  data() {
    return {
    header: require('@/assets/header.jpg'),
      selectedYear: "",
      selectedOptionalModules: [],  // Array to store selected optional modules
      years: [1, 2, 3, 4],
      required_modules: {
        1: [
          "Programming",
          "Web Development",
          "Professional Skills 1",
          "Computing Systems",
          "Algorithms and Information Systems",
          "Fundamentals of Electrical and Electronic Engineering",
          "Introduction to Physics",
        ],
        2: [
          "Discrete Mathematics",
          "Software Engineering 1",
          "Object-Oriented Programming",
          "Database Systems1",
          "Computer Systems and Organization",
          "Statistics for Data Science 1",
          "Networks and Data Communications 1",
          "Object-Oriented Programming: Data Structures and Algorithms",
        ],
        3: [
          "Database Systems 2",
          "Networks ad Data Communications 2",
          "Software Engineering 2",
          "Programming 3",
          "Professional Experience programme in Information Technology",
          "Organisational Innovation",
          "Professional skills",
        ],
        4: [
          "Advanced Professional Skills",
          "Artificial Intelligence",
          "Software Engineering 3",
          "Machine Learning",
          "Real Time Systems",
          "Distributed Systems and Co Operative Computing",
        ],
      },
      optional_modules: {
        1: ["Mathematics", "Mathematics (Honours)"],
        2: [
          "Differential Forms",
          "Discrete Mathematics",
          "Linear Algebra",
          "Introduction to Modelling",
          "Next Generation Technologies 2",
          "Complex Analysis",
        ],
        3: [
          "Human Computer Interaction",
          "Programming Paradigms",
          "Metric Spaces",
          "Numerical Analysis 1",
          "Groups",
          "Games Programming",
        ],
        4: [
          "Rings",
          "Graphics and Image Process",
          "Systems Modelling and Simulation",
          "Final Year Project",
          "Measure Theory",
          "Euclidean and Non-Euclidean Geometry",
          "Information Retrieval",
          "Networks",
          "Fields and Applications",
          "Topology",
          "Computer Security and Forensic Computing",
          "Advanced Group Theory",
          "Cryptography",
        ],
      },
    };
  },
  methods: {
    // Method to update the module options when a year is selected
    updateModules() {
      // Reset the selected modules whenever the year is changed
      this.selectedOptionalModules = [];
    },
    storeAcademicDetails() {
      // TODO 
    }
  },
  computed: {
    filteredModules() {
      return this.selectedYear ? this.optional_modules[this.selectedYear] : [];
      /* If a year is selected (this.selectedYear is truthy), 
      // filteredModules will return the list of modules for that specific year from the optional_modules object.
      If no year is selected (this.selectedYear is falsy), it will return an empty array []. */
    },
  },
};
</script>

<style>
/* Change the background color of the navbar */
.pos-f-t {
    background-color: rgb(173, 7, 82);
    /* Change this color to your preferred color */
}

/* Main container for the page */
.main-container {
    /*background-color: #cccccc;*/
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    position: relative;
}


/* Wrapper div for content */
.content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* Aligns form container vertically */
    align-items: center;
    /* Aligns form container horizontally */
    background-color: #cccccc;
    width: 100%;
    max-width: 1200px;
    /* Limit the max width */
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    margin-top: 20px;
}

/* Header image */
.header-image {
    width: auto;
    max-height: 30vh;
    /* 30% of the viewport height */
    object-fit: fill;
    border-radius: 10px;
}

/* academic form container */
.academic-form-container {
    background-color: #fff6f6;
    border-radius: 30px;
    width: 100%;
    max-width: 600px;
    /* Max width of the form */
    padding: 30px;
    box-sizing: border-box;
    margin-top: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* academic text */
.academic-text-container {
    text-align: center;
    margin-bottom: 20px;
}

.academic-text {
    font-size: 32px;
    font-weight: 600;
    color: #000;
    line-height: 1.4;
}



.dropdown-container label {
    font-size: 18px;
    font-weight: 500;
    color: #000;
    margin-bottom: 8px;
    /* space between label and input */
}



/* Button styling */
.text-wrapper-2 {
    background-color: rgb(173, 7, 82);
    color: white;
    font-size: 24px;
    font-weight: 600;
    padding: 15px 32px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    width: 100%;
    margin-top: 30px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    text-align: center;
}

.text-wrapper-2:hover {
    background-color: rgb(160, 6, 75);
    transform: scale(1.05);
}

.text-wrapper-2:active {
    background-color: rgb(255, 117, 179);
}

/* Footer section */
.footer {
    background-color: #242526;
    height: 100px;
    width: 100%;
    position: relative;
    bottom: 0;
    text-align: center;
    padding: 10px;
}

.footer-text {
    color: #ffffff;
    font-size: 18px;
    font-weight: 400;
}


</style>