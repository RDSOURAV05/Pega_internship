import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, color_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color_hex)
    tcPr.append(shd)

def create_element(name):
    return OxmlElement(name)

def create_attribute(element, name, value):
    element.set(qn(name), value)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def generate_report():
    doc = docx.Document()
    
    # Page setup
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        
    # Styles Setup
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)
    
    # Title Page
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_p.paragraph_format.space_before = Pt(120)
    title_p.paragraph_format.space_after = Pt(12)
    title_run = title_p.add_run("Kerala Movie Ticket Booking\nManagement Application")
    title_run.font.name = 'Arial'
    title_run.font.size = Pt(26)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79) # Navy Blue
    
    subtitle_p = doc.add_paragraph()
    subtitle_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_p.paragraph_format.space_after = Pt(200)
    subtitle_run = subtitle_p.add_run("Pega's National Internship Program\nCapstone Project Implementation Document")
    subtitle_run.font.name = 'Arial'
    subtitle_run.font.size = Pt(14)
    subtitle_run.font.italic = True
    subtitle_run.font.color.rgb = RGBColor(0x59, 0x59, 0x59)
    
    meta_p = doc.add_paragraph()
    meta_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    meta_run = meta_p.add_run("Prepared by: R. D. Sourav\nDate: August 2026\nUniversity: APJ Abdul Kalam Technological University")
    meta_run.font.name = 'Arial'
    meta_run.font.size = Pt(11)
    meta_run.font.color.rgb = RGBColor(0x7F, 0x7F, 0x7F)
    
    doc.add_page_break()
    
    # Section 1: Executive Summary
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(6)
    run = h1.add_run("1. Executive Summary")
    run.font.name = 'Arial'
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)
    
    doc.add_paragraph(
        "This project documentation report presents the architectural design, implementation strategy, "
        "and user story validation details for the Kerala Movie Ticket Booking Management Application. "
        "Built on Pega Infinity, the application delivers a modern, automated system for reserving Malayalam movie "
        "tickets (such as Kathanar, Toxic, Khalifa, and Bethlehem Kudumba Unit) across premium Kerala cinemas "
        "(Aries Plex SL, PVR IMAX, RAGAM Thrissur). "
        "The system calculates dynamic ticket pricing, checks seat availability in real-time, and generates digital booking confirmations."
    )
    
    # Section 2: Case Lifecycle & Architecture
    h2 = doc.add_heading(level=1)
    run = h2.add_run("2. Case Lifecycle Design & Architecture")
    run.font.name = 'Arial'
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)
    
    doc.add_paragraph(
        "The core case type designed is the 'Movie Booking' case. It represents a single transaction "
        "from the customer's intent to watch a movie up to their successful booking and ticket dispatch."
    )
    
    doc.add_paragraph("The case stages are configured as follows:")
    
    table = doc.add_table(rows=5, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Stage", "Steps Included", "Pega Rules Configured"]
    for i, head in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = head
        set_cell_background(cell, "1F4E79")
        set_cell_margins(cell, 150, 150, 150, 150)
        run = cell.paragraphs[0].runs[0]
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        
    stages_data = [
        ("1. Request Stage", "Submit Movie Ticket Request (Form UI)", "Collect Information Step, Section Rules, Properties"),
        ("2. Availability Stage", "Check Show Availability (Display seating plan)", "Custom Seating Grid, Flow Actions, Data Pages"),
        ("3. Calculation Stage", "Calculate Booking Cost (Pricing rules)", "Data Transforms, Decision Tables, Declare Expressions"),
        ("4. Confirmation Stage", "Generate Confirmation (Receipt generation)", "Email Notification, Resolved Status transition")
    ]
    
    for row_idx, (stage, steps, rules) in enumerate(stages_data, start=1):
        table.cell(row_idx, 0).text = stage
        table.cell(row_idx, 1).text = steps
        table.cell(row_idx, 2).text = rules
        for col_idx in range(3):
            cell = table.cell(row_idx, col_idx)
            set_cell_margins(cell, 100, 100, 150, 150)
            if row_idx % 2 == 0:
                set_cell_background(cell, "F2F2F2")
                
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Section 3: User Story Implementation
    h3 = doc.add_heading(level=1)
    run = h3.add_run("3. User Story Implementation")
    run.font.name = 'Arial'
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)
    
    # US-001
    doc.add_heading("US-001: Submit Movie Ticket Request", level=2)
    doc.add_paragraph(
        "Objective: To allow users to submit show selection details. The interface captures inputs "
        "including Movie Name, Theater Location, Date, Showtime, Ticket Category, and Quantity. "
        "Form validation prevents negative ticket entries and past show dates. Movies are loaded from the "
        "active Kerala releases catalog (e.g. Bethlehem Kudumba Unit, Toxic, Kathanar)."
    )
    
    # US-002
    doc.add_heading("US-002: Check Show Availability", level=2)
    doc.add_paragraph(
        "Objective: To query seat inventories and display an interactive seating plan. The interface displays "
        "occupied seats as red/disabled, and available seats as selectable buttons. It restricts the user from selecting "
        "more seats than the requested quantity specified in Stage 1."
    )
    
    # US-003
    doc.add_heading("US-003: Calculate Booking Cost", level=2)
    doc.add_paragraph(
        "Objective: To apply pricing logic. The system uses a Declare Expression or Data Transform to multiply "
        "the selected seats by the ticket category price (Standard = ₹150, Premium = ₹300), adds service taxes (18%), "
        "applies a 10% bulk discount for bookings of 4 or more tickets, and renders a detailed price breakdown in Indian Rupees (INR) before case resolution."
    )
    
    # Section 4: Screenshot Verification Tables
    doc.add_page_break()
    h4 = doc.add_heading(level=1)
    run = h4.add_run("4. Screenshots & Verification Checkpoints")
    run.font.name = 'Arial'
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)
    
    doc.add_paragraph(
        "The following tables provide sections for pasting the required screenshots to verify "
        "full project completion within the Pega Platform."
    )
    
    def add_screenshot_box(title, description):
        p = doc.add_paragraph()
        run = p.add_run(f"■ {title}")
        run.font.bold = True
        run.font.size = Pt(12)
        
        doc.add_paragraph(description)
        
        box_table = doc.add_table(rows=1, cols=1)
        box_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = box_table.cell(0, 0)
        set_cell_background(cell, "FAFAFA")
        set_cell_margins(cell, 1500, 1500, 1000, 1000) # Tall cell for pasting
        cell.paragraphs[0].text = "\n\n\n[ Paste Pega Screenshot Here ]\n\n\n"
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x99, 0x99, 0x99)
        cell.paragraphs[0].runs[0].font.italic = True
        
        doc.add_paragraph().paragraph_format.space_after = Pt(12)
        
    add_screenshot_box("Pega Case Lifecycle Flow Layout", "Capture the completed stage-step workflow showing Request, Availability, Calculation, and Confirmation stages in App Studio.")
    add_screenshot_box("US-001: Submit Ticket Request Screen UI", "Capture the interactive user interface displaying the form where users select their movie, location, and ticket category.")
    add_screenshot_box("US-002: Interactive Seating Map Selection", "Capture the custom visual layout showing the seating grid, with some seats booked and others highlighted during active selection.")
    add_screenshot_box("US-003: Cost Calculation Rules and Totals", "Capture the billing page showing the detailed breakdown of basic fare, tax, discounts, and final computed total.")
    add_screenshot_box("Resolved-Completed Case Status Screen", "Capture the final confirmation UI displaying a generated transaction reference ID and green checked status indicators.")
    
    # Save document
    doc.save("C:\\Users\\PRO\\OneDrive\Documents\\GitHub\\pega\\Pega_Movie_Ticket_Booking_Report.docx")
    print("Report generated successfully as Pega_Movie_Ticket_Booking_Report.docx!")

if __name__ == "__main__":
    generate_report()
