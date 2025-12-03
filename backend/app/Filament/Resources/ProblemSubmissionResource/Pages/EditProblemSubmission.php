<?php

namespace App\Filament\Resources\ProblemSubmissionResource\Pages;

use App\Filament\Resources\ProblemSubmissionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditProblemSubmission extends EditRecord
{
    protected static string $resource = ProblemSubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}

