from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter

out = Path(__file__).resolve().parents[1] / "output/pdf/Nicolas-Ruiz-Resume.pdf"
styles = getSampleStyleSheet()
navy = colors.HexColor("#071B3F")
blue = colors.HexColor("#0A67FF")
gray = colors.HexColor("#47566C")
styles.add(ParagraphStyle(name="NameNR", fontName="Helvetica-Bold", fontSize=20, leading=23, textColor=navy, spaceAfter=3))
styles.add(ParagraphStyle(name="ContactNR", fontName="Helvetica", fontSize=8.5, leading=12, textColor=gray, spaceAfter=9))
styles.add(ParagraphStyle(name="IntroNR", fontName="Helvetica", fontSize=9.2, leading=13, textColor=gray, spaceAfter=8))
styles.add(ParagraphStyle(name="SectionNR", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=blue, spaceBefore=10, spaceAfter=5))
styles.add(ParagraphStyle(name="RoleNR", fontName="Helvetica-Bold", fontSize=9.2, leading=12, textColor=navy, spaceBefore=7, spaceAfter=3))
styles.add(ParagraphStyle(name="BulletNR", fontName="Helvetica", fontSize=8.65, leading=12, textColor=gray, leftIndent=11, firstLineIndent=-8, spaceAfter=2))
styles.add(ParagraphStyle(name="SmallNR", fontName="Helvetica", fontSize=8.5, leading=12, textColor=gray, spaceAfter=3))

story = []
def p(text, style): story.append(Paragraph(text, styles[style]))
def section(text): p(text, "SectionNR")
def role(title, when): p(f"{title} <font color='#69768C'>| {when}</font>", "RoleNR")
def bullet(text): p("• " + text, "BulletNR")

p("Nicolas Ruiz", "NameNR")
p("Product Leader  |  Milton, Ontario, Canada  |  nicolasruiz@gmail.com  |  linkedin.com/in/nicolasmruiz  |  nicolasruiz.net", "ContactNR")
p("<b>20 years of professional experience, including 10 years in Agile delivery and product transformation.</b> Ten years working in Canada across banking and fintech, building on earlier experience living and working in Argentina and Colombia. I turn complex initiatives into measurable outcomes through product direction, incremental delivery and scalable operating models.", "IntroNR")
section("Professional experience")
role("Tangerine · Canada — Sr. Product Owner, Payments", "Mar 2025–present")
bullet("Delivered VISA OCT for domestic and cross-border transfers on schedule, guiding a new team through MVP and incremental delivery.")
bullet("Leading incremental implementation of Payments Canada's Real-Time Rail (RTR) capabilities.")
bullet("Created a Payments documentation hub and an AI assistant grounded in official RTR material.")
role("Scotiabank · Canada — Sr. Product Owner, Data & Analytics", "Mar 2023–Mar 2025")
bullet("Designed and implemented the operating model enabling retail banking data consolidation across nine International Banking countries.")
bullet("Built a scalable data delivery capability for enterprise KPIs and executive reporting, including the bank's Primacy metric.")
bullet("Customer profitability insights identified <b>CAD 47M in potential savings opportunities</b> from unprofitable relationships in Caribbean operations.")
role("Technisys / SoFi · Canada — Product Owner & Agile Delivery Lead (functional descriptor)", "Jul 2021–Feb 2023")
bullet("Designed and implemented an Agile delivery methodology for product discovery, prioritization and execution.")
bullet("Reduced discovery cycles from <b>5 months to 2–3 weeks</b> and improved early risk identification by <b>60%</b>.")
story.append(PageBreak())
section("Professional experience, continued")
role("Scotiabank · Canada — Product Owner & Scrum Master, Retail CRM", "May 2017–Jul 2021")
bullet("Conceived and prototyped a next-generation CRM and led its product vision, securing CAD 3M in investment from Chile and supporting the first deployment.")
bullet("Helped strengthen Agile practices on a team recognized among Scotiabank's top five Agile teams.")
role("SAP Consulting · Argentina & Colombia — Business Consultant & CoE Supervisor", "2006–2017")
p("Lived and worked in Argentina and Colombia, with regional project exposure across Peru, Mexico, Chile and Uruguay.", "SmallNR")
bullet("Redesigned procurement and reverse logistics at Claro Colombia, cutting procurement time by 66% and generating documented logistics and warehouse savings.")
bullet("Built and led an SAP support team, raising customer satisfaction from 70% to 90% and clearing a two-year backlog.")
section("Selected capabilities")
p("<b>Product:</b> Product ownership, roadmapping, backlog management, design thinking, UX discovery and impact mapping.", "SmallNR")
p("<b>Data and delivery:</b> KPI design, Power BI, Excel/VBA, process optimization, Scrum, Kanban, Agile coaching, Jira, Confluence and SharePoint.", "SmallNR")
section("Certifications")
p("Professional Agile Leadership (PAL) · Professional Scrum Master (PSM I) · Scaled Professional Scrum (SPS) — Scrum.org", "SmallNR")
p("SAP Certified Associate — Procurement &amp; Materials", "SmallNR")
section("Education")
p("Business Process Management — University of Toronto (2016–2018)", "SmallNR")
p("Accounting &amp; Finance — Universidad del Rosario (2016)", "SmallNR")
p("B.Eng. Computer Science — Universidad EAN (2009–2012)", "SmallNR")
section("Regional experience")
p("Canada: ten years of professional work. Argentina and Colombia: lived and worked. Peru, Mexico, Chile and Uruguay: regional project exposure.", "SmallNR")

def decorate(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#DFE7F2"))
    canvas.line(42, 42, letter[0]-42, 42)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(gray)
    canvas.drawString(42, 30, "Nicolas Ruiz  |  Product Leader")
    canvas.drawRightString(letter[0]-42, 30, f"{doc.page} / 2")
    canvas.restoreState()

doc = SimpleDocTemplate(str(out), pagesize=letter, rightMargin=42, leftMargin=42, topMargin=34, bottomMargin=52,
                        title="Nicolas Ruiz — Product Leader")
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
