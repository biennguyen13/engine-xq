<?php
function runEngine()
{
    $descr = array(
        0 => array("pipe", "r"),
        1 => array("pipe", "w"),
    );

    $pipes = array();

    $process = proc_open('BaseBook.obk', $descr, $pipes);

    if (is_resource($process)) {
        $write = $pipes[0];
        $read = $pipes[1];
        $arr = [];

        while (!feof($read)) {

            $data = fgets($read);
            if ($data) {
                echo $data;
            }
        }

        fclose($write);
        fclose($read);
        proc_close($process);
    }
}

runEngine();
