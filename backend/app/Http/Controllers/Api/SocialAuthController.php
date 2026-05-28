<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect ke provider social
     */
    public function redirectToProvider($provider)
    {
        try {
            return Socialite::driver($provider)->stateless()->redirect();
        } catch (Exception $e) {
            \Log::error("Social Auth Redirect Error: " . $e->getMessage());
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=social_config_error');
        }
    }

    /**
     * Handle callback dari provider social
     */
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (Exception $e) {
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=social_auth_failed');
        }

        $user = User::where($provider . '_id', $socialUser->getId())
            ->orWhere('email', $socialUser->getEmail())
            ->first();

        if ($user) {
            // Update social ID jika belum ada
            if (!$user->{$provider . '_id'}) {
                $user->update([
                    $provider . '_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            }
        } else {
            // Buat user baru
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                $provider . '_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar(),
                'password' => null, // Social login tidak butuh password
            ]);
        }

        Auth::login($user);

        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/');
    }
}
