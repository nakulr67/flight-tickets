AOS.init();
const texts = [
    "Amazing experiences await you.",
    "Book now and enjoy great discounts!",
    "Get ready for your dream vacation!",
    "Travel with comfort and convenience."
];

let index = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = "";
const fixedText = "Easy booking, affordable prices. ";
const dynamicTextElement = document.getElementById("dynamic-text");

function type() {

    const fullText = texts[index];

    // Handle typing or deleting
    if (isDeleting) {
        currentText = fullText.substring(0, charIndex--); // Delete characters
    } else {
        currentText = fullText.substring(0, charIndex++); // Type characters
    }

    // Set the dynamic text content
    dynamicTextElement.textContent = currentText;

    // Determine the typing speed
    let typingSpeed = isDeleting ? 50 : 100;

    // When the full text has been typed, wait before starting to delete
    if (!isDeleting && currentText === fullText) {
        typingSpeed = 2000; // Pause before deleting
        isDeleting = true;  // Start deleting after the pause
    }
    // When the text has been deleted, move to the next text
    else if (isDeleting && currentText === "") {
        isDeleting = false;
        index = (index + 1) % texts.length; // Loop through the texts array
        charIndex = 0; // Reset character index for typing the next text
        typingSpeed = 500; // Small pause before typing the next text
    }

    // Call the function again to continue typing
    setTimeout(type, typingSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const oneWayButton = document.getElementById('oneWay');
    const roundTripButton = document.getElementById('roundTrip');
    const slider = document.getElementById('slider');
    const returnInput = document.getElementById('return-input');
    const returnGroup = document.getElementById('return-group');
    const fromInput = document.getElementById('from-input');
    const toInput = document.getElementById('to-input');
    const departureInput = document.getElementById('departure-input');
    const fromError = document.getElementById('from-alert');
    const toError = document.getElementById('to-alert');
    const departureError = document.getElementById('departure-error');
    const returnError = document.getElementById('return-error');

    function validateForm() {
        let valid = true;

        // Validate same airport
        if (fromInput.value === toInput.value && fromInput.value.trim() !== '') {
            fromError.style.display = 'block';
            toError.style.display = 'block';
            valid = false;
        } else {
            fromError.style.display = 'none';
            toError.style.display = 'none';
        }

        // Validate same date
        if (departureInput.value && returnInput.value && departureInput.value === returnInput.value) {
            departureError.style.display = 'block';
            returnError.style.display = 'block';
            valid = false;
        } else {
            departureError.style.display = 'none';
            returnError.style.display = 'none';
        }

        return valid;
    }

    // Trip Toggle Buttons
    oneWayButton.addEventListener('click', () => {
        slider.classList.remove('round-trip');
        slider.classList.add('one-way');
        oneWayButton.classList.add('active');
        roundTripButton.classList.remove('active');
        returnInput.disabled = true; // Disable return date for one-way
        returnGroup.style.opacity = '0.5'; // Visual indication
        validateForm(); // Validate form on trip type change
    });

    roundTripButton.addEventListener('click', () => {
        slider.classList.remove('one-way');
        slider.classList.add('round-trip');
        roundTripButton.classList.add('active');
        oneWayButton.classList.remove('active');
        returnInput.disabled = false; // Enable return date for round-trip
        returnGroup.style.opacity = '1'; // Restore opacity
        validateForm(); // Validate form on trip type change
    });

    // Real-time validation
    fromInput.addEventListener('input', () => {
        if (oneWayButton.classList.contains('active')) {
            // Skip same airport validation for one-way
            fromError.style.display = 'none';
            toError.style.display = 'none';
        } else {
            validateForm();
        }
    });
    toInput.addEventListener('input', validateForm);
    departureInput.addEventListener('input', validateForm);
    returnInput.addEventListener('input', () => {
        if (oneWayButton.classList.contains('active')) {
            // Skip same date validation for one-way
            departureError.style.display = 'none';
            returnError.style.display = 'none';
        } else {
            validateForm();
        }
    });
});


