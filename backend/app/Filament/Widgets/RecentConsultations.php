<?php

namespace App\Filament\Widgets;

use App\Models\Consultation;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentConsultations extends BaseWidget
{
    protected static ?string $heading = 'Recent Consultations';

    protected static ?int $sort = 3;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Consultation::query()
                    ->with(['user', 'consultant.user'])
                    ->latest()
                    ->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('#'),
                Tables\Columns\TextColumn::make('user.full_name')
                    ->label('Client'),
                Tables\Columns\TextColumn::make('consultant.user.full_name')
                    ->label('Consultant'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'scheduled',
                        'primary' => 'in_progress',
                        'success' => 'completed',
                        'danger' => fn ($state) => in_array($state, ['cancelled', 'no_show']),
                    ]),
                Tables\Columns\TextColumn::make('duration_minutes')
                    ->label('Duration')
                    ->suffix(' min'),
                Tables\Columns\TextColumn::make('tokens_charged')
                    ->label('Tokens'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('Created'),
            ])
            ->paginated(false);
    }
}

