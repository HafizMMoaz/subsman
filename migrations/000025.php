<?php
// This migration adds a "disabled_to_bottom" column to the settings table.
// This migration adds the disabled_to_bottom column to settings.

$columnQuery = $db->query("SELECT * FROM pragma_table_info('settings') where name='disabled_to_bottom'");
$columnRequired = $columnQuery->fetchArray(SQLITE3_ASSOC) === false;

if ($columnRequired) {
    $db->exec('ALTER TABLE settings ADD COLUMN disabled_to_bottom BOOLEAN DEFAULT 0');
}

