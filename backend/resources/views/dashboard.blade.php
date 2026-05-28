@extends('layouts.app')

@section('title', 'Dashboard - MyApp')

@section('content')
<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div style="text-align: center; max-width: 400px; padding: 2rem;">

        @if (session('success'))
            <div class="alert alert-success" style="margin-bottom: 1.5rem;">{{ session('success') }}</div>
        @endif

        <div style="font-size: 48px; margin-bottom: 1rem;">👋</div>
        <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 8px;">
            Halo, {{ Auth::user()->name }}!
        </h1>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 2rem;">
            Anda berhasil masuk menggunakan akun <strong>{{ Auth::user()->email }}</strong>
        </p>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="btn-primary" style="max-width: 200px; margin: 0 auto;">
                Keluar
            </button>
        </form>
    </div>
</div>
@endsection
