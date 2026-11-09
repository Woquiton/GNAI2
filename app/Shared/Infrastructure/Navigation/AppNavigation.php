<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Navigation;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

final class AppNavigation
{
    public function forRequest(Request $request): array
    {
        $user = $request->user();
        if (! $user) {
            return ['entries' => [], 'currentItemKey' => null];
        }

        $groups = $this->groups();

        $entries = [];
        $currentItemKey = null;
        foreach ($groups as $groupIndex => [$title, $items]) {
            $visible = $this->visibleItems($request, $items, $currentItemKey);

            if ($visible !== [] && $title !== null) {
                $entries[] = ['key' => 'section-'.$groupIndex, 'title' => $title];
            }
            array_push($entries, ...$visible);
        }

        return compact('entries', 'currentItemKey');
    }

    /**
     * Ícone do item da sidebar ao qual um endereço pertence (ex.: empréstimo
     * em atraso → ícone de Empréstimos). Usado nas notificações; vence o item
     * cujo endereço for o prefixo mais longo do caminho.
     */
    public function iconForUrl(?string $url): ?string
    {
        $path = is_string($url) ? (parse_url($url, PHP_URL_PATH) ?: null) : null;

        if ($path === null) {
            return null;
        }

        $best = null;
        $bestLength = 0;

        foreach ($this->leafItems() as [, , $route, $iconClass]) {
            if (! is_string($route) || ! Route::has($route)) {
                continue;
            }

            $href = rtrim((string) parse_url(route($route, absolute: false), PHP_URL_PATH), '/');

            if ($href === '' || strlen($href) <= $bestLength) {
                continue;
            }

            if ($path === $href || str_starts_with($path, $href.'/')) {
                $best = $iconClass;
                $bestLength = strlen($href);
            }
        }

        return $best;
    }

    /** @return list<array<int, mixed>> itens com link, incluindo os de submenus */
    private function leafItems(): array
    {
        $leaves = [];
        $collect = function (array $items) use (&$collect, &$leaves): void {
            foreach ($items as $item) {
                if (is_array($item[6] ?? null)) {
                    $collect($item[6]);
                } else {
                    $leaves[] = $item;
                }
            }
        };

        foreach ($this->groups() as [, $items]) {
            $collect($items);
        }

        return $leaves;
    }

