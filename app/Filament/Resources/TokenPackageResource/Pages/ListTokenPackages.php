<?php

namespace App\Filament\Resources\TokenPackageResource\Pages;

use App\Filament\Resources\TokenPackageResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTokenPackages extends ListRecords
{
    protected static string $resource = TokenPackageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}

