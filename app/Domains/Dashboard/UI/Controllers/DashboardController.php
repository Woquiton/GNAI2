<?php

declare(strict_types=1);

namespace App\Domains\Dashboard\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Dashboard\Application\Queries\ActivityFeedQuery;
use App\Domains\Dashboard\Application\Queries\DashboardMetricsQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

final class DashboardController
{
    public function index(DashboardMetricsQuery $query, ActivityFeedQuery $feedQuery): View|RedirectResponse
    {
        $user = Auth::user();

        if ($user instanceof User && $user->teacher_id !== null && $user->professional_id === null && ! $user->isAdmin()) {
            return redirect()->route('teacher-portal.index');
        }

        return view('pages.dashboard', [
            ...$query->execute(),
            'activityFeedModels' => config('activity_feed.models', []),
            'activityFeedLogs' => $feedQuery->execute($user),
        ]);
    }

    public function activityFeed(Request $request, ActivityFeedQuery $query): View
    {
        /** @var User $user */
        $user = $request->user();

        $logs = $query->execute(
            $user,
            $request->only(['model', 'period']),
            (int) $request->integer('page', 1),
        );

        return view('pages.dashboard.partials.activity-feed-items', ['logs' => $logs]);
    }
}
