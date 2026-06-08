<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\HeatsparkController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\User\UserDashboardController;
use App\Http\Controllers\User\UserSettingsController;
use App\Http\Controllers\LeadWebhookController;
use App\Http\Middleware\GuestMiddleware;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\UserMiddleware;
use Inertia\Inertia;

// Public routes — Heat Spark Energy Services website
Route::get('/', function () { return \Inertia\Inertia::render('ABetterLouHome'); })->name('home');
Route::get('/about', [HeatsparkController::class, 'about'])->name('about');
Route::get('/services', [HeatsparkController::class, 'services'])->name('services');
Route::get('/portfolio', [HeatsparkController::class, 'portfolio'])->name('portfolio');
Route::get('/contact', [HeatsparkController::class, 'contact'])->name('contact');
Route::post('/contact/submit', [HeatsparkController::class, 'submitContact'])->name('contact.submit');

// ABL reference page
Route::get('/abl', function () { return \Inertia\Inertia::render('ABetterLouHome'); })->name('abl');

// Guest routes (authentication)
Route::middleware(GuestMiddleware::class)->group(function () {
  Route::get('login', [LoginController::class, 'index'])->name('login');
  Route::get('register', [RegisterController::class, 'index'])->name('register');
});

Route::post('login', [LoginController::class, 'store'])->name('auth.login.store');
Route::post('register', [RegisterController::class, 'store'])->name('auth.register.store');
Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

// Social authentication
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');

// Admin routes
Route::middleware(AdminMiddleware::class)->group(function () {
  Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
  Route::get('admin/settings', [SettingsController::class, 'index'])->name('admin.settings');
  Route::put('admin/settings/profile', [SettingsController::class, 'updateProfile'])->name('admin.settings.updateProfile');
  Route::put('admin/settings/password', [SettingsController::class, 'updatePassword'])->name('admin.settings.updatePassword');
});

// Starter-kit compatible routes (used by existing tests)
Route::middleware('auth')->group(function () {
  Route::get('dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

  Route::get('verify-email', function () {
    return response('');
  })->name('verification.notice');

  Route::get('verify-email/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect(route('dashboard', absolute: false).'?verified=1');
  })->middleware('signed')->name('verification.verify');

  Route::get('confirm-password', function () {
    return response('');
  })->name('password.confirm');

  Route::post('confirm-password', function (Request $request) {
    $request->validate([
      'password' => ['required', 'string'],
    ]);

    if (!Hash::check($request->password, $request->user()->password)) {
      return back()->withErrors([
        'password' => 'The provided password does not match our records.',
      ]);
    }

    $request->session()->put('auth.password_confirmed_at', time());
    return redirect()->intended(route('dashboard', absolute: false));
  });

  Route::get('settings/profile', function () {
    return response('');
  });

  Route::patch('settings/profile', function (Request $request) {
    $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'email'],
    ]);

    $user = $request->user();
    $emailChanged = $request->email !== $user->email;

    $user->name = $request->name;
    if ($emailChanged) {
      $user->email = $request->email;
      $user->email_verified_at = null;
    }
    $user->save();

    return redirect('/settings/profile');
  });

  Route::delete('settings/profile', function (Request $request) {
    $request->validate([
      'password' => ['required', 'string'],
    ]);

    $user = $request->user();

    if (!Hash::check($request->password, $user->password)) {
      return back()->withErrors([
        'password' => 'The provided password is incorrect.',
      ]);
    }

    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    $user->delete();

    return redirect('/');
  });

  Route::get('settings/password', function () {
    return response('');
  });

  Route::put('settings/password', function (Request $request) {
    $request->validate([
      'current_password' => ['required', 'string'],
      'password' => ['required', 'string', 'confirmed'],
    ]);

    $user = $request->user();

    if (!Hash::check($request->current_password, $user->password)) {
      return back()->withErrors([
        'current_password' => 'The provided password does not match your current password.',
      ]);
    }

    $user->forceFill([
      'password' => Hash::make($request->password),
    ])->save();

    return redirect('/settings/password');
  });
});

Route::middleware('guest')->group(function () {
  Route::get('forgot-password', function () {
    return response('');
  })->name('password.request');

  Route::post('forgot-password', function (Request $request) {
    $request->validate([
      'email' => ['required', 'email'],
    ]);

    $status = Password::sendResetLink($request->only('email'));

    return $status === Password::RESET_LINK_SENT
      ? back()->with('status', __($status))
      : back()->withErrors(['email' => __($status)]);
  })->name('password.email');

  Route::get('reset-password/{token}', function () {
    return response('');
  })->name('password.reset');

  Route::post('reset-password', function (Request $request) {
    $request->validate([
      'token' => ['required'],
      'email' => ['required', 'email'],
      'password' => ['required', 'confirmed'],
    ]);

    $status = Password::reset(
      $request->only('email', 'password', 'password_confirmation', 'token'),
      function ($user) use ($request) {
        $user->forceFill([
          'password' => Hash::make($request->password),
          'remember_token' => Str::random(60),
        ])->save();

        event(new PasswordReset($user));
      }
    );

    return $status === Password::PASSWORD_RESET
      ? redirect()->route('login')
      : back()->withErrors(['email' => __($status)]);
  })->name('password.update');
});

// User routes (existing app structure)
Route::middleware(UserMiddleware::class)->group(function () {
  Route::get('user/settings', [UserSettingsController::class, 'index'])->name('user.settings');
  Route::put('user/settings/profile', [UserSettingsController::class, 'updateProfile'])->name('user.settings.updateProfile');
  Route::put('user/settings/password', [UserSettingsController::class, 'updatePassword'])->name('user.settings.updatePassword');
});

// Lead verification + webhook automation (used by landing page forms)
Route::prefix('api/lead')->group(function () {
  Route::post('initiate-verification', [LeadWebhookController::class, 'initiateVerification'])->name('api.lead.initiateVerification');
  Route::post('verify-code', [LeadWebhookController::class, 'verifyCode'])->name('api.lead.verifyCode');
  Route::post('resend-code', [LeadWebhookController::class, 'resendCode'])->name('api.lead.resendCode');
  Route::post('close-verification', [LeadWebhookController::class, 'closeWithoutVerification'])->name('api.lead.closeWithoutVerification');
});
