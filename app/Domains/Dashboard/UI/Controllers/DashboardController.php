<?php

declare(strict_types=1);

namespace App\Domains\Dashboard\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Dashboard\Application\Queries\ActivityFeedQuery;
use App\Domains\Dashboard\Application\Queries\DashboardMetricsQuery;
use App\Shared\Domain\Support\ActivityFeedPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

final class DashboardController
{
    public function index(DashboardMetricsQuery $query, ActivityFeedQuery $feedQuery): InertiaResponse|RedirectResponse
    {
        $user = Auth::user();

        if ($user instanceof User && $user->teacher_id !== null && $user->professional_id === null && ! $user->isAdmin()) {
            return redirect()->route('teacher-portal.index');
        }

        return Inertia::render('Dashboard/Overview/Index', [
            ...$query->execute(),
            'activityFeed' => [
                ...ActivityFeedPresenter::page($feedQuery->execute($user), $user),
                'modelOptions' => ActivityFeedPresenter::modelOptions(),
            ],
        ]);
    }

    public function activityFeed(Request $request, ActivityFeedQuery $query): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $logs = $query->execute(
            $user,
            $request->only(['model', 'period']),
            (int) $request->integer('page', 1),
        );

        return response()->json(ActivityFeedPresenter::page($logs, $user));
    }
}
