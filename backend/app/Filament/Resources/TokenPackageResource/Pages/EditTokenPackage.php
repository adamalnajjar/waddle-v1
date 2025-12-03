<?php

namespace App\Filament\Resources\TokenPackageResource\Pages;

use App\Filament\Resources\TokenPackageResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTokenPackage extends EditRecord
{
    protected static string $resource = TokenPackageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}

