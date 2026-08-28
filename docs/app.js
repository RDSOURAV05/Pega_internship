// Pega - Movie Ticket Booking Portal - State Controller and Logic Engine

document.addEventListener("DOMContentLoaded", () => {
  
  // Movie database (Malayalam Releasing Directory)
  const moviesDb = {
    "Bethlehem Kudumba Unit": {
      title: "Bethlehem Kudumba Unit",
      genre: "Family / Romantic Comedy",
      cast: "Nivin Pauly, Mamitha Baiju",
      release: "21 August 2026",
      className: "poster-bethlehem",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Bethlehem_Kudumba_Unit_Movie_Poster.jpg/250px-Bethlehem_Kudumba_Unit_Movie_Poster.jpg"
    },
    "Khalifa – The Ruler": {
      title: "Khalifa – The Ruler",
      genre: "Action / Crime",
      cast: "Prithviraj Sukumaran",
      release: "August 2026",
      className: "poster-khalifa",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Khalifa_film_2026_poster.jpg/250px-Khalifa_film_2026_poster.jpg"
    },
    "Thudakkam": {
      title: "Thudakkam",
      genre: "Thriller / Drama",
      cast: "New Cast & Crew",
      release: "August 2026",
      className: "poster-thudakkam",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/a5/Thudakkam_Movie_First_Look_Poster.jpg"
    },
    "Toxic: A Fairy Tale for Grown-ups": {
      title: "Toxic: A Fairy Tale",
      genre: "Action / Drama",
      cast: "Yash, Kiara Advani, Nayanthara",
      release: "26 August 2026",
      className: "poster-toxic",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Toxic-_A_Fairy_Tale_for_Grown-Ups_poster.jpg/250px-Toxic-_A_Fairy_Tale_for_Grown-Ups_poster.jpg"
    },
    "Bhogi": {
      title: "Bhogi",
      genre: "Action / Drama",
      cast: "Sharwanand, Anupama Parameswaran",
      release: "28 August 2026",
      className: "poster-bhogi",
      posterUrl: "https://cf-images.assettype.com/cinemaexpress%2F2026-02-25%2F9hp5l7bh%2FSharwanandBhogi.jpg"
    },
    "Theri Meri": {
      title: "Theri Meri",
      genre: "Comedy / Thriller",
      cast: "Sreenath Bhasi, Shine Tom Chacko",
      release: "28 August 2026",
      className: "poster-theri",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTA0NzYzNzYtY2Y3Yy00NDE5LWJiOTQtZTY5YjE3MDgwMDM2XkEyXkFqcGc@._V1_.jpg"
    },
    "Nere Chovva": {
      title: "Nere Chovva",
      genre: "Sci-Fi / Thriller",
      cast: "Kunchacko Boban, Manju Warrier",
      release: "28 August 2026",
      className: "poster-nere",
      posterUrl: "https://static.toiimg.com/thumb/imgsize-119732,msid-129928496,width-1000,height-250,resizemode-75/129928496.jpg"
    },
    "Kathanar – The Wild Sorcerer": {
      title: "Kathanar: Wild Sorcerer",
      genre: "Fantasy / Horror / Thriller",
      cast: "Jayasurya, Anushka Shetty",
      release: "28 August 2026",
      className: "poster-kathanar",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Kathanar_-_The_Wild_Sorcerer_poster.jpg/250px-Kathanar_-_The_Wild_Sorcerer_poster.jpg"
    }
  };

  // State variables
  let bookingState = {
    customerName: "",
    customerEmail: "",
    selectedMovie: "",
    selectedTheater: "",
    ticketCategory: "Standard",
    ticketQty: 1,
    selectedSeats: [],
    basePriceRate: 150,
    baseTotal: 0,
    taxTotal: 0,
    discountTotal: 0,
    netTotal: 0,
    caseId: ""
  };

  // Seating grid configuration
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 8;
  const standardRowsCount = 4; // A, B, C, D
  const standardPrice = 150;
  const premiumPrice = 300;

  // Pre-seeded occupied seats (to simulate real-world theater capacity)
  const preOccupiedSeats = ["A3", "B5", "C2", "C3", "D7", "E4", "E5", "F1", "F8"];

  // Elements
  const chevSteps = [
    document.getElementById("chev-1"),
    document.getElementById("chev-2"),
    document.getElementById("chev-3"),
    document.getElementById("chev-4")
  ];

  const stages = [
    document.getElementById("stage-1"),
    document.getElementById("stage-2"),
    document.getElementById("stage-3"),
    document.getElementById("stage-4")
  ];

  const requestForm = document.getElementById("request-form");
  const movieSelect = document.getElementById("movie-select");
  const moviePosterCard = document.getElementById("movie-poster-card");
  const posterArt = document.getElementById("poster-art");
  const posterTitle = document.getElementById("poster-title");
  const posterGenre = document.getElementById("poster-genre");
  const posterCast = document.getElementById("poster-cast");
  const posterRelease = document.getElementById("poster-release");

  const seatingGrid = document.getElementById("seating-grid");
  const selectedQtyLabel = document.getElementById("selected-qty-label");
  const nextTo3Btn = document.getElementById("go-to-3");
  const confirmBookingBtn = document.getElementById("confirm-booking");
  
  // Navigation elements
  const backTo1Btn = document.getElementById("back-to-1");
  const backTo2Btn = document.getElementById("back-to-2");
  const restartFlowBtn = document.getElementById("restart-flow");

  // Invoice display elements
  const invoiceName = document.getElementById("invoice-name");
  const invoiceEmail = document.getElementById("invoice-email");
  const invoiceMovie = document.getElementById("invoice-movie");
  const invoiceTheater = document.getElementById("invoice-theater");
  const invoiceSeats = document.getElementById("invoice-seats");
  const invoiceQty = document.getElementById("invoice-qty");
  const invoiceBaseRate = document.getElementById("invoice-base-rate");
  const invoiceBaseTotal = document.getElementById("invoice-base-total");
  const invoiceTax = document.getElementById("invoice-tax");
  const invoiceDiscount = document.getElementById("invoice-discount");
  const discountRow = document.getElementById("discount-row");
  const invoiceNetTotal = document.getElementById("invoice-net-total");

  // Confirmation display elements
  const confTransId = document.getElementById("conf-trans-id");
  const confMovie = document.getElementById("conf-movie");
  const confTheater = document.getElementById("conf-theater");
  const confSeats = document.getElementById("conf-seats");
  const confAmount = document.getElementById("conf-amount");

  // Initializing Unique Case Reference
  function generateCaseId() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `PEGA-MB-2026-${num}`;
  }

  bookingState.caseId = generateCaseId();
  document.getElementById("case-ref").innerText = bookingState.caseId;

  // Now Showing Poster Cards Bindings
  const nowShowingCards = document.querySelectorAll(".now-showing-card");
  nowShowingCards.forEach(card => {
    card.addEventListener("click", () => {
      const selectedMovieName = card.getAttribute("data-movie");
      
      // Update form select box
      movieSelect.value = selectedMovieName;
      
      // Highlight card selection
      nowShowingCards.forEach(c => c.classList.remove("active-selection"));
      card.classList.add("active-selection");
      
      // Trigger change rules
      movieSelect.dispatchEvent(new Event("change"));
    });
  });

  // Dynamic Poster Updater Rule
  movieSelect.addEventListener("change", () => {
    const selectedVal = movieSelect.value;
    const movie = moviesDb[selectedVal];

    // Highlight matching poster card in gallery
    nowShowingCards.forEach(c => {
      if (c.getAttribute("data-movie") === selectedVal) {
        c.classList.add("active-selection");
      } else {
        c.classList.remove("active-selection");
      }
    });

    if (movie) {
      moviePosterCard.className = `movie-poster-card ${movie.className}`;
      posterArt.innerHTML = `<img class="selected-poster-img" src="${movie.posterUrl}" alt="${movie.title}">`;
      posterTitle.innerText = movie.title;
      posterGenre.innerHTML = `<strong>Genre:</strong> ${movie.genre}`;
      posterCast.innerHTML = `<strong>Cast:</strong> ${movie.cast}`;
      posterRelease.innerHTML = `<strong>Release:</strong> ${movie.release}`;
    } else {
      moviePosterCard.className = "movie-poster-card empty";
      posterArt.innerHTML = '<span class="poster-icon">🎬</span>';
      posterTitle.innerText = "Select a Movie";
      posterGenre.innerText = "-";
      posterCast.innerText = "-";
      posterRelease.innerText = "-";
    }
  });

  // Active Stage Switcher
  function transitionToStage(stageNum) {
    stages.forEach((stage, idx) => {
      if (idx === stageNum - 1) {
        stage.classList.add("active");
      } else {
        stage.classList.remove("active");
      }
    });

    chevSteps.forEach((step, idx) => {
      step.className = "chevron-step";
      if (idx === stageNum - 1) {
        step.classList.add("active");
      } else if (idx < stageNum - 1) {
        step.classList.add("completed");
      }
    });

    // Update Status Indicators
    const statusLabel = document.getElementById("case-status-label");
    const stageNames = ["Initial Stage", "Availability", "Approval", "Booking Execution"];
    if (stageNum === 4) {
      statusLabel.innerText = "Resolved-Completed";
      statusLabel.className = "status-completed";
    } else {
      statusLabel.innerText = stageNames[stageNum - 1];
      statusLabel.className = "status-active";
    }
  }

  // --- STAGE 1: REQUEST ENGINE (US-001) ---
  requestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Capture state
    bookingState.customerName = document.getElementById("cust-name").value;
    bookingState.customerEmail = document.getElementById("cust-email").value;
    bookingState.selectedMovie = document.getElementById("movie-select").value;
    bookingState.selectedTheater = document.getElementById("theater-select").value;
    bookingState.ticketCategory = document.getElementById("ticket-type").value;
    bookingState.ticketQty = parseInt(document.getElementById("ticket-qty").value, 10);
    bookingState.basePriceRate = bookingState.ticketCategory === "Premium" ? premiumPrice : standardPrice;

    // Reset previous seat selections
    bookingState.selectedSeats = [];
    nextTo3Btn.disabled = true;

    // Load seating layout
    renderSeatingGrid();

    // Transition
    transitionToStage(2);
  });

  // --- STAGE 2: SEATING MAP ENGINE (US-002) ---
  function renderSeatingGrid() {
    seatingGrid.innerHTML = "";
    selectedQtyLabel.innerText = bookingState.ticketQty;
    
    rows.forEach((row, rowIdx) => {
      const isPremiumRow = rowIdx >= standardRowsCount;
      
      for (let sNum = 1; sNum <= seatsPerRow; sNum++) {
        const seatName = `${row}${sNum}`;
        const seat = document.createElement("div");
        seat.className = "seat";
        seat.innerText = seatName;
        
        if (isPremiumRow) {
          seat.classList.add("premium-row");
        }

        // Check if pre-booked
        if (preOccupiedSeats.includes(seatName)) {
          seat.classList.add("occupied");
        } else {
          // Add click listener
          seat.addEventListener("click", () => {
            handleSeatClick(seat, seatName);
          });
        }
        
        seatingGrid.appendChild(seat);
      }
    });
  }

  function handleSeatClick(seatElement, seatName) {
    const seatIndex = bookingState.selectedSeats.indexOf(seatName);
    
    if (seatIndex > -1) {
      // Seat already selected, remove it
      bookingState.selectedSeats.splice(seatIndex, 1);
      seatElement.classList.remove("selected");
    } else {
      // Add seat if we haven't hit the target quantity
      if (bookingState.selectedSeats.length < bookingState.ticketQty) {
        bookingState.selectedSeats.push(seatName);
        seatElement.classList.add("selected");
      } else {
        // Already at limit, swap the oldest selection
        const oldSeatName = bookingState.selectedSeats.shift();
        const oldSeatElement = Array.from(seatingGrid.children).find(
          c => c.innerText === oldSeatName
        );
        if (oldSeatElement) {
          oldSeatElement.classList.remove("selected");
        }
        
        bookingState.selectedSeats.push(seatName);
        seatElement.classList.add("selected");
      }
    }

    // Enable next button only if exactly the correct number of seats are selected
    if (bookingState.selectedSeats.length === bookingState.ticketQty) {
      nextTo3Btn.disabled = false;
    } else {
      nextTo3Btn.disabled = true;
    }
  }

  // --- STAGE 3: PRICING ENGINE (US-003) ---
  function computePricing() {
    let baseSum = 0;
    
    // Calculate based on actual rows clicked
    bookingState.selectedSeats.forEach(seat => {
      const rowLetter = seat.charAt(0);
      const rowIdx = rows.indexOf(rowLetter);
      if (rowIdx >= standardRowsCount) {
        baseSum += premiumPrice;
      } else {
        baseSum += standardPrice;
      }
    });

    bookingState.baseTotal = baseSum;
    bookingState.taxTotal = parseFloat((baseSum * 0.18).toFixed(2)); // 18% GST

    // Apply bulk discount: 10% off base total for bookings with 4 or more tickets
    if (bookingState.ticketQty >= 4) {
      bookingState.discountTotal = parseFloat((baseSum * 0.10).toFixed(2));
      discountRow.style.display = "table-row";
    } else {
      bookingState.discountTotal = 0;
      discountRow.style.display = "none";
    }

    bookingState.netTotal = parseFloat(
      (bookingState.baseTotal + bookingState.taxTotal - bookingState.discountTotal).toFixed(2)
    );

    // Populate Invoice UI
    invoiceName.innerText = bookingState.customerName;
    invoiceEmail.innerText = bookingState.customerEmail;
    invoiceMovie.innerText = bookingState.selectedMovie;
    invoiceTheater.innerText = bookingState.selectedTheater;
    invoiceSeats.innerText = bookingState.selectedSeats.join(", ");
    invoiceQty.innerText = bookingState.ticketQty;
    invoiceBaseRate.innerText = bookingState.basePriceRate;
    invoiceBaseTotal.innerText = bookingState.baseTotal.toFixed(2);
    invoiceTax.innerText = bookingState.taxTotal.toFixed(2);
    invoiceDiscount.innerText = bookingState.discountTotal.toFixed(2);
    invoiceNetTotal.innerText = bookingState.netTotal.toFixed(2);

    // Set dynamic Pega Queue routing based on Show Type (Premium vs Standard)
    const routingQueue = bookingState.ticketCategory === "Premium" ? "Premium ShowQueue" : "Standard ShowQueue";
    document.getElementById("invoice-routing").innerText = routingQueue;
  }

  nextTo3Btn.addEventListener("click", () => {
    computePricing();
    transitionToStage(3);
  });

  // --- STAGE 4: CONFIRMATION DISPATCH ---
  confirmBookingBtn.addEventListener("click", () => {
    // Populate success screen
    confTransId.innerText = bookingState.caseId;
    confMovie.innerText = bookingState.selectedMovie;
    confTheater.innerText = bookingState.selectedTheater;
    confSeats.innerText = bookingState.selectedSeats.join(", ");
    confAmount.innerText = bookingState.netTotal.toFixed(2);

    // Set Routing Work Queue label in confirmation summary
    const routingQueue = bookingState.ticketCategory === "Premium" ? "Premium ShowQueue" : "Standard ShowQueue";
    document.getElementById("conf-routing").innerText = routingQueue;

    transitionToStage(4);
  });

  // --- RESTART / RESET FLOW ---
  restartFlowBtn.addEventListener("click", () => {
    // Regenerate Case reference ID
    bookingState.caseId = generateCaseId();
    document.getElementById("case-ref").innerText = bookingState.caseId;

    // Clear form inputs
    requestForm.reset();
    
    // Reset dynamic poster card
    moviePosterCard.className = "movie-poster-card empty";
    posterArt.innerHTML = '<span class="poster-icon">🎬</span>';
    posterTitle.innerText = "Select a Movie";
    posterGenre.innerText = "-";
    posterCast.innerText = "-";
    posterRelease.innerText = "-";

    // Clear selection highlights on now showing gallery cards
    nowShowingCards.forEach(c => c.classList.remove("active-selection"));

    // Clear seat selection array
    bookingState.selectedSeats = [];
    
    // Go to Stage 1
    transitionToStage(1);
  });

  // Nav backing buttons
  backTo1Btn.addEventListener("click", () => transitionToStage(1));
  backTo2Btn.addEventListener("click", () => transitionToStage(2));

});
