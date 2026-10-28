<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Actions\TeacherAccess;

use App\Domains\Auth\Domain\Exceptions\InvalidTeacherAccessToken;
use App\Domains\Auth\Domain\Models\TeacherAccessToken;
use App\Domains\Auth\Domain\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

final class ConfirmTeacherAccessTokenAction
{
    /**
     * @throws InvalidTeacherAccessToken
     * @throws Throwable
     */
    public function execute(string $rawToken): User
    {
        $hash = hash('sha256', $rawToken);

        return DB::transaction(function () use ($hash): User {
            $token = TeacherAccessToken::query()
                ->where('token_hash', $hash)
                ->lockForUpdate()
                ->first();

            if ($token === null || ! $token->isValid()) {
                throw InvalidTeacherAccessToken::make();
            }

            $token->markAsUsed();
            $token->save();

            $teacher = $token->teacher()->with('person')->firstOrFail();

            $user = User::query()->where('teacher_id', $teacher->getKey())->first();

            if ($user === null) {
                $user = User::create([
                    'name' => $teacher->person->name,
                    'email' => $teacher->person->email,
                    'password' => Hash::make(Str::random(40)),
                    'teacher_id' => $teacher->getKey(),
                    'is_admin' => false,
                ]);
            }

            return $user;
        });
    }
}
