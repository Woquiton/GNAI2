<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Pdf;

use Barryvdh\DomPDF\PDF;
use Exception;

final class PdfPageNumberer
{
    private const MARGIN_X = 45;

    /**
     * Rodapé padrão: linha institucional e "Página X de Y" alinhado à direita.
     *
     * @throws Exception
     */
    public static function apply(PDF $pdf): void
    {
        $pdf->render();

        $canvas = $pdf->getDomPDF()->getCanvas();

        $canvas->page_script(function (int $pageNumber, int $pageCount, $canvas, $fontMetrics): void {
            $font = $fontMetrics->getFont('helvetica', 'normal');
            $size = 8;
            $lineColor = [50 / 255, 43 / 255, 117 / 255];
            $textColor = [29 / 255, 41 / 255, 57 / 255];
            $text = "Página {$pageNumber} de {$pageCount}";
            $width = $canvas->get_width();
            $height = $canvas->get_height();
            $textWidth = $fontMetrics->getTextWidth($text, $font, $size);

            $canvas->line(self::MARGIN_X, $height - 52, $width - self::MARGIN_X, $height - 52, $lineColor, 0.75);
            $canvas->text($width - self::MARGIN_X - $textWidth, $height - 44, $text, $font, $size, $textColor);
        });
    }
}
