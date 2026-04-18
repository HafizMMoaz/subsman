<?php

$lang = "en";
if (isset($_COOKIE['language'])) {
    $selectedLanguage = $_COOKIE['language'];

    if (array_key_exists($selectedLanguage, $languages)) {
        $lang = $selectedLanguage;
    }
}

function translate($text, $translations)
{
    if (array_key_exists($text, $translations)) {
        return str_replace(['Subsman', 'subsman'], ['Subsman', 'subsman'], $translations[$text]);
    } else {
        require 'en.php';
        if (array_key_exists($text, $i18n)) {
            return str_replace(['Subsman', 'subsman'], ['Subsman', 'subsman'], $i18n[$text]);
        } else {
            return "[i18n String Missing]";
        }
    }
}

?>