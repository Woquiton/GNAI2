<?php

declare(strict_types=1);

namespace App\Domains\Dashboard\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Dashboard\Application\Queries\ActivityFeedQuery;
use App\Domains\Dashboard\Application\Queries\DashboardMetricsQuery;
use App\Domains\Dashboard\UI\Presenters\ActivityFeedPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

final class DashboardController
{
    public function __construct(private readonly ActivityFeedPresenter $feed) {}

    public function index(DashboardMetricsQuery $query, ActivityFeedQuery $feedQuery): InertiaResponse|RedirectResponse
    {
        $user = Auth::user();

        if ($user instanceof User && $user->teacher_id !== null && $user->professional_id === null && ! $user->isAdmin()) {
            return redirect()->route('teacher-portal.index');
        }

        return Inertia::render('Dashboard/Overview/Index', [
            ...$query->execute(),
            'activityFeed' => [
                ...$this->feed->page($feedQuery->execute($user), $user),
                'modelOptions' => $this->feed->modelOptions(),
            ],
        ]);
    }

    public function activityFeed(Request $request, ActivityFeedQuery $query): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $records = $query->execute(
            $user,
            $request->only(['model', 'period']),
            (int) $request->integer('page', 1),
        );

        return response()->json($this->feed->page($records, $user));
    }
}