// ====================input seggestion================
const airports = [
    // India Airports
    { name: "Indira Gandhi International Airport, Delhi (DEL)", code: "DEL" },
    { name: "Chhatrapati Shivaji Maharaj International Airport, Mumbai (BOM)", code: "BOM" },
    { name: "Kempegowda International Airport, Bengaluru (BLR)", code: "BLR" },
    { name: "Netaji Subhash Chandra Bose International Airport, Kolkata (CCU)", code: "CCU" },
    { name: "Rajiv Gandhi International Airport, Hyderabad (HYD)", code: "HYD" },
    { name: "Chennai International Airport, Chennai (MAA)", code: "MAA" },
    { name: "Cochin International Airport, Kerala (COK)", code: "COK" },
    { name: "Dabolim Airport, Goa (GOI)", code: "GOI" },
    { name: "Trivandrum International Airport, Kerala (TRV)", code: "TRV" },
    { name: "Lokpriya Gopinath Bordoloi International Airport, Guwahati (GAU)", code: "GAU" },
    { name: "Swami Vivekananda Airport, Raipur (RPR)", code: "RPR" },
    { name: "Jaipur International Airport, Jaipur(JAI)", code: "JAI" },

    // Australia Airports
    { name: "Sydney Kingsford Smith Airport, Sydney (SYD)", code: "SYD" },
    { name: "Melbourne Tullamarine Airport, Melbourne(MEL)", code: "MEL" },
    { name: "Brisbane Airport, Brisbane(BNE)", code: "BNE" },
    { name: "Perth Airport, Perth(PER)", code: "PER" },
    { name: "Adelaide Airport, Adelaide(ADL)", code: "ADL" },
    { name: "Gold Coast Airport, Gold Coast(OOL)", code: "OOL" },
    { name: "Canberra Airport, Canberra(CBR)", code: "CBR" },
    { name: "Cairns Airport, Cairns(CNS)", code: "CNS" },
    { name: "Hobart International Airport, Hobart(HBA)", code: "HBA" },
    { name: "Darwin International Airport, Darwin(DRW)", code: "DRW" },
    { name: "Townsville Airport, Townsville(TSV)", code: "TSV" },
    { name: "Newcastle Airport, Newcastle(NTL)", code: "NTL" }
];


const inputFrom = document.getElementById('from-input');
const inputTo = document.getElementById('to-input');
const suggestionsListFrom = document.getElementById('from-suggestions-list');
const suggestionsListTo = document.getElementById('to-suggestions-list');
const alertFrom = document.getElementById('from-alert');
const alertTo = document.getElementById('to-alert');

let lastInputFrom = '';
let lastInputTo = '';

function filterSuggestions(input, suggestionsList) {
    const query = input.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (query) {
        const filteredAirports = airports.filter(airport => {
            return airport.name.toLowerCase().includes(query) || airport.code.toLowerCase().includes(query);
        });

        filteredAirports.forEach(airport => {
            const li = document.createElement('li');
            li.textContent = airport.name;
            li.dataset.code = airport.code;
            li.addEventListener('click', function() {
                input.value = this.textContent;
                suggestionsList.innerHTML = '';
                checkForDuplicateSelection();
            });
            suggestionsList.appendChild(li);
        });
    }
}

function checkForDuplicateSelection() {
    if (inputFrom.value === inputTo.value) {
        alertTo.style.display = 'block';
    } else {
        alertTo.style.display = 'none';
    }
    if (inputTo.value === inputFrom.value) {
        alertFrom.style.display = 'block';
    } else {
        alertFrom.style.display = 'none';
    }
}

inputFrom.addEventListener('input', function() {
    if (this.value === lastInputFrom) {
        alertFrom.style.display = 'block';
        return;
    }
    lastInputFrom = this.value;
    filterSuggestions(this, suggestionsListFrom);
    checkForDuplicateSelection();
});

inputTo.addEventListener('input', function() {
    if (this.value === lastInputTo) {
        alertTo.style.display = 'block';
        return;
    }
    lastInputTo = this.value;
    filterSuggestions(this, suggestionsListTo);
    checkForDuplicateSelection();
});

// ===================form pop===============


// ================return input===================
// function selectTrip(tripType) {
//     const roundTripButton = document.querySelector('.btn-trip.round-trip');
//     const oneWayButton = document.querySelector('.btn-trip.one-way');
//     const returnBox = document.querySelector('.return-box');
    
