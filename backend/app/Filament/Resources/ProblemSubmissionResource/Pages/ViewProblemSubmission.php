<?php

namespace App\Filament\Resources\ProblemSubmissionResource\Pages;

use App\Filament\Resources\ProblemSubmissionResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewProblemSubmission extends ViewRecord
{
    protected static string $resource = ProblemSubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('match')
                ->label('Match Consultants')
                ->icon('heroicon-o-user-plus')
                ->color('primary')
                ->visible(fn () => $this->record->status === 'submitted')
                ->url(fn () => ProblemSubmissionResource::getUrl('match', ['record' => $this->record])),
            Actions\EditAction::make(),
        ];
    }
}

