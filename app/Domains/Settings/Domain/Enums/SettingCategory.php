<?php

declare(strict_types=1);

namespace App\Domains\Settings\Domain\Enums;

/**
 * Categorias do módulo de Configurações. As configurações são globais da
 * instalação do Gnai (uma unidade por instalação).
 */
enum SettingCategory: string
{
    case MAIL = 'mail';
    case PDF = 'pdf';
    case BACKUP = 'backup';
    case TEACHER_ACCESS = 'teacher_access';
    case SESSION_SECURITY = 'session_security';
}
