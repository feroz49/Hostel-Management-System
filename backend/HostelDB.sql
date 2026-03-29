-- ======================================
-- HostelDB.sql
-- ======================================

-- ------------------ CREATE DATABASE ------------------
IF DB_ID('HostelDB') IS NULL
BEGIN
    CREATE DATABASE HostelDB;
END
GO

USE HostelDB;
GO

-- ------------------ RESET EXISTING TABLES ------------------
-- Drop child tables first, then parent tables.
IF OBJECT_ID('dbo.Leave_Request', 'U') IS NOT NULL DROP TABLE dbo.Leave_Request;
IF OBJECT_ID('dbo.Maintenance', 'U') IS NOT NULL DROP TABLE dbo.Maintenance;
IF OBJECT_ID('dbo.Payment', 'U') IS NOT NULL DROP TABLE dbo.Payment;
IF OBJECT_ID('dbo.Visitor', 'U') IS NOT NULL DROP TABLE dbo.Visitor;
IF OBJECT_ID('dbo.Student', 'U') IS NOT NULL DROP TABLE dbo.Student;
IF OBJECT_ID('dbo.Room_Booking_Request', 'U') IS NOT NULL DROP TABLE dbo.Room_Booking_Request;
IF OBJECT_ID('dbo.Public_Room_Showcase', 'U') IS NOT NULL DROP TABLE dbo.Public_Room_Showcase;
IF OBJECT_ID('dbo.Room', 'U') IS NOT NULL DROP TABLE dbo.Room;
IF OBJECT_ID('dbo.Hostel_Block', 'U') IS NOT NULL DROP TABLE dbo.Hostel_Block;
IF OBJECT_ID('dbo.Fee_Structure', 'U') IS NOT NULL DROP TABLE dbo.Fee_Structure;
IF OBJECT_ID('dbo.Mess_Menu', 'U') IS NOT NULL DROP TABLE dbo.Mess_Menu;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

-- ------------------ USERS ------------------
CREATE TABLE dbo.Users (
    id INT IDENTITY(1,1) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    fullName NVARCHAR(120) NULL,
    phoneNumber NVARCHAR(30) NULL,
    passwordHash NVARCHAR(255) NOT NULL,
    jwtToken NVARCHAR(500) NULL,
    passwordResetCodeHash NVARCHAR(255) NULL,
    passwordResetExpiresAt DATETIME NULL,
    createdAt DATETIME NOT NULL CONSTRAINT DF_Users_createdAt DEFAULT GETDATE(),
    lastLogin DATETIME NULL,
    CONSTRAINT PK_Users PRIMARY KEY (id),
    CONSTRAINT UQ_Users_email UNIQUE (email)
);
GO

-- ------------------ PUBLIC ROOM SHOWCASE ------------------
CREATE TABLE dbo.Public_Room_Showcase (
    Showcase_Room_id INT NOT NULL,
    Category NVARCHAR(20) NOT NULL,
    Room_Name NVARCHAR(120) NOT NULL,
    Capacity_Label NVARCHAR(40) NOT NULL,
    Price_Min INT NOT NULL,
    Price_Max INT NOT NULL,
    Price_Unit NVARCHAR(50) NOT NULL CONSTRAINT DF_Public_Room_Showcase_Price_Unit DEFAULT '/ month',
    Description NVARCHAR(400) NOT NULL,
    Image_Url NVARCHAR(600) NOT NULL,
    Is_Available BIT NOT NULL CONSTRAINT DF_Public_Room_Showcase_Is_Available DEFAULT 1,
    Sort_Order INT NOT NULL CONSTRAINT DF_Public_Room_Showcase_Sort_Order DEFAULT 1,
    Created_At DATETIME NOT NULL CONSTRAINT DF_Public_Room_Showcase_Created_At DEFAULT GETDATE(),
    CONSTRAINT PK_Public_Room_Showcase PRIMARY KEY (Showcase_Room_id),
    CONSTRAINT CK_Public_Room_Showcase_Category CHECK (Category IN ('single', 'double', 'triple', 'shared')),
    CONSTRAINT CK_Public_Room_Showcase_Price CHECK (Price_Min > 0 AND Price_Max >= Price_Min)
);
GO

