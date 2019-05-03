<?php 
    $serverHost = "localhost";
    $serverUsername = "if18";
    $serverPassword = "ifikas18";
    $database = "if18_gertin_pa_1";

    if($_GET["function"] == "save"){
        if(isset($_POST["score"]) && !empty($_POST["score"])){
            saveToFile($_POST["name"],$_POST["score"],$_POST["correct"],$_POST["wrong"]);
        }
    } else if($_GET["function"] == "data"){
        echo loadData();
    }

    function saveToFile($name, $score, $correct, $wrong){
        //echo "Töötab!";
        $test =  "korras";
        $mysqli = new mysqli($GLOBALS["serverHost"], $GLOBALS["serverUsername"], $GLOBALS["serverPassword"], $GLOBALS["database"]);
        $stmt = $mysqli->prepare("INSERT INTO math (playerName, score, correct, wrong) VALUES (?,?,?,?)");
        echo $mysqli->error;
        $stmt->bind_param("siii", $name, $score, $correct, $wrong);//s - string, i - integer, d - decimal
        $stmt->execute();
        $stmt->close();
        $mysqli->close();
        echo $test;
        return $test;
    }
    function loadData(){
        $notFirst = 0;
        $count = 0;
        $notice = '{"content":[';
        $mysqli = new mysqli($GLOBALS["serverHost"], $GLOBALS["serverUsername"], $GLOBALS["serverPassword"], $GLOBALS["database"]);
        $stmt = $mysqli->prepare("SELECT playerName, score, correct FROM math ORDER BY score DESC");
        echo $mysqli->error;
        $stmt->bind_result($name, $score, $correct);
        $stmt->execute();
        while($stmt->fetch()){
            if($count < 15){
                if($notFirst == 1){
                    $notice .= ",";
                    $notice .= '{"name":"'.$name.'","score":'.$score.',"correct":' .$correct .'}';
                    $count++;
                } else {
                    $notice .= '{"name":"'.$name.'","score":'.$score.',"correct":' .$correct .'}';
                    $notFirst = 1;
                    $count++;
                }
            }

        }
        $notice .= "]}";
        $stmt->close();
        $mysqli->close();
        return $notice;
    }


?>