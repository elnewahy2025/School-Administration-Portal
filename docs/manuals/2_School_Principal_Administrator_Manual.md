# User Manual: School Principal & Administrator

> **Role Key:** `school_admin`  
> **Access Scope:** Complete operational control over the school tenant, settings, staff accounts, circulars, maintenance triage, calendar scheduling, and compliance analytics.

---

## 1. Introduction

As a **School Administrator / Principal**, you manage the day-to-day academic and facilities governance of your campus. 

This manual guides you through configuring your school from a completely blank portal to conducting active daily operations.

---

## 2. Phase 1: First-Time Setup from an Empty Portal

When you log into your newly provisioned school account for the first time, your portal is clean and unpopulated. Follow this chronological order to initialize your campus:

```
Step 1: School Profile & Workweek  ➔  Step 2: Campus Locations  ➔  Step 3: Departments  ➔  Step 4: Staff Accounts
```

### Step 1: School Profile, Workweek & Date Preferences
1. In the sidebar, navigate to **Settings > School Profile** (`/settings/school`).
2. Enter your institution's core details:
   - **School Name:** Arabic and English official legal names.
   - **School Type:** Primary, Middle, Secondary, or Combined.
   - **Educational Zone / Governorate:** (e.g., العاصمة, حولي).
   - **Vision & Mission Statements:** Used across public portals and staff dashboards to reinforce campus values.
   - **Official Contact Info:** Phone number, official email, physical street address, and website URL.
   - **School Crest / Logo:** Upload your official emblem (PNG, JPG, SVG up to 5MB).
3. **Academic Workweek & Operating Schedule:**
   - Under **Weekly Working Days**, check the operating days of your school (in Gulf/Kuwait schools: check **Sunday through Thursday**, leaving Friday and Saturday unchecked).
4. **Date Display Format:**
   - Choose your preferred date formatting standard (e.g., `YYYY-MM-DD` ISO standard, `DD/MM/YYYY` Day/Month/Year, or `MM/DD/YYYY`).
5. Click **Save School Profile**.

---

### Step 2: Setting Up Campus Locations & Facilities
Before staff can report broken equipment or book rooms, you must register campus facilities.
1. In the sidebar, go to **Settings > Locations** (`/settings/locations`).
2. Click **Add Location** (`+ إضافة موقع جديد`).
3. Create entries for your physical spaces:
   - **Main Buildings:** (e.g., `مبنى الإدارة`, `الجناح الأكاديمي أ`, `المختبرات`).
   - **Specific Rooms / Spaces:** (e.g., `غرفة المعلمين 101`, `مختبر الكيمياء الرئيسي`, `الصالة الرياضية`).
4. These entries immediately populate dropdowns in the Maintenance module and School Calendar.

---

### Step 3: Setting Up Academic & Administrative Departments
1. Navigate to **Settings > Departments** (`/settings/departments`).
2. Click **Add Department** (`+ إضافة قسم جديد`).
3. Add your departments:
   - Mathematics Department (`قسم الرياضيات`)
   - Science Department (`قسم العلوم`)
   - Arabic Language Department (`قسم اللغة العربية`)
   - Facilities & Maintenance (`قسم الصيانة والخدمات`)
   - Student Affairs (`قسم شؤون الطلاب`)
4. *(Optional at this stage)*: Once staff accounts are created, you will return here to designate each department's **Department Head**.

---

### Step 4: Provisioning Staff & Assigning Roles
Staff accounts are managed strictly by the school administration—there is no public self-signup.
1. Navigate to **Settings > Users & Roles** (`/settings/users`).
2. Click **Add User** (`+ إضافة مستخدم جديد`).
3. Fill in the staff member's credentials:
   - **Full Name:** Official faculty name.
   - **Email:** School email address.
   - **Initial Password:** Secure temporary password.
   - **Assigned Department:** Link the user to their academic department.
   - **Role:** Select the appropriate role:
     - `department_head`: Head of Department (can respond to circulars and manage departmental staff).
     - `staff`: Teacher or general staff member.
     - `operator`: Maintenance technician.
     - `school_admin`: Assistant Principal or Administrative Deputy.