-- ------------------ ROOM BOOKING REQUEST ------------------
CREATE TABLE dbo.Room_Booking_Request (
    Booking_id INT IDENTITY(1,1) NOT NULL,
    Showcase_Room_id INT NOT NULL,
    User_id INT NOT NULL,
    Requested_At DATETIME NOT NULL CONSTRAINT DF_Room_Booking_Request_Requested_At DEFAULT GETDATE(),
    Status NVARCHAR(20) NOT NULL CONSTRAINT DF_Room_Booking_Request_Status DEFAULT 'Pending',
    CONSTRAINT PK_Room_Booking_Request PRIMARY KEY (Booking_id),
    CONSTRAINT CK_Room_Booking_Request_Status CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
    CONSTRAINT FK_Room_Booking_Request_Showcase FOREIGN KEY (Showcase_Room_id) REFERENCES dbo.Public_Room_Showcase(Showcase_Room_id),
    CONSTRAINT FK_Room_Booking_Request_User FOREIGN KEY (User_id) REFERENCES dbo.Users(id)
);
GO

-- ------------------ HOSTEL BLOCK ------------------
CREATE TABLE dbo.Hostel_Block (
    Block_id INT NOT NULL,
    Block_Name NVARCHAR(50) NOT NULL,
    Total_Rooms INT NOT NULL CONSTRAINT DF_Hostel_Block_Total_Rooms DEFAULT 0,
    CONSTRAINT PK_Hostel_Block PRIMARY KEY (Block_id),
    CONSTRAINT CK_Hostel_Block_Total_Rooms CHECK (Total_Rooms >= 0)
);
GO

-- ------------------ ROOM ------------------
CREATE TABLE dbo.Room (
    Room_id INT NOT NULL,
    Room_Number NVARCHAR(20) NOT NULL,
    Capacity INT NOT NULL,
    Current_Occupancy INT NOT NULL CONSTRAINT DF_Room_Current_Occupancy DEFAULT 0,
    Type NVARCHAR(20) NOT NULL,
    Hostel_Block INT NOT NULL,
    CONSTRAINT PK_Room PRIMARY KEY (Room_id),
    CONSTRAINT UQ_Room_Room_Number UNIQUE (Room_Number),
    CONSTRAINT CK_Room_Capacity CHECK (Capacity > 0),
    CONSTRAINT CK_Room_Current_Occupancy CHECK (Current_Occupancy >= 0 AND Current_Occupancy <= Capacity),
    CONSTRAINT FK_Room_Hostel_Block FOREIGN KEY (Hostel_Block) REFERENCES dbo.Hostel_Block(Block_id)
);
GO

-- ------------------ STUDENT ------------------
CREATE TABLE dbo.Student (
    Student_id INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Room_id INT NOT NULL,
    Guardian_Contact NVARCHAR(20) NULL,
    CONSTRAINT PK_Student PRIMARY KEY (Student_id),
    CONSTRAINT FK_Student_Room FOREIGN KEY (Room_id) REFERENCES dbo.Room(Room_id)
);
GO

-- ------------------ VISITOR ------------------
CREATE TABLE dbo.Visitor (
    Visitor_id INT NOT NULL,
    Student_id INT NOT NULL,
    Date_time_Entry DATETIME NOT NULL,
    Date_time_Exit DATETIME NULL,
    Purpose NVARCHAR(255) NOT NULL,
    CONSTRAINT PK_Visitor PRIMARY KEY (Visitor_id),
    CONSTRAINT CK_Visitor_Time CHECK (Date_time_Exit IS NULL OR Date_time_Exit >= Date_time_Entry),
    CONSTRAINT FK_Visitor_Student FOREIGN KEY (Student_id) REFERENCES dbo.Student(Student_id)
);
GO

