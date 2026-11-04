<?php

return [
    // Minutos de inatividade real; consultas automáticas não renovam esses prazos.
    'lock_after' => (int) env('SESSION_LOCK_AFTER', 15),
    'logout_after' => (int) env('SESSION_LOGOUT_AFTER', 60),
];
