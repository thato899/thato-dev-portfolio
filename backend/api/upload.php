<?php
require_once 'config.php';
session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $category = $_POST['category'] ?? 'projects';
    $target_dir = "../../public/uploads/$category/";
    
    // Create directory if it doesn't exist
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    // Generate unique filename
    $file_extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $filename = time() . '_' . uniqid() . '.' . $file_extension;
    $target_file = $target_dir . $filename;
    
    // Check if image file is actual image
    $check = getimagesize($_FILES['image']['tmp_name']);
    if ($check === false) {
        echo json_encode(['error' => 'File is not an image']);
        exit();
    }
    
    // Allow certain file formats
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($file_extension, $allowed_types)) {
        echo json_encode(['error' => 'Only JPG, JPEG, PNG, GIF & WEBP files are allowed']);
        exit();
    }
    
    // Upload file
    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
        $image_url = "/uploads/$category/$filename";
        
        // If project_id is provided, associate with project
        if (isset($_POST['project_id']) && $_POST['project_id'] > 0) {
            $pdo = getDB();
            $stmt = $pdo->prepare("UPDATE projects SET image_url = ? WHERE id = ?");
            $stmt->execute([$image_url, $_POST['project_id']]);
        }
        
        // If event_id is provided, associate with event
        if (isset($_POST['event_id']) && $_POST['event_id'] > 0) {
            $pdo = getDB();
            $stmt = $pdo->prepare("UPDATE events SET image_url = ? WHERE id = ?");
            $stmt->execute([$image_url, $_POST['event_id']]);
        }
        
        echo json_encode([
            'success' => true,
            'image_url' => $image_url,
            'message' => 'Image uploaded successfully'
        ]);
    } else {
        echo json_encode(['error' => 'Failed to upload image']);
    }
} else {
    echo json_encode(['error' => 'No image uploaded']);
}
?>