-- ------------------ PAYMENT ------------------
CREATE TABLE dbo.Payment (
    Payment_id INT NOT NULL,
    Student_id INT NOT NULL,
    Amount INT NOT NULL,
    Payment_Date DATE NOT NULL,
    [Month] NVARCHAR(20) NOT NULL,
    CONSTRAINT PK_Payment PRIMARY KEY (Payment_id),
    CONSTRAINT CK_Payment_Amount CHECK (Amount > 0),
    CONSTRAINT FK_Payment_Student FOREIGN KEY (Student_id) REFERENCES dbo.Student(Student_id)
);
GO

-- ------------------ FEE STRUCTURE ------------------
CREATE TABLE dbo.Fee_Structure (
    Fee_id INT NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Amount INT NOT NULL,
    CONSTRAINT PK_Fee_Structure PRIMARY KEY (Fee_id),
    CONSTRAINT CK_Fee_Structure_Amount CHECK (Amount > 0)
);
GO

-- ------------------ MESS MENU ------------------
CREATE TABLE dbo.Mess_Menu (
    Menu_Id INT NOT NULL,
    [Day] NVARCHAR(20) NOT NULL,
    Meal_type NVARCHAR(20) NOT NULL,
    Items NVARCHAR(255) NOT NULL,
    CONSTRAINT PK_Mess_Menu PRIMARY KEY (Menu_Id),
    CONSTRAINT UQ_Mess_Menu_Day_Meal UNIQUE ([Day], Meal_type),
    CONSTRAINT CK_Mess_Menu_Day CHECK ([Day] IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    CONSTRAINT CK_Mess_Menu_Meal_type CHECK (Meal_type IN ('Breakfast', 'Lunch', 'Dinner'))
);
GO

-- ------------------ MAINTENANCE ------------------
CREATE TABLE dbo.Maintenance (
    Request_id INT NOT NULL,
    Room_id INT NOT NULL,
    Issue_type NVARCHAR(100) NOT NULL,
    Date_Reported DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    CONSTRAINT PK_Maintenance PRIMARY KEY (Request_id),
    CONSTRAINT CK_Maintenance_Status CHECK (Status IN ('Pending', 'In Progress', 'Completed')),
    CONSTRAINT FK_Maintenance_Room FOREIGN KEY (Room_id) REFERENCES dbo.Room(Room_id)
);
GO

-- ------------------ LEAVE REQUEST ------------------
CREATE TABLE dbo.Leave_Request (
    leave_id INT NOT NULL,
    student_id INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason NVARCHAR(255) NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    CONSTRAINT PK_Leave_Request PRIMARY KEY (leave_id),
    CONSTRAINT CK_Leave_Request_Date_Range CHECK (to_date >= from_date),
    CONSTRAINT CK_Leave_Request_Status CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
    CONSTRAINT FK_Leave_Request_Student FOREIGN KEY (student_id) REFERENCES dbo.Student(Student_id)
);
GO

-- ------------------ SUPPORTING INDEXES ------------------
CREATE INDEX IX_Room_Hostel_Block ON dbo.Room (Hostel_Block);
CREATE INDEX IX_Student_Room_id ON dbo.Student (Room_id);
CREATE INDEX IX_Visitor_Student_id ON dbo.Visitor (Student_id);
CREATE INDEX IX_Payment_Student_id ON dbo.Payment (Student_id);
CREATE INDEX IX_Maintenance_Room_id ON dbo.Maintenance (Room_id);
CREATE INDEX IX_Leave_Request_student_id ON dbo.Leave_Request (student_id);
CREATE INDEX IX_Public_Room_Showcase_Category_Sort ON dbo.Public_Room_Showcase (Category, Sort_Order);
CREATE INDEX IX_Room_Booking_Request_User_Status ON dbo.Room_Booking_Request (User_id, Status);
GO