4. Save the user. Inform the staff member of their login details.

---

## 3. Phase 2: Daily Operations

### 1. Issuing Administrative Circulars (`/circulars`)
Circulars replace paper memos with verifiable, trackable digital directives.

#### How to Issue a New Circular:
1. Go to **Administrative Circulars > New Circular** (`/circulars/new`).
2. Enter the details:
   - **Title (Arabic):** Clear title (e.g., `الجدول الموحد لاختبارات منتصف الفصل الدراسي`).
   - **Priority:** Low, Normal, High, or Urgent.
   - **Due Date:** Deadline for acknowledgment or response.
   - **Target Audience:**
     - Broadcast **School-Wide** (`الجميع`), or
     - Target specific **Departments** (e.g., only Science and Mathematics).
   - **Response Requirement:**
     - **Acknowledgement:** Confirms that the recipient read and understood the circular.
     - **Approval / Formal Feedback:** Requires written comments or status sign-off.
   - **Attachments:** Drag and drop official guidelines, PDF timetables, or images (up to 25MB).
3. Click **Publish Circular**.
4. The system immediately broadcasts **Real-Time Push Notifications** over WebSockets to all targeted users.

#### Monitoring Compliance in Real Time:
- Open any published circular (`/circulars/[id]`).
- The **Recipient Progress Bar** displays real-time statistics: e.g., `7 of 10 departments responded`.
- View the **Responded Departments** and **Pending Departments** lists to identify who has not yet acknowledged the directive.

---

### 2. Triaging & Assigning Maintenance Work Orders (`/maintenance`)
When teachers or staff report broken air conditioning, plumbing leaks, or electrical failures:
1. Navigate to **Maintenance & Services** (`/maintenance`).
2. New requests arrive with the status `pending` (`قيد الانتظار`).
3. Click on the ticket to inspect details and any attached photos.
4. Click **Assign Operator**:
   - Select an available technician from your facilities staff.
   - Set the priority: `Emergency`, `Urgent`, `Normal`, or `Low`.
5. The assigned technician receives an instant in-app notification to begin work.
6. Once the technician marks the repair complete and uploads photographic evidence, you review the ticket and click **Close Ticket** (`إغلاق الطلب`).

---

### 3. Managing the Academic Calendar (`/calendar`)
Keep the school faculty and public informed of upcoming academic milestones.

#### Creating Recurring Faculty Meetings or Exams:
1. Go to **School Calendar > New Event** (`/calendar/new`).
2. Fill in:
   - **Title (Arabic & English):** e.g., `اجتماع الهيئة الإدارية الأسبوعي`.
   - **Start & End Time:** Specific hour or toggle **All Day Event**.
   - **Category:** Academic, Exam, Holiday, Meeting, Activity, or General Event.
   - **Visibility:**
     - **Public:** Highlighted on the public school homepage for parents and visitors.
     - **Internal:** Restricted to authenticated faculty and staff.
   - **Recurrence Engine:**
     - Select **Weekly**, **Biweekly**, or **Monthly**.
     - Set the **Repeat Until** date (e.g., end of the academic semester).
3. Click **Save Event**. The system automatically generates all recurring series instances across the calendar.

---

### 4. Executive Reports & Analytics (`/reports`)
Access to compliance analytics is strictly reserved for School Administrators and the Platform Owner.
1. Navigate to **Reports & Analytics** (`/reports`).
2. **Circulars Compliance Tab:**
   - Filter by date range or specific academic departments.
   - Review department acknowledgment rates, overdue directives, and average response times.
3. **Maintenance & SLA Tab:**
   - Inspect average repair resolution times and open work order backlogs.
4. **Exporting Data:**
   - Click **Export CSV** to download complete audit-ready records with UTF-8 BOM encoding for Excel compatibility in Arabic.