    /**
     * Grupos da sidebar: [título, itens]. Cada item é [chave, rótulo, rota,
     * ícone, habilidades, padrões de rota ativa, subitens opcionais].
     *
     * @return list<array{0: ?string, 1: list<array<int, mixed>>}>
     */
    private function groups(): array
    {
        // Organiza a navegação pelas tarefas do núcleo, sem expor ao usuário
        // as divisões técnicas e históricas entre AEE e Radar Inclusivo.
        return [
            [null, [
                ['dashboard', 'Dashboard', 'dashboard', 'ti-dashboard', [], ['dashboard']],
            ]],
            ['Atendimento', [
                ['students', 'Alunos', 'specialized-educational-support.students.index', 'ti-user', ['student.view'], ['specialized-educational-support.students.*', 'specialized-educational-support.guardians.*', 'specialized-educational-support.student-deficiencies.*']],
                ['support-requests', 'Solicitações de Atendimento', 'specialized-educational-support.support-requests.index', 'ti-receipt', ['support-request.view'], ['specialized-educational-support.support-requests.*']],
                ['sessions', 'Agendamentos', 'specialized-educational-support.sessions.index', 'ti-calendar', ['session.view-all', 'session.view-own'], ['specialized-educational-support.sessions.*']],
                ['waitlists', 'Fila de Espera', 'inclusive-radar.waitlists.index', 'ti-time', ['waitlist.index'], ['inclusive-radar.waitlists.*']],
                ['aee-records', 'Atendimentos Especializados', 'specialized-educational-support.aee-records.index', 'ti-book', ['aee-record.view-own', 'aee-record.view-all'], ['specialized-educational-support.aee-records.*']],
                ['pedagogical-records', 'Atendimentos Pedagógicos', 'specialized-educational-support.pedagogical-records.index', 'ti-write', ['pedagogical-record.view-own', 'pedagogical-record.view-all'], ['specialized-educational-support.pedagogical-records.*']],
            ]],
            ['Planos e acompanhamento', [
                ['case-studies', 'Estudos de Caso', 'specialized-educational-support.case-study.all', 'ti-clipboard', ['case-study.view'], ['specialized-educational-support.case-study.*', 'specialized-educational-support.students.case-studies.*']],
                ['paees', 'PAEEs', 'specialized-educational-support.paee.all', 'ti-direction-alt', ['paee.view'], ['specialized-educational-support.paee.*', 'specialized-educational-support.students.paees.*']],
                ['pei', 'PEIs', 'specialized-educational-support.pei.all', 'ti-file', ['pei.view'], ['specialized-educational-support.pei.*']],
            ]],
            ['Recursos e acessibilidade', [
                ['items', 'Itens', 'inclusive-radar.items.index', 'ti-package', ['item.index'], ['inclusive-radar.items.*']],
                ['loans', 'Empréstimos', 'inclusive-radar.loans.index', 'ti-exchange-vertical', ['loan.index'], ['inclusive-radar.loans.*']],
                ['barriers', 'Barreiras', 'inclusive-radar.barriers.index', 'ti-na', ['barrier.index'], ['inclusive-radar.barriers.*']],
            ]],
            ['Gestão do núcleo', [
                ['reports', 'Relatórios', 'reports.index', 'ti-bar-chart', ['report.index'], ['reports.*']],
                ['professionals', 'Equipe', 'specialized-educational-support.professionals.index', 'ti-id-badge', ['professional.view'], ['specialized-educational-support.professionals.*']],
                ['teachers', 'Professores', 'specialized-educational-support.teachers.index', 'ti-blackboard', ['teacher.view'], ['specialized-educational-support.teachers.*']],
                ['registrations', 'Cadastros', null, 'ti-folder', [], [], [
                    ['people', 'Pessoas', 'inclusive-radar.people.index', 'fa fa-users', ['person.view'], ['inclusive-radar.people.*']],
                    ['deficiencies', 'Perfis de Atendimento', 'specialized-educational-support.deficiencies.index', 'ti-heart', ['deficiency.view'], ['specialized-educational-support.deficiencies.*']],
                    ['positions', 'Cargos', 'specialized-educational-support.positions.index', 'ti-briefcase', ['position.view'], ['specialized-educational-support.positions.*']],
                    ['semesters', 'Semestres', 'specialized-educational-support.semesters.index', 'ti-layout-column2', ['semester.view'], ['specialized-educational-support.semesters.*']],
                    ['disciplines', 'Disciplinas', 'specialized-educational-support.disciplines.index', 'ti-agenda', ['discipline.view'], ['specialized-educational-support.disciplines.*']],
                    ['courses', 'Cursos', 'specialized-educational-support.courses.index', 'ti-medall', ['course.view'], ['specialized-educational-support.courses.*']],
                    ['accessibility-features', 'Recursos de Acessibilidade', 'inclusive-radar.accessibility-features.index', 'ti-wheelchair', ['accessibility-feature.index'], ['inclusive-radar.accessibility-features.*']],
                    ['tags', 'Etiquetas', 'inclusive-radar.tags.index', 'fa fa-tags', ['tag.index'], ['inclusive-radar.tags.*']],
                    ['barrier-categories', 'Categorias de Barreiras', 'inclusive-radar.barrier-categories.index', 'ti-layout-grid2', ['barrier-category.index'], ['inclusive-radar.barrier-categories.*']],
                    ['institutions', 'Instituições', 'inclusive-radar.institutions.index', 'ti-home', ['institution.index'], ['inclusive-radar.institutions.*']],
                    ['locations', 'Localizações', 'inclusive-radar.locations.index', 'ti-location-pin', ['location.index'], ['inclusive-radar.locations.*']],
                ]],
            ]],
            ['Comunicação', [
                ['pendencies', 'Pendências', 'specialized-educational-support.pendencies.index', 'ti-alert', ['pendency.view'], ['specialized-educational-support.pendencies.*']],
                ['publications', 'Publicações', 'inclusive-radar.publications.index', 'ti-announcement', ['publication.index'], ['inclusive-radar.publications.*']],
                ['website', 'Site', 'website.builder.edit', 'ti-world', ['website.edit'], ['website.builder.*']],
                ['notifications', 'Notificações', 'notifications.index', 'ti-bell', [], ['notifications.*']],
            ]],
            ['Sistema', [
                ['emails', 'Inbox', 'emails.index', 'ti-email', ['email.view'], ['emails.*']],
                ['settings', 'Configurações', 'settings.index', 'ti-settings', ['setting.view'], ['settings.*']],
                ['audit', 'Auditoria', 'audit.index', 'ti-shield', ['audit.index'], ['audit.*']],
                ['backups', 'Backups', 'backup.backups.index', 'ti-cloud-down', ['backup.index'], ['backup.backups.*']],
                ['help', 'Ajuda', 'help.index', 'ti-help-alt', [], ['help.*']],
                ['about', 'Sobre o Sistema', 'about-us', 'ti-info-alt', [], ['about-us']],
            ]],
        ];
    }

    /**
     * Filtra os itens pelas permissões do usuário. Itens com subitens
     * (sétima posição) só aparecem quando algum subitem estiver visível.
     *
     * @param  list<array<int, mixed>>  $items
     * @return list<array<string, mixed>>
     */
    private function visibleItems(Request $request, array $items, ?string &$currentItemKey): array
    {
        $user = $request->user();
        $visible = [];

        foreach ($items as $item) {
            [$key, $label, $route, $iconClass, $abilities, $patterns] = $item;
            $children = $item[6] ?? null;

            if (is_array($children)) {
                $visibleChildren = $this->visibleItems($request, $children, $currentItemKey);

                if ($visibleChildren !== []) {
                    $visible[] = ['key' => $key, 'label' => $label, 'iconClass' => $iconClass, 'children' => $visibleChildren];
                }

                continue;
            }

            if ($abilities !== [] && ! $user->canAny($abilities)) {
                continue;
            }

            $route = match ($key) {
                'sessions' => $user->can('session.view-all') ? $route : 'specialized-educational-support.sessions.my-sessions',
                'aee-records' => $user->can('aee-record.view-all') ? $route : 'specialized-educational-support.aee-records.my-records',
                'pedagogical-records' => $user->can('pedagogical-record.view-all') ? $route : 'specialized-educational-support.pedagogical-records.my-records',
                default => $route,
            };

            $visible[] = ['key' => $key, 'label' => $label, 'href' => route($route, absolute: false), 'iconClass' => $iconClass];
            if ($request->routeIs(...$patterns)) {
                $currentItemKey = $key;
            }
        }

        return $visible;
    }
}
