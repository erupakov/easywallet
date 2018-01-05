<?php
header('Access-Control-Allow-Origin: *');

$url = 'https://www.google.com/recaptcha/api/siteverify';
$entityBody = file_get_contents('php://input');
$j = json_decode($entityBody, true);
$fields = array(
            'secret'=>'6Le6ez4UAAAAAGEaFQmlgbdeamm0J3Jsls2GpxDP',
            'response'=>$j['response']
        );

//url-ify the data for the POST
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
$fields_string = rtrim($fields_string,'&');

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1);

//execute post
$result = curl_exec($ch);
print $_POST['response'];
print $result;
