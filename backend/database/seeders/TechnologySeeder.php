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
            // Tier 1 - Most Common (display first, shown initially)
            ['name' => 'JavaScript', 'category' => 'frontend', 'is_common' => true, 'display_order' => 1],
            ['name' => 'TypeScript', 'category' => 'frontend', 'is_common' => true, 'display_order' => 2],
            ['name' => 'React', 'category' => 'frontend', 'is_common' => true, 'display_order' => 3],
            ['name' => 'Python', 'category' => 'backend', 'is_common' => true, 'display_order' => 4],
            ['name' => 'Node.js', 'category' => 'backend', 'is_common' => true, 'display_order' => 5],
            ['name' => 'Laravel', 'category' => 'backend', 'is_common' => true, 'display_order' => 6],
            ['name' => 'PHP', 'category' => 'backend', 'is_common' => true, 'display_order' => 7],
            ['name' => 'Flutter', 'category' => 'mobile', 'is_common' => true, 'display_order' => 8],
            ['name' => 'Swift', 'category' => 'mobile', 'is_common' => true, 'display_order' => 9],
            ['name' => 'Kotlin', 'category' => 'mobile', 'is_common' => true, 'display_order' => 10],

            // Tier 2 - Popular frameworks
            ['name' => 'Vue.js', 'category' => 'frontend', 'is_common' => false, 'display_order' => 11],
            ['name' => 'Angular', 'category' => 'frontend', 'is_common' => false, 'display_order' => 12],
            ['name' => 'Next.js', 'category' => 'frontend', 'is_common' => false, 'display_order' => 13],
            ['name' => 'Django', 'category' => 'backend', 'is_common' => false, 'display_order' => 14],
            ['name' => 'Ruby on Rails', 'category' => 'backend', 'is_common' => false, 'display_order' => 15],
            ['name' => 'Go', 'category' => 'backend', 'is_common' => false, 'display_order' => 16],
            ['name' => 'Rust', 'category' => 'backend', 'is_common' => false, 'display_order' => 17],
            ['name' => 'Java', 'category' => 'backend', 'is_common' => false, 'display_order' => 18],
            ['name' => 'C#', 'slug' => 'csharp', 'category' => 'backend', 'is_common' => false, 'display_order' => 19],
            ['name' => '.NET', 'category' => 'backend', 'is_common' => false, 'display_order' => 20],

            // Tier 3 - Additional popular tech
            ['name' => 'React Native', 'category' => 'mobile', 'is_common' => false, 'display_order' => 21],
            ['name' => 'Express.js', 'category' => 'backend', 'is_common' => false, 'display_order' => 22],
            ['name' => 'NestJS', 'category' => 'backend', 'is_common' => false, 'display_order' => 23],
            ['name' => 'FastAPI', 'category' => 'backend', 'is_common' => false, 'display_order' => 24],
            ['name' => 'Spring Boot', 'category' => 'backend', 'is_common' => false, 'display_order' => 25],
            ['name' => 'Docker', 'category' => 'devops', 'is_common' => false, 'display_order' => 26],
            ['name' => 'Kubernetes', 'category' => 'devops', 'is_common' => false, 'display_order' => 27],
            ['name' => 'AWS', 'category' => 'cloud', 'is_common' => false, 'display_order' => 28],
            ['name' => 'PostgreSQL', 'category' => 'database', 'is_common' => false, 'display_order' => 29],
            ['name' => 'MongoDB', 'category' => 'database', 'is_common' => false, 'display_order' => 30],

            // Tier 4 - More technologies
            ['name' => 'MySQL', 'category' => 'database', 'is_common' => false, 'display_order' => 31],
            ['name' => 'Redis', 'category' => 'database', 'is_common' => false, 'display_order' => 32],
            ['name' => 'GraphQL', 'category' => 'backend', 'is_common' => false, 'display_order' => 33],
            ['name' => 'Svelte', 'category' => 'frontend', 'is_common' => false, 'display_order' => 34],
            ['name' => 'Nuxt.js', 'category' => 'frontend', 'is_common' => false, 'display_order' => 35],
            ['name' => 'Tailwind CSS', 'category' => 'frontend', 'is_common' => false, 'display_order' => 36],
            ['name' => 'Firebase', 'category' => 'cloud', 'is_common' => false, 'display_order' => 37],
            ['name' => 'Supabase', 'category' => 'cloud', 'is_common' => false, 'display_order' => 38],
            ['name' => 'Prisma', 'category' => 'database', 'is_common' => false, 'display_order' => 39],
            ['name' => 'Electron', 'category' => 'frontend', 'is_common' => false, 'display_order' => 40],

            // Tier 5 - Additional
            ['name' => 'C++', 'slug' => 'cpp', 'category' => 'backend', 'is_common' => false, 'display_order' => 41],
            ['name' => 'Unity', 'category' => 'other', 'is_common' => false, 'display_order' => 42],
            ['name' => 'Unreal Engine', 'category' => 'other', 'is_common' => false, 'display_order' => 43],
            ['name' => 'TensorFlow', 'category' => 'ai_ml', 'is_common' => false, 'display_order' => 44],
            ['name' => 'PyTorch', 'category' => 'ai_ml', 'is_common' => false, 'display_order' => 45],
            ['name' => 'Solidity', 'category' => 'other', 'is_common' => false, 'display_order' => 46],
            ['name' => 'Terraform', 'category' => 'devops', 'is_common' => false, 'display_order' => 47],
            ['name' => 'Ansible', 'category' => 'devops', 'is_common' => false, 'display_order' => 48],
            ['name' => 'Jenkins', 'category' => 'devops', 'is_common' => false, 'display_order' => 49],
            ['name' => 'GitHub Actions', 'category' => 'devops', 'is_common' => false, 'display_order' => 50],
        ];

        foreach ($technologies as $tech) {
            $data = [
                'category' => $tech['category'],
                'is_common' => $tech['is_common'],
                'display_order' => $tech['display_order'],
                'is_active' => true,
            ];
            
            // Include explicit slug if provided (for names like C++, C#)
            if (isset($tech['slug'])) {
                $data['slug'] = $tech['slug'];
            }
            
            Technology::updateOrCreate(
                ['name' => $tech['name']],
                $data
            );
        }
    }
}
