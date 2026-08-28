// Pega - Movie Ticket Booking Portal - State Controller and Logic Engine

document.addEventListener("DOMContentLoaded", () => {
  
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
    if (stageNum === 4) {
      statusLabel.innerText = "Resolved-Completed";
      statusLabel.className = "status-completed";
    } else {
      statusLabel.innerText = `Stage ${stageNum}`;
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

    transitionToStage(4);
  });

  // --- RESTART / RESET FLOW ---
  restartFlowBtn.addEventListener("click", () => {
    // Regenerate Case reference ID
    bookingState.caseId = generateCaseId();
    document.getElementById("case-ref").innerText = bookingState.caseId;

    // Clear form inputs
    requestForm.reset();
    
    // Clear seat selection array
    bookingState.selectedSeats = [];
    
    // Go to Stage 1
    transitionToStage(1);
  });

  // Nav backing buttons
  backTo1Btn.addEventListener("click", () => transitionToStage(1));
  backTo2Btn.addEventListener("click", () => transitionToStage(2));

});
