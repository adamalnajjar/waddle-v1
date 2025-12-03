<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TechnologyResource\Pages;
use App\Models\Technology;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TechnologyResource extends Resource
{
    protected static ?string $model = Technology::class;

    protected static ?string $navigationIcon = 'heroicon-o-cpu-chip';
    
    protected static ?string $navigationGroup = 'Settings';
    
    protected static ?int $navigationSort = 10;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(100)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(100)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('icon_url')
                            ->label('Icon URL')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\Select::make('category')
                            ->options([
                                'frontend' => 'Frontend',
                                'backend' => 'Backend',
                                'mobile' => 'Mobile',
                                'database' => 'Database',
                                'devops' => 'DevOps',
                                'cloud' => 'Cloud',
                                'ai_ml' => 'AI/ML',
                                'other' => 'Other',
                            ])
                            ->required(),
                        Forms\Components\Toggle::make('is_common')
                            ->label('Show in Common Technologies')
                            ->helperText('Display this technology in the initial list on the problem submission page'),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\BadgeColumn::make('category')
                    ->colors([
                        'info' => 'frontend',
                        'success' => 'backend',
                        'warning' => 'mobile',
                        'primary' => 'database',
                        'danger' => 'devops',
                        'gray' => 'other',
                    ]),
                Tables\Columns\IconColumn::make('is_common')
                    ->boolean()
                    ->label('Common'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'frontend' => 'Frontend',
                        'backend' => 'Backend',
                        'mobile' => 'Mobile',
                        'database' => 'Database',
                        'devops' => 'DevOps',
                        'cloud' => 'Cloud',
                        'ai_ml' => 'AI/ML',
                        'other' => 'Other',
                    ]),
                Tables\Filters\TernaryFilter::make('is_common')
                    ->label('Common'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('mark_common')
                        ->label('Mark as Common')
                        ->icon('heroicon-o-star')
                        ->action(fn ($records) => $records->each->update(['is_common' => true])),
                    Tables\Actions\BulkAction::make('unmark_common')
                        ->label('Unmark as Common')
                        ->icon('heroicon-o-star')
                        ->color('gray')
                        ->action(fn ($records) => $records->each->update(['is_common' => false])),
                ]),
            ])
            ->defaultSort('name');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTechnologies::route('/'),
            'create' => Pages\CreateTechnology::route('/create'),
            'edit' => Pages\EditTechnology::route('/{record}/edit'),
        ];
    }
}

