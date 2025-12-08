<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\Consultation;
use App\Models\TokenTransaction;
use App\Models\Subscription;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', today())->count();
        
        $totalConsultations = Consultation::count();
        $completedToday = Consultation::where('status', 'completed')
            ->whereDate('ended_at', today())
            ->count();
        
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        
        $tokensEarnedToday = TokenTransaction::where('type', 'purchase')
            ->whereDate('created_at', today())
            ->sum('amount');

        return [
            Stat::make('Total Users', number_format($totalUsers))
                ->description("+{$newUsersToday} today")
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            
            Stat::make('Total Consultations', number_format($totalConsultations))
                ->description("{$completedToday} completed today")
                ->descriptionIcon('heroicon-m-video-camera')
                ->color('primary'),
            
            Stat::make('Active Subscriptions', number_format($activeSubscriptions))
                ->description('Paying subscribers')
                ->descriptionIcon('heroicon-m-credit-card')
                ->color('warning'),
            
            Stat::make('Tokens Sold Today', number_format($tokensEarnedToday))
                ->description('Revenue today')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('success'),
        ];
    }
}

