<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Help;

use App\Domains\Application\Resolvers\Auth\AuthenticatedUserResolver;
use App\Domains\Application\Queries\Help\SearchHelpArticlesQuery;
use App\Domains\Application\Queries\Help\ShowHelpArticleQuery;
use App\Domains\Domain\Enums\Help\HelpCategory;
use App\Domains\Domain\ValueObjects\Help\HelpSearchTerm;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/** Central de Ajuda: artigos de uso em `resources/help`, para todo usuário autenticado. */
final class HelpController
{
    public function index(
        Request $request,
        SearchHelpArticlesQuery $query,
        AuthenticatedUserResolver $authenticatedUser,
    ): InertiaResponse {
        // O termo volta como foi digitado: aparar aqui apagaria o espaço final durante a digitação.
        $typed = Str::limit($request->string('busca')->toString(), 120, '');
        $term = HelpSearchTerm::from($typed);
        $search = $query->execute($authenticatedUser->fromRequest($request), $term);
        $counts = array_count_values(array_column($search['results'], 'category'));

        $categories = [];
        foreach (HelpCategory::cases() as $category) {
            if (isset($counts[$category->value])) {
                $categories[] = [
                    'id' => $category->value,
                    'label' => $category->label(),
                    'icon_class' => $category->iconClass(),
                    'count' => $counts[$category->value],
                ];
            }
        }

        return Inertia::render('Help/Index', [
            'filters' => ['busca' => $typed],
            'results' => $search['results'],
            'approximate' => $search['approximate'],
            'categories' => $categories,
        ]);
    }

    public function show(
        string $article,
        Request $request,
        ShowHelpArticleQuery $query,
        AuthenticatedUserResolver $authenticatedUser,
    ): InertiaResponse {
        $content = $query->execute($authenticatedUser->fromRequest($request), $article);

        abort_if($content === null, 404);

        return Inertia::render('Help/Show', ['article' => $content]);
    }
}
