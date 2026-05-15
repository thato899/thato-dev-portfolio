<?php
session_start();

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
            align-items: center;
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
        h2 { margin-bottom: 20px; color: #333; }
        h3 { margin: 15px 0 10px 0; color: #555; }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input, textarea, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-family: Arial, sans-serif;
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
        .item-list {
            margin-top: 20px;
        }
        .item {
            background: #f9f9f9;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 4px solid #667eea;
        }
        .item-info {
            flex: 1;
        }
        .item-info strong {
            font-size: 18px;
            color: #333;
        }
        .item-info p {
            color: #666;
            margin-top: 5px;
        }
        .item-image {
            width: 80px;
            height: 80px;
            margin-right: 15px;
            border-radius: 5px;
            object-fit: cover;
        }
        .delete-btn {
            background: #e53e3e;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 10px;
        }
        .image-preview {
            max-width: 200px;
            margin-top: 10px;
            border-radius: 5px;
        }
        .upload-area {
            border: 2px dashed #667eea;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
            margin-top: 10px;
        }
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
        }
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            background: #f0f0f0;
            border-radius: 5px;
        }
        .tab.active {
            background: #667eea;
            color: white;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Portfolio Admin Dashboard</h1>
        <a href="logout.php" class="logout-btn">Logout</a>
    </div>
    
    <div class="container">
        <div class="tabs">
            <div class="tab active" onclick="showTab('projects')">Projects</div>
            <div class="tab" onclick="showTab('events')">Events</div>
            <div class="tab" onclick="showTab('upload')">Upload Images</div>
        </div>
        
        <!-- Projects Tab -->
        <div id="projects-tab" class="tab-content active">
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
                        <label>Long Description (optional)</label>
                        <textarea id="proj_long_desc" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Tech Stack (comma separated)</label>
                        <input type="text" id="proj_tech" placeholder="React, PHP, MySQL">
                    </div>
                    <div class="form-group">
                        <label>Live URL</label>
                        <input type="url" id="proj_url">
                    </div>
                    <div class="form-group">
                        <label>GitHub URL (optional)</label>
                        <input type="url" id="proj_github">
                    </div>
                    <button type="button" onclick="addProject()">Add Project</button>
                </form>
            </div>
            
            <div class="card">
                <h2>Current Projects</h2>
                <div id="projectsList" class="item-list"></div>
            </div>
        </div>
        
        <!-- Events Tab -->
        <div id="events-tab" class="tab-content">
            <div class="card">
                <h2>Add New Event</h2>
                <form id="eventForm">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="event_title" required>
                    </div>
                    <div class="form-group">
                        <label>Short Description</label>
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
                    <div class="form-group">
                        <label>Category</label>
                        <select id="event_category">
                            <option>Community Outreach</option>
                            <option>Networking</option>
                            <option>Tech Conference</option>
                            <option>Workshop</option>
                        </select>
                    </div>
                    <button type="button" onclick="addEvent()">Add Event</button>
                </form>
            </div>
            
            <div class="card">
                <h2>Current Events</h2>
                <div id="eventsList" class="item-list"></div>
            </div>
        </div>
        
        <!-- Upload Tab -->
        <div id="upload-tab" class="tab-content">
            <div class="card">
                <h2>Upload Project Image</h2>
                <form id="uploadProjectImageForm" enctype="multipart/form-data">
                    <div class="form-group">
                        <label>Select Project</label>
                        <select id="upload_project_id" required></select>
                    </div>
                    <div class="form-group">
                        <label>Choose Image</label>
                        <input type="file" id="project_image" accept="image/*" required>
                    </div>
                    <button type="button" onclick="uploadProjectImage()">Upload Image</button>
                </form>
                <div id="projectImagePreview"></div>
            </div>
            
            <div class="card">
                <h2>Upload Event Image</h2>
                <form id="uploadEventImageForm" enctype="multipart/form-data">
                    <div class="form-group">
                        <label>Select Event</label>
                        <select id="upload_event_id" required></select>
                    </div>
                    <div class="form-group">
                        <label>Choose Image</label>
                        <input type="file" id="event_image" accept="image/*" required>
                    </div>
                    <button type="button" onclick="uploadEventImage()">Upload Image</button>
                </form>
                <div id="eventImagePreview"></div>
            </div>
        </div>
    </div>
    
    <script>
        function showTab(tab) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
            event.target.classList.add('active');
        }
        
        async function loadProjects() {
            const res = await fetch('/backend/api/projects.php');
            const projects = await res.json();
            
            // Populate project select for upload
            const projectSelect = document.getElementById('upload_project_id');
            projectSelect.innerHTML = '<option value="">Select Project</option>' + 
                projects.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
            
            // Display projects list
            const container = document.getElementById('projectsList');
            container.innerHTML = projects.map(p => `
                <div class="item">
                    ${p.image_url ? `<img src="${p.image_url}" class="item-image">` : ''}
                    <div class="item-info">
                        <strong>${p.title}</strong>
                        <p>${p.description}</p>
                        ${p.tech_stack ? `<small>Tech: ${p.tech_stack}</small>` : ''}
                    </div>
                    <button class="delete-btn" onclick="deleteProject(${p.id})">Delete</button>
                </div>
            `).join('');
        }
        
        async function addProject() {
            const data = {
                title: document.getElementById('proj_title').value,
                description: document.getElementById('proj_desc').value,
                long_description: document.getElementById('proj_long_desc').value,
                tech_stack: document.getElementById('proj_tech').value,
                live_url: document.getElementById('proj_url').value,
                github_url: document.getElementById('proj_github').value,
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
            
            // Populate event select for upload
            const eventSelect = document.getElementById('upload_event_id');
            eventSelect.innerHTML = '<option value="">Select Event</option>' + 
                events.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
            
            // Display events list
            const container = document.getElementById('eventsList');
            container.innerHTML = events.map(e => `
                <div class="item">
                    ${e.image_url ? `<img src="${e.image_url}" class="item-image">` : ''}
                    <div class="item-info">
                        <strong>${e.title}</strong>
                        <p>${e.description}</p>
                        <small>${e.event_date || ''} | ${e.location || ''}</small>
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
                category: document.getElementById('event_category').value,
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
        
        async function uploadProjectImage() {
            const projectId = document.getElementById('upload_project_id').value;
            const fileInput = document.getElementById('project_image');
            
            if (!projectId) {
                alert('Please select a project');
                return;
            }
            if (!fileInput.files[0]) {
                alert('Please select an image');
                return;
            }
            
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);
            formData.append('category', 'projects');
            formData.append('project_id', projectId);
            
            const res = await fetch('/backend/api/upload.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await res.json();
            if (result.success) {
                alert('Image uploaded successfully!');
                fileInput.value = '';
                loadProjects();
            } else {
                alert('Error: ' + (result.error || 'Upload failed'));
            }
        }
        
        async function uploadEventImage() {
            const eventId = document.getElementById('upload_event_id').value;
            const fileInput = document.getElementById('event_image');
            
            if (!eventId) {
                alert('Please select an event');
                return;
            }
            if (!fileInput.files[0]) {
                alert('Please select an image');
                return;
            }
            
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);
            formData.append('category', 'events');
            formData.append('event_id', eventId);
            
            const res = await fetch('/backend/api/upload.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await res.json();
            if (result.success) {
                alert('Image uploaded successfully!');
                fileInput.value = '';
                loadEvents();
            } else {
                alert('Error: ' + (result.error || 'Upload failed'));
            }
        }
        
        // Image preview
        document.getElementById('project_image')?.addEventListener('change', function(e) {
            const preview = document.getElementById('projectImagePreview');
            if (e.target.files[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                preview.innerHTML = `<img src="${url}" class="image-preview">`;
            }
        });
        
        document.getElementById('event_image')?.addEventListener('change', function(e) {
            const preview = document.getElementById('eventImagePreview');
            if (e.target.files[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                preview.innerHTML = `<img src="${url}" class="image-preview">`;
            }
        });
        
        loadProjects();
        loadEvents();
    </script>
</body>
</html>
