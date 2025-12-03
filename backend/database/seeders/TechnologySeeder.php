<?php

namespace Database\Seeders;

use App\Models\Technology;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $technologies = [
            // Tier 1 - Most Common (display first)
            ['name' => 'JavaScript', 'display_order' => 1],
            ['name' => 'TypeScript', 'display_order' => 2],
            ['name' => 'React', 'display_order' => 3],
            ['name' => 'Python', 'display_order' => 4],
            ['name' => 'Node.js', 'display_order' => 5],
            ['name' => 'Laravel', 'display_order' => 6],
            ['name' => 'PHP', 'display_order' => 7],
            ['name' => 'Flutter', 'display_order' => 8],
            ['name' => 'Swift', 'display_order' => 9],
            ['name' => 'Kotlin', 'display_order' => 10],

            // Tier 2 - Popular frameworks
            ['name' => 'Vue.js', 'display_order' => 11],
            ['name' => 'Angular', 'display_order' => 12],
            ['name' => 'Next.js', 'display_order' => 13],
            ['name' => 'Django', 'display_order' => 14],
            ['name' => 'Ruby on Rails', 'display_order' => 15],
            ['name' => 'Go', 'display_order' => 16],
            ['name' => 'Rust', 'display_order' => 17],
            ['name' => 'Java', 'display_order' => 18],
            ['name' => 'C#', 'display_order' => 19],
            ['name' => '.NET', 'display_order' => 20],

            // Tier 3 - Additional popular tech
            ['name' => 'React Native', 'display_order' => 21],
            ['name' => 'Express.js', 'display_order' => 22],
            ['name' => 'NestJS', 'display_order' => 23],
            ['name' => 'FastAPI', 'display_order' => 24],
            ['name' => 'Spring Boot', 'display_order' => 25],
            ['name' => 'Docker', 'display_order' => 26],
            ['name' => 'Kubernetes', 'display_order' => 27],
            ['name' => 'AWS', 'display_order' => 28],
            ['name' => 'PostgreSQL', 'display_order' => 29],
            ['name' => 'MongoDB', 'display_order' => 30],

            // Tier 4 - More technologies
            ['name' => 'MySQL', 'display_order' => 31],
            ['name' => 'Redis', 'display_order' => 32],
            ['name' => 'GraphQL', 'display_order' => 33],
            ['name' => 'Svelte', 'display_order' => 34],
            ['name' => 'Nuxt.js', 'display_order' => 35],
            ['name' => 'Tailwind CSS', 'display_order' => 36],
            ['name' => 'Firebase', 'display_order' => 37],
            ['name' => 'Supabase', 'display_order' => 38],
            ['name' => 'Prisma', 'display_order' => 39],
            ['name' => 'Electron', 'display_order' => 40],

            // Tier 5 - Additional
            ['name' => 'C++', 'display_order' => 41],
            ['name' => 'Unity', 'display_order' => 42],
            ['name' => 'Unreal Engine', 'display_order' => 43],
            ['name' => 'TensorFlow', 'display_order' => 44],
            ['name' => 'PyTorch', 'display_order' => 45],
            ['name' => 'Solidity', 'display_order' => 46],
            ['name' => 'Terraform', 'display_order' => 47],
            ['name' => 'Ansible', 'display_order' => 48],
            ['name' => 'Jenkins', 'display_order' => 49],
            ['name' => 'GitHub Actions', 'display_order' => 50],
        ];

        foreach ($technologies as $tech) {
            Technology::firstOrCreate(
                ['name' => $tech['name']],
                [
                    'display_order' => $tech['display_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}

