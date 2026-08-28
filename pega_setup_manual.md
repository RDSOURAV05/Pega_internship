# Pega Academy Environment Setup & Configuration Guide
### 🚀 Step-by-Step Project Configuration Manual

Follow this guide to set up your application scaffold using Pega Blueprint and complete the user story configurations inside your active Pega Academy student instance.

---

## 🛠️ Step 1: Generate Scaffold in Pega Blueprint
1. Open your web browser and navigate to **[pega.com/blueprint](https://www.pega.com/blueprint)** (or log in via the Pega Blueprint portal).
2. Click **Create New Blueprint**.
3. Fill in the application metadata:
   *   **Application Name:** `Movie Ticket Reservation`
   *   **Case Type Name:** `Movie Ticket Request` (Exact spelling)
4. Define the **Case Lifecycle Stages** inside the Blueprint designer:
   *   Stage 1: `Initial Stage`
   *   Stage 2: `Availability`
   *   Stage 3: `Approval`
   *   Stage 4: `Booking Execution`
5. Define the **Data Objects**:
   *   `Movie` (Fields: Title, Cast, Genre, Release Date)
   *   `Show` (Fields: Location, Date, Showtime, Price Category)
6. Click **Generate Blueprint** and download the completed `.json` configuration file to your computer.

---

## 📥 Step 2: Import Blueprint into Pega Academy Instance
1. Log into your designated Pega Academy Exercise System course.
2. Click the **Launch Exercise** button to open your cloud sandbox instance.
3. In the application header dropdown, select **New Application**.
4. Choose **Build from Pega Blueprint**.
5. Upload the `.json` file you downloaded in Step 1. Pega will automatically generate your case type scaffold with the stages pre-configured!

---

## ⚙️ Step 3: Configure Case Lifecycle & Rules in App Studio
Switch to **App Studio** using the navigation panel on the left:

### 1. Configure the Fields (US-001)
1. Go to **Case Types** $\rightarrow$ **Movie Ticket Request** $\rightarrow$ **Workflow** $\rightarrow$ **Initial Stage**.
2. Click the **Submit Movie Ticket Request** step.
3. Click **Configure View** to add the input fields:
   *   `Customer Name` (Text)
   *   `Customer Email` (Email)
   *   `Movie Name` (PickList linked to Movie Data Object)
   *   `Theater Location` (PickList)
   *   `Ticket Category` (Standard / Premium Dropdown)
   *   `Ticket Quantity` (Integer)

### 2. Configure seat availability view (US-002)
1. In the **Availability Stage**, select the seat configuration step.
2. Drag in a user view layout and add an interactive table/grid displaying available seat coordinates (e.g. Rows A-F, Seats 1-8).

### 3. Implement Cost Calculations (US-003)
1. Go to your calculated properties panel or use a **Data Transform** rule:
2. Configure the formula for `Total Cost`:
   *   `TotalCost` = `(Quantity * BaseRate) * 1.18` (including 18% GST).
   *   Add a conditional block: if `Quantity >= 4`, subtract `(Quantity * BaseRate) * 0.10` (10% bulk discount).

### 4. Configure SLA Logic
1. Open the **Movie Ticket Request** Case Type.
2. In the right panel, select the **Settings** tab $\rightarrow$ Click **Goal and Deadline (SLA)**.
3. Configure the SLA values:
   *   **Goal:** `1` Day
   *   **Deadline:** `2` Days
4. Save the settings.

### 5. Configure Work Queue Routing
1. In the **Approval Stage** step properties panel, scroll down to the **Routing** section.
2. Select **Route to Work Queue**.
3. Add a routing validation condition:
   *   If `Ticket Category` equals `Premium`, Route to: `Premium ShowQueue`.
   *   Otherwise, Route to: `Standard ShowQueue`.

### 6. Configure Email Correspondence
1. In the **Booking Execution Stage**, add a new **Send Email** step.
2. Click **Configure Email**.
3. Set the recipient field to your property `.CustomerEmail`.
4. Compose the confirmation email template containing reference parameters: `.pyID` (Transaction ID), `.MovieName`, and `.TotalCost`.
