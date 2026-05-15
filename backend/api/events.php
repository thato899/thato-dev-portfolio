<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
        $stmt = $pdo->query("SELECT * FROM events ORDER BY display_order");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO events (title, description, story, event_date, location, category, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['title'], $data['description'], $data['story'], $data['event_date'], $data['location'], $data['category'], $data['display_order']]);
    echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Event created']);
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Event deleted']);
}
?>
