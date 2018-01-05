<?php

require 'vendor/autoload.php';
use Mailgun\Mailgun;

# First, instantiate the SDK with your API credentials
$mg = Mailgun::create('key-3cf53a58eb9d5526635ad35d1825717e');

# Now, compose and send your message.
# $mg->messages()->send($domain, $params);

$entityBody = file_get_contents('php://input');
$j = json_decode($entityBody, true);

$mg->messages()->send('sandboxe67e59d279ac4b35a1c69c6a87c21969.mailgun.org', [
  'from'    => 'support@mg.brusnika.biz',
  'to'      => 'eugene.rupakov@gmail.com',
  'subject' => 'New easyWallet account',
  'text'    => 'This is a notice about easyWallet account creation: Account name [' . $j['name'] .']'
]);
