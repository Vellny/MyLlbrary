<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'MyLibrary')</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #f5f5f0;
            color: #1a1a1a;
            min-height: 100vh;
        }

        /* ── Alert ── */
        .alert {
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
        }
        .alert-success { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; }
        .alert-danger  { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

        /* ── Auth card ── */
        .auth-wrap {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
        }

        .auth-card {
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            padding: 2rem 2.25rem 2.25rem;
            width: 100%;
            max-width: 420px;
        }

        .auth-card h1 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .auth-card .subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 1.75rem;
        }

        /* ── Form ── */
        .field { margin-bottom: 1rem; }

        .field label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 6px;
        }

        .field input[type="email"],
        .field input[type="password"],
        .field input[type="text"] {
            width: 100%;
            height: 40px;
            padding: 0 12px;
            font-size: 14px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.15s;
            background: #fff;
            color: #1a1a1a;
        }

        .field input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .field input.is-invalid { border-color: #ef4444; }

        .invalid-feedback {
            display: block;
            font-size: 12px;
            color: #ef4444;
            margin-top: 4px;
        }

        /* ── Checkbox ── */
        .check-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
        }

        .check-row label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; cursor: pointer; }
        .check-row a { font-size: 13px; color: #6366f1; text-decoration: none; }
        .check-row a:hover { text-decoration: underline; }

        /* ── Buttons ── */
        .btn-primary {
            display: block;
            width: 100%;
            height: 42px;
            background: #1a1a1a;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.15s, transform 0.1s;
            margin-bottom: 1rem;
        }

        .btn-primary:hover  { opacity: 0.85; }
        .btn-primary:active { transform: scale(0.985); }

        .divider {
            display: flex; align-items: center; gap: 10px;
            margin-bottom: 1rem;
            font-size: 12px;
            color: #9ca3af;
        }
        .divider::before, .divider::after {
            content: ''; flex: 1;
            height: 1px; background: #e5e7eb;
        }

        .footer-link {
            text-align: center;
            font-size: 13px;
            color: #6b7280;
            margin-top: 1.5rem;
        }
        .footer-link a { color: #1a1a1a; font-weight: 500; text-decoration: none; }
        .footer-link a:hover { text-decoration: underline; }

        /* Social Buttons */
        .social-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 1rem;
        }
        .btn-social {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 40px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #fff;
            font-size: 13px;
            font-weight: 500;
            color: #374151;
            text-decoration: none;
            transition: background 0.15s;
        }
        .btn-social:hover { background: #f9fafb; }
        .btn-social svg { width: 18px; height: 18px; }
    </style>
</head>
<body>
    @yield('content')
</body>
</html>
