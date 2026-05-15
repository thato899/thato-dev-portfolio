<?php
session_start();

// Simple hardcoded credentials for now (change password after first login)
$valid_username = 'admin';
$valid_password_hash = password_hash('admin123', PASSWORD_DEFAULT);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if ($_POST['username'] === 'admin' && $_POST['password'] === 'admin123') {
        $_SESSION['admin_logged_in'] = true;
        header('Location: index.php');
        exit();
    } else {
        $error = "Invalid credentials";
    }
}

if (!isset($_SESSION['admin_logged_in'])) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Admin Login</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .login-box {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.2);
                width: 300px;
            }
            h2 { text-align: center; margin-bottom: 20px; }
            input {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            button {
                width: 100%;
                padding: 10px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .error { color: red; text-align: center; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>Portfolio Admin</h2>
            <?php if (isset($error)) echo "<div class='error'>$error</div>"; ?>
            <form method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit" name="login">Login</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Portfolio Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
        }
        .header {
            background: #333;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
        }
        .container {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 20px;
        }
        .card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 { margin-bottom: 20px; }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        button {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover { background: #5a67d8; }
        .logout-btn {
            background: #e53e3e;
            text-decoration: none;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
        }
        .project-item, .event-item {
            background: #f9f9f9;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .delete-btn {
            background: #e53e3e;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Portfolio Admin Dashboard</h1>
        <a href="logout.php" class="logout-btn">Logout</a>
    </div>
    
    <div class="container">
        <div class="card">
            <h2>Add New Project</h2>
            <form id="projectForm">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="proj_title" required>
                </div>
                <div class="form-group">
                    <label>Short Description</label>
                    <textarea id="proj_desc" rows="2" required></textarea>
                </div>
                <div class="form-group">
                    <label>Tech Stack (comma separated)</label>
                    <input type="text" id="proj_tech" placeholder="React, PHP, MySQL">
                </div>
                <div class="form-group">
                    <label>Live URL</label>
                    <input type="url" id="proj_url">
                </div>
                <button type="button" onclick="addProject()">Add Project</button>
            </form>
        </div>
        
        <div class="card">
            <h2>Add New Event</h2>
            <form id="eventForm">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="event_title" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="event_desc" rows="2" required></textarea>
                </div>
                <div class="form-group">
                    <label>Full Story</label>
                    <textarea id="event_story" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="event_date">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" id="event_location">
                </div>
                <button type="button" onclick="addEvent()">Add Event</button>
            </form>
        </div>
        
        <div class="card">
            <h2>Current Projects</h2>
            <div id="projectsList"></div>
        </div>
        
        <div class="card">
            <h2>Current Events</h2>
            <div id="eventsList"></div>
        </div>
    </div>
    
    <script>
        async function loadProjects() {
            const res = await fetch('/backend/api/projects.php');
            const projects = await res.json();
            const container = document.getElementById('projectsList');
            container.innerHTML = projects.map(p => `
                <div class="project-item">
                    <div>
                        <strong>${p.title}</strong>
                        <p style="margin-top:5px">${p.description}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteProject(${p.id})">Delete</button>
                </div>
            `).join('');
        }
        
        async function addProject() {
            const data = {
                title: document.getElementById('proj_title').value,
                description: document.getElementById('proj_desc').value,
                tech_stack: document.getElementById('proj_tech').value,
                live_url: document.getElementById('proj_url').value,
                display_order: 0
            };
            
            const res = await fetch('/backend/api/projects.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (res.ok) {
                alert('Project added!');
                document.getElementById('projectForm').reset();
                loadProjects();
            }
        }
        
        async function deleteProject(id) {
            if (confirm('Delete this project?')) {
                await fetch(`/backend/api/projects.php?id=${id}`, {method: 'DELETE'});
                loadProjects();
            }
        }
        
        async function loadEvents() {
            const res = await fetch('/backend/api/events.php');
            const events = await res.json();
            const container = document.getElementById('eventsList');
            container.innerHTML = events.map(e => `
                <div class="project-item">
                    <div>
                        <strong>${e.title}</strong>
                        <p style="margin-top:5px">${e.description}</p>
                        <small>${e.event_date} | ${e.location}</small>
                    </div>
                    <button class="delete-btn" onclick="deleteEvent(${e.id})">Delete</button>
                </div>
            `).join('');
        }
        
        async function addEvent() {
            const data = {
                title: document.getElementById('event_title').value,
                description: document.getElementById('event_desc').value,
                story: document.getElementById('event_story').value,
                event_date: document.getElementById('event_date').value,
                location: document.getElementById('event_location').value,
                category: 'Community Outreach',
                display_order: 0
            };
            
            const res = await fetch('/backend/api/events.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (res.ok) {
                alert('Event added!');
                document.getElementById('eventForm').reset();
                loadEvents();
            }
        }
        
        async function deleteEvent(id) {
            if (confirm('Delete this event?')) {
                await fetch(`/backend/api/events.php?id=${id}`, {method: 'DELETE'});
                loadEvents();
            }
        }
        
        loadProjects();
        loadEvents();
    </script>
</body>
</html>
