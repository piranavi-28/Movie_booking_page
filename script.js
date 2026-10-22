(function () {
    emailjs.init("mP9xWLT7rz3Z6LB79");
})();

let allBookings = [];

function calculateTotal() {
    let movie = document.getElementById("movieSelect").value;
    let tickets = document.getElementById("ticketCount").value;
    let pricePerTicket = 0;

    if (movie === "Inception") {
        pricePerTicket = 300;
    } else if (movie === "The Lion King") {
        pricePerTicket = 150;
    } else if (movie === "Avengers Endgame") {
        pricePerTicket = 180;
    } else if (movie === "Tenet") {
        pricePerTicket = 250;
    }

    if (pricePerTicket > 0 && tickets > 0) {
        let total = pricePerTicket * tickets;
        document.getElementById("totalPriceDisplay").innerText = total;
    } else {
        document.getElementById("totalPriceDisplay").innerText = "0";
    }
}


function bookTickets() {
    let movie = document.getElementById("movieSelect").value;
    let time = document.getElementById("timeSelect").value;
    let email = document.getElementById("emailInput").value.trim();
    let tickets = document.getElementById("ticketCount").value;
    let total = document.getElementById("totalPriceDisplay").innerText;

    let errorBox = document.getElementById("errorMessage");
    let successBox = document.getElementById("successMessage");


    if (movie === "" || time === "" || email === "" || tickets <= 0) {
        errorBox.style.display = "block";
        errorBox.innerText = "Please fill all details correctly and enter valid positive tickets!";
        successBox.style.display = "none";
        return;
    }


    if (!email.includes("@") || !email.includes(".")) {
        errorBox.style.display = "block";
        errorBox.innerText = "Please enter a valid email address!";
        successBox.style.display = "none";
        return;
    }

    errorBox.style.display = "none";


    let newBooking = {
        id: Date.now(),
        movie: movie,
        time: time,
        email: email,
        tickets: tickets,
        total: total
    };


    allBookings.push(newBooking);


    let emailParams = {
        to_email: email,
        movie_name: movie,
        show_time: time,
        ticket_quantity: tickets,
        total_price: total
    };

    emailjs.send("service_pebfw1t", "template_g6pwo3j", emailParams)
        .then(function (response) {
            console.log("Email sent successfully!", response.status, response.text);
            successBox.style.display = "block";
            successBox.innerText = "Booking confirmed! Email sent to "+ email;
        }, function (error) {
            console.log("Email send failed (Check EmailJS keys if testing live):", error);
            errorBox.style.display = "block";
            errorBox.innerText = "Error booking failed !!" + email;
        });
    displayBookings(allBookings);
    resetForm();
}


function displayBookings(bookingsArray) {
    let listDiv = document.getElementById("bookingsList");
    let header = document.getElementById("bookingHeader");

    header.innerText = "Your Bookings (" + allBookings.length + ")";

    if (bookingsArray.length === 0) {
        listDiv.innerHTML = '<p style="color: gray; text-align: center;">No bookings yet.<br>Book your favourite movies and see them here.</p>';
        return;
    }

    let htmlContent = "";
    for (let i = 0; i < bookingsArray.length; i++) {
        let b = bookingsArray[i];
        htmlContent += '<div class="booking-item">' +
            '<strong>Movie:</strong> ' + b.movie + '<br>' +
            '<strong>Time:</strong> ' + b.time + '<br>' +
            '<strong>Tickets:</strong> ' + b.tickets + '<br>' +
            '<strong>Total:</strong> ₹' + b.total + '<br>' +
            '<strong>Email:</strong> ' + b.email + '<br>' +
            '<button onclick="cancelBooking(' + b.id + ')" style="margin-top:5px; background:#ff4d4d; color:white; border:none; padding:5px;">Cancel Booking</button>' +
            '</div>';
    }
    listDiv.innerHTML = htmlContent;
}


function cancelBooking(id) {
    let tempArray = [];
    for (let i = 0; i < allBookings.length; i++) {
        if (allBookings[i].id !== id) {
            tempArray.push(allBookings[i]);
        }
    }
    allBookings = tempArray;
    displayBookings(allBookings);
}


function searchBookings() {
    let searchText = document.getElementById("searchInput").value.toLowerCase();
    let filteredArray = [];

    for (let i = 0; i < allBookings.length; i++) {
        let movieName = allBookings[i].movie.toLowerCase();
        if (movieName.includes(searchText)) {
            filteredArray.push(allBookings[i]);
        }
    }
    displayBookings(filteredArray);
}

function resetForm() {
    document.getElementById("bookingForm").reset();
    document.getElementById("totalPriceDisplay").innerText = "0";
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("successMessage").style.display = "none";
}