<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'id' => 1,
                'google_id' => '111664057055258418290',
                'name' => 'Zkielll',
                'email' => 'vioshil016@gmail.com',
                'avatar' => 'https://i1-e.pinimg.com/736x/51/eb/52/51eb52be09b25fa5e62142f2e4b7cbda.jpg',
                'password' => '$2y$12$XOJoYmTOzEOz6jZ1ghiPueQ0UnBL70t7obSlJUnX0Z4Ja6wJMvBBy',
                'created_at' => '2026-05-06 00:53:37',
                'updated_at' => '2026-05-21 00:44:45',
            ],
            [
                'id' => 2,
                'google_id' => '114899351489106146492',
                'name' => 'Al Thea',
                'email' => 'theaa1.prtm@gmail.com',
                'avatar' => 'https://lh3.googleusercontent.com/a/ACg8ocKKsAN7kfVeMqbk_m1tPwLykPjElAlvUM7w2Z7XtCJ9ootUeU8=s96-c',
                'password' => null,
                'created_at' => '2026-05-07 23:09:04',
                'updated_at' => '2026-05-07 23:09:04',
            ],
            [
                'id' => 3,
                'google_id' => null,
                'name' => 'Test User',
                'email' => 'test@example.com',
                'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
                'password' => '$2y$12$Xag1AIBPxfVqDfSA.9WHgOB8qLGmwWtTs.IRK6uz296OH1fjEexxy',
                'created_at' => '2026-05-18 23:23:50',
                'updated_at' => '2026-05-21 00:27:39',
            ],
            [
                'id' => 4,
                'google_id' => null,
                'name' => 'Arutala',
                'email' => 'Arutala@example.com',
                'avatar' => null,
                'password' => '$2y$12$SN1DwdC4IhK7EI/4TeX0vOu5l4S.J09uGRT6c0fkabd6C1YFNW6SK',
                'created_at' => '2026-05-20 23:59:00',
                'updated_at' => '2026-05-20 23:59:00',
            ],
            [
                'id' => 5,
                'google_id' => '106518499700281231357',
                'name' => 'Lữnnằr',
                'email' => 'elng.eliam@gmail.com',
                'avatar' => 'https://lh3.googleusercontent.com/a/ACg8ocKpBRcI-mKFeQ1I1b-D5vz_-fy2hcqg6SRrWfeB-Ks3SQAsffQ=s96-c',
                'password' => null,
                'created_at' => '2026-05-21 00:03:06',
                'updated_at' => '2026-05-21 00:03:06',
            ],
            [
                'id' => 6,
                'google_id' => null,
                'name' => 'Zkierra',
                'email' => 'Zekieraa@example.com',
                'avatar' => null,
                'password' => '$2y$12$rBrJVkBc9xORpQ5Zcg8VfeBo/4mASPCT9M2hg5oJE.RcCfqaq4ebK',
                'created_at' => '2026-05-21 01:28:16',
                'updated_at' => '2026-05-21 01:28:16',
            ],
            [
                'id' => 7,
                'google_id' => null,
                'name' => 'Tyrr',
                'email' => 'tyrr@example.com',
                'avatar' => 'https://i.pinimg.com/736x/bc/8e/c2/bc8ec29d2876062820679d1ac0f17310.jpg',
                'password' => '$2y$12$rUgo3cnyFfIn.YCJHHqAf.Z3RtdQ1kAgwlaucJBOCss0TdOSbYXAy',
                'created_at' => '2026-05-21 01:32:55',
                'updated_at' => '2026-05-21 01:59:18',
            ]
        ];

        foreach ($users as $user) {
            // Cek apakah user sudah ada
            $exists = DB::table('users')->where('email', $user['email'])->exists();
            if (!$exists) {
                DB::table('users')->insert($user);
            }
        }
    }
}
