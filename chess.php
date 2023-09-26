<?php
// Đường dẫn đến thư mục chứa động cơ cờ vua
$enginePath = "BaseBook.obk";

// Lệnh để khởi động động cơ cờ vua
$command = $enginePath . ' uci' . PHP_EOL;;
// $command = $enginePath;

// Mở một kết nối đến động cơ cờ vua
$uci = popen('BaseBook.obk', 'r');

if ($uci === false) {
    die('Không thể mở kết nối đến động cơ cờ vua.');
}
echo 'Đã kết nối đến engine.' . PHP_EOL;
// Gửi lệnh UCI
// fwrite($uci, 'uci' . PHP_EOL);

// Đọc và xử lý phản hồi từ động cơ cờ vua
while (!feof($uci)) {
    $response = fgets($uci);

    // Xử lý phản hồi ở đây, ví dụ: in ra màn hình
    echo $response;

    // Dừng vòng lặp sau khi nhận được dòng 'uciok'
    // if (strpos($response, 'uciok') !== false) {
    //     fwrite($uci, 'go movetime 1000' . PHP_EOL);
    // }
    // if (strpos($response, 'bestmove') !== false) {
    //     break;
    // }
}

// Đóng kết nối đến động cơ cờ vua
fclose($uci);