//     if (tripType === 'one') {
//         roundTripButton.classList.remove('selected');
//         oneWayButton.classList.add('selected');
//         returnBox.style.visibility = 'hidden';  // Hide return date input
//     } else {
//         oneWayButton.classList.remove('selected');
//         roundTripButton.classList.add('selected');
//         returnBox.style.visibility = 'visible';  // Show return date input
//     }
// }
document.addEventListener('DOMContentLoaded', function () {
    const tripInputs = document.querySelectorAll('input[name="trip"]');
    const toggleBtn = document.querySelector('.toggle-btn');
    const roundtripLabel = document.querySelector('.roundtrip-label');
    const onewayLabel = document.querySelector('.oneway-label');
    const returnDateInput = document.getElementById('return');

    tripInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (document.getElementById('oneway').checked) {
                toggleBtn.classList.remove('toggle-roundtrip');
                toggleBtn.classList.add('toggle-oneway');
                roundtripLabel.style.color = '#007bff';
                onewayLabel.style.color = 'white';
                returnDateInput.disabled = true; // Disable return date input
            } else {
                toggleBtn.classList.remove('toggle-oneway');
                toggleBtn.classList.add('toggle-roundtrip');
                onewayLabel.style.color = '#007bff';
                roundtripLabel.style.color = 'white';
                returnDateInput.disabled = false; // Enable return date input
            }
        });
    });
});

// Start the typing effect
document.addEventListener("DOMContentLoaded", function () {
    type();
});

// Function to handle trip selection
// function selectTrip(type) {
//     const oneWayButton = document.querySelector('.btn-trip.one-way');
//     const roundTripButton = document.querySelector('.btn-trip.round-trip');
//     const returnDateField = document.querySelector('.return-date');
//     const returnDateDummy = document.querySelector('.return-date-dummy');
    
//     if (type === 'one') {
//         oneWayButton.classList.add('selected');
//         roundTripButton.classList.remove('selected');
//         returnDateField.style.display = 'none';
//         returnDateDummy.style.display = 'block';
//     } else {
//         oneWayButton.classList.remove('selected');
//         roundTripButton.classList.add('selected');
//         returnDateField.style.display = 'block';
//         returnDateDummy.style.display = 'none';
//     }
// }

// ===============new one btn=================



// $(document).ready(function(){
//     document.getElementById("heart").onclick = function(){
//         document.querySelector(".fa-gratipay").style.color = "#E74C3C";
//     };
// });

// =====================flight blog-detail section================
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn-deal');
    const dealText = document.getElementById('deal-text');
    const dealImage = document.getElementById('deal-image');
    const dealDesc = document.getElementById('deal-desc');
    const underline = document.querySelector('.underline');

    // Check if underline exists
    if (underline) {
        // Set the default active button underline
        const activeButton = document.querySelector('.btn-deal.active');
        if (activeButton) {
            underline.style.width = `${activeButton.offsetWidth}px`;
            underline.style.left = `${activeButton.offsetLeft}px`;
        }

        buttons.forEach(button => {
            button.addEventListener('click', function () {
                const newText = this.getAttribute('data-text');
                const newImage = this.getAttribute('data-img');
                const newDesc = this.getAttribute('data-desc');

                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Animate underline from right to left
                underline.style.transition = 'none';
                underline.style.width = `${this.offsetWidth}px`;
                underline.style.left = `${this.offsetLeft + this.offsetWidth}px`;

                setTimeout(() => {
                    underline.style.transition = 'left 0.4s ease, width 0.4s ease';
                    underline.style.left = `${this.offsetLeft}px`;
                }, 10);

                // Animate text and image (slide effect)
                dealText.style.transform = 'translateX(100%)';
                dealDesc.style.transform = 'translateX(100%)';
                dealImage.style.transform = 'translateX(100%)';
                dealText.style.opacity = '0';
                dealDesc.style.opacity = '0';
                dealImage.style.opacity = '0';

                setTimeout(() => {
                    dealText.textContent = newText;
                    dealDesc.textContent = newDesc;
                    dealImage.src = newImage;

                    // Slide in the new text and image
                    dealText.style.transform = 'translateX(0)';
                    dealDesc.style.transform = 'translateX(0)';
                    dealImage.style.transform = 'translateX(0)';
                    dealText.style.opacity = '1';
                    dealDesc.style.opacity = '1';
                    dealImage.style.opacity = '1';
                }, 400);
            });
        });

        // On window resize, adjust the underline position
        window.addEventListener('resize', function () {
            const activeButton = document.querySelector('.btn-deal.active');
            if (activeButton) {
                underline.style.width = `${activeButton.offsetWidth}px`;
                underline.style.left = `${activeButton.offsetLeft}px`;
            }
        });
    } else {
        console.warn('Underline element not found.');
    }
});
// ======================ticket card====================
const roundTripBtn = document.getElementById('roundTripBtn');
        const oneWayBtn = document.getElementById('oneWayBtn');

        const prices = [
            { element: document.getElementById('price1'), roundTrip: '$1200', oneWay: '$700' },
            { element: document.getElementById('price2'), roundTrip: '$1400', oneWay: '$900' },
            { element: document.getElementById('price3'), roundTrip: '$900', oneWay: '$600' },
            { element: document.getElementById('price4'), roundTrip: '$1000', oneWay: '$750' },
            { element: document.getElementById('price5'), roundTrip: '$1600', oneWay: '$1100' }
        ];

        roundTripBtn.addEventListener('click', () => {
            handleButtonClick(roundTripBtn, oneWayBtn, 'roundTrip');
        });

        oneWayBtn.addEventListener('click', () => {
            handleButtonClick(oneWayBtn, roundTripBtn, 'oneWay');
        });

        function handleButtonClick(activeBtn, inactiveBtn, tripType) {
            // Change button background
            activeBtn.classList.add('active');
            inactiveBtn.classList.remove('active');

            // Update prices with animation
            prices.forEach(price => {
                price.element.classList.add('zoom-out');
                setTimeout(() => {
                    price.element.innerHTML = tripType === 'roundTrip' ? price.roundTrip : price.oneWay;
                    price.element.classList.remove('zoom-out');
                    price.element.classList.add('zoom-in');
                }, 300);

                setTimeout(() => {
                    price.element.classList.remove('zoom-in');
                }, 600);
            });
        }

        // ==========   pop-up==============
        // Select all elements with the class 'open-modal'
