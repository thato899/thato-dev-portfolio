<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY display_order");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO projects (title, description, long_description, tech_stack, live_url, github_url, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['title'], $data['description'], $data['long_description'], $data['tech_stack'], $data['live_url'], $data['github_url'], $data['image_url'], $data['display_order']]);
    echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Project created']);
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Project deleted']);
}
?>
