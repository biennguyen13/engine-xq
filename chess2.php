<?php
function runEngine()
{
    $moves = 'c3c4 h7e7 h0g2 h9g7 i0h0 i9h9 g3g4 h9h5 b2c2 b9a7 c0e2 a9b9 d0e1';
    // Đường dẫn đến thư mục chứa động cơ cờ vua
    $enginePath = "BugChessNN_20200919_release_SSE4.exe";
    // ok, define the pipes
    $descr = array(
        0 => array("pipe", "r"),
        1 => array("pipe", "w"),
    );

    $pipes = array();

    // open the process with those pipes
    $process = proc_open($enginePath, $descr, $pipes);
    // sleep(5);
    // check if it's running
    if (is_resource($process)) {
        $write = $pipes[0];
        $read = $pipes[1];
        // send first universal chess interface command
        fwrite($write, "uci" . PHP_EOL);
        // send analysis (5 seconds) command
        fwrite($write, "position startpos moves " . $moves . PHP_EOL);
        fwrite($write, "go depth 20" . PHP_EOL);

        // close read pipe or STDOUTPUT can't be read
        // fclose($write);

        // read and print all output comes from the pipe
        $arr = [];

        while (!feof($read)) {

            // echo fgets($read);
            // var_dump($read);
            $data = fgets($read);
            if ($data) {
                echo $data;
                $matches = [];
                if (preg_match('/depth (\d+) seldepth (\d+) multipv (\d+) score (cp \-?\d+) nodes (\d+) nps (\d+) hashfull (\d+) tbhits (\d+) time (\d+) pv (.+)/', $data, $matches)) {
                    $depth = $matches[1];
                    $seldepth = $matches[2];
                    $multipv = $matches[3];
                    $score = $matches[4];
                    $nodes = $matches[5];
                    $nps = $matches[6];
                    $hashfull = $matches[7];
                    $tbhits = $matches[8];
                    $time = $matches[9];
                    $pv = $matches[10];
                    echo "=================================: \n";
                    // In ra các giá trị đã trích xuất
                    print_r([
                        "Depth: $depth\n",
                        "Seldepth: $seldepth\n",
                        "Multipv: $multipv\n",
                        "Score: $score\n",
                        "Nodes: $nodes\n",
                        "NPS: $nps\n",
                        "Hashfull: $hashfull\n",
                        "TB Hits: $tbhits\n",
                        "Time: $time\n",
                        "PV: $pv\n"
                    ]);
                }


                if (strpos($data, 'info depth') !== false) {
                    array_push($arr, $data);
                }

                if (strpos($data, 'bestmove') !== false) {
                    array_push($arr, $data);
                    // fwrite($write, "stop" . PHP_EOL);
                    break;
                }
            }

            // if (strpos($read, 'bestmove') !== false) {
            //     fwrite($write, "stop" . PHP_EOL);
            // }
        }

        // close the last opened pipe
        // fclose($write);

        // at the end, close the process
        fclose($write);
        fclose($read);
        proc_close($process);

        // print_r($arr);

        // foreach ($arr as $text) {
        //     // Sử dụng preg_match để trích xuất thông tin
        //     $matches = [];
        //     if (preg_match('/depth (\d+) seldepth (\d+) multipv (\d+) score (cp \-?\d+) nodes (\d+) nps (\d+) hashfull (\d+) tbhits (\d+) time (\d+) pv (.+)/', $text, $matches)) {
        //         $depth = $matches[1];
        //         $seldepth = $matches[2];
        //         $multipv = $matches[3];
        //         $score = $matches[4];
        //         $nodes = $matches[5];
        //         $nps = $matches[6];
        //         $hashfull = $matches[7];
        //         $tbhits = $matches[8];
        //         $time = $matches[9];
        //         $pv = $matches[10];
        //         echo "=================================: \n";
        //         // In ra các giá trị đã trích xuất
        //         print_r([
        //             "Depth: $depth\n",
        //             "Seldepth: $seldepth\n",
        //             "Multipv: $multipv\n",
        //             "Score: $score\n",
        //             "Nodes: $nodes\n",
        //             "NPS: $nps\n",
        //             "Hashfull: $hashfull\n",
        //             "TB Hits: $tbhits\n",
        //             "Time: $time\n",
        //             "PV: $pv\n"
        //         ]);
        //     }
        // }

        // print_r([$arr[count($arr) - 1]]);
    }
}

runEngine();
