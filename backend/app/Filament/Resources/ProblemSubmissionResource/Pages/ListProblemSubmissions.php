<?php

namespace App\Filament\Resources\ProblemSubmissionResource\Pages;

use App\Filament\Resources\ProblemSubmissionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListProblemSubmissions extends ListRecords
{
    protected static string $resource = ProblemSubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function getTabs(): array
    {
        return [
            'pending' => Tab::make('Pending Review')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'submitted'))
                ->badge(fn () => static::getModel()::where('status', 'submitted')->count())
                ->badgeColor('warning'),
            'matching' => Tab::make('Matching')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'matching'))
                ->badge(fn () => static::getModel()::where('status', 'matching')->count())
                ->badgeColor('info'),
            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereIn('status', ['matched', 'in_progress']))
                ->badge(fn () => static::getModel()::whereIn('status', ['matched', 'in_progress'])->count())
                ->badgeColor('success'),
            'completed' => Tab::make('Completed')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'completed')),
            'all' => Tab::make('All'),
        ];
    }
}

