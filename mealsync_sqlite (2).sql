
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
    staff_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff'
        CHECK (role IN ('staff', 'admin')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_available INTEGER NOT NULL DEFAULT 1
        CHECK (is_available IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL
        CHECK (payment_method IN ('GCash', 'Cash')),
    payment_status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (payment_status IN ('Pending', 'For Verification', 'Paid', 'Rejected')),
    order_status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (order_status IN ('Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled')),
    order_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    item_name_snapshot TEXT NOT NULL,
    unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total NUMERIC NOT NULL CHECK (line_total >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL UNIQUE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('GCash', 'Cash')),
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (payment_status IN ('Pending', 'For Verification', 'Paid', 'Rejected')),
    reference_number TEXT,
    verified_by INTEGER,
    verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES staff(staff_id)
);

CREATE INDEX IF NOT EXISTS idx_orders_student_date
    ON orders(student_id, order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status
    ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order
    ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status
    ON payments(payment_status);

INSERT OR IGNORE INTO menu_items (item_id, item_name, price, image_url) VALUES
(1, 'Chicken Rice', 55.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYYe1NBkjCd9i0b3Gf2gFd5I629K_dTto0hFCFXL_Rw&s=10'),
(2, 'Burger', 45.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf4Cp0ujfQBCZMVS4H0w1hTMDehpbodq3qc2Xmi4O42A&s=10'),
(3, 'Spaghetti', 50.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1XjZtVoacDBjhSVT0UVQKq2ZAsOhP8xZ3_xUuvtjnVg&s=10'),
(4, 'Fried Rice', 40.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX4m77RqZ7RCPZZqvXMjWKMe4cq0hMVB0Hc8Gp7BO5vQ&s=10'),
(5, 'French Fries', 35.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7rDcQDXpFHX9wIq_zW2LADO45VSgSnOsvBVqNmkfdbw&s=10'),
(6, 'Iced Tea', 25.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LYsuyapvC5fK9NCmUMOs8wK8SrkvoToMo-wTu0wZ9Q&s=10'),
(7, 'Bottled Water', 15.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj-sSHWkyL-BX4H_7Szub3wUXq3XtlM2Au-Gf_6xAy9g&s=10');