const openModalElements = document.querySelectorAll('.open-modal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('bookingModal');
const modalBackdrop = document.getElementById('modalBackdrop');

// Function to open the modal with animation
function openModal() {
    modal.style.display = 'block'; // Show modal
    modalBackdrop.style.display = 'block'; // Show backdrop
    setTimeout(() => {
        modal.classList.add('modal-visible'); // Trigger CSS animation
    }, 10); // Small delay for smooth transition
}

// Function to close the modal with animation
function closeModal() {
    modal.classList.remove('modal-visible'); // Remove animation class
    setTimeout(() => {
        modal.style.display = 'none'; // Hide modal after animation
        modalBackdrop.style.display = 'none'; // Hide backdrop
    }, 500); // Wait for animation to finish (0.5s)
}

// Event listener for open (applied to all elements with the 'open-modal' class)
openModalElements.forEach(element => {
    element.addEventListener('click', openModal);
});

// Event listener for close
closeModalBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal); // Close modal on clicking backdrop


// ===========popular flight route============
document.addEventListener("DOMContentLoaded", function () {
    const usaBtn = document.getElementById('usa-btn');
    const indiaBtn = document.getElementById('india-btn');
    const usaRoutes = document.getElementById('usa-routes');
    const indiaRoutes = document.getElementById('india-routes');

    // Function to fade out an element
    function fadeOut(element, duration, callback) {
        element.style.opacity = 1;
        let step = 16 / duration; // assuming 60fps, 16ms per frame

        function fade() {
            let opacity = parseFloat(element.style.opacity);
            if ((opacity -= step) <= 0) {
                element.style.opacity = 0;
                element.style.display = 'none';
                if (callback) callback();
            } else {
                element.style.opacity = opacity;
                requestAnimationFrame(fade);
            }
        }

        fade();
    }

    // Function to fade in an element
    function fadeIn(element, duration) {
        element.style.display = 'block';
        element.style.opacity = 0;
        let step = 16 / duration;

        function fade() {
            let opacity = parseFloat(element.style.opacity);
            if ((opacity += step) >= 1) {
                element.style.opacity = 1;
            } else {
                element.style.opacity = opacity;
                requestAnimationFrame(fade);
            }
        }

        fade();
    }

    // Function to handle button background color change
    function changeButtonBackground(activeBtn, inactiveBtn) {
        // Change the active button's background color
        activeBtn.style.backgroundColor = '#007bff';
        activeBtn.style.color = 'white';

        // Revert the inactive button's background color
        inactiveBtn.style.backgroundColor = '';
        inactiveBtn.style.color = '';
    }

    // Show USA routes, hide India routes
    usaBtn.addEventListener('click', function () {
        fadeOut(indiaRoutes, 500, function () {
            fadeIn(usaRoutes, 500);
        });
        changeButtonBackground(usaBtn, indiaBtn); // Change the button background
    });

    // Show India routes, hide USA routes
    indiaBtn.addEventListener('click', function () {
        fadeOut(usaRoutes, 500, function () {
            fadeIn(indiaRoutes, 500);
        });
        changeButtonBackground(indiaBtn, usaBtn); // Change the button background
    });

    // Make USA routes and button active by default
    fadeIn(usaRoutes, 500); // Show USA routes initially
    changeButtonBackground(usaBtn, indiaBtn); // Set USA button as active by default
});
