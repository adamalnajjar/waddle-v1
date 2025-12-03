<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConsultantResource\Pages;
use App\Models\Consultant;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ConsultantResource extends Resource
{
    protected static ?string $model = Consultant::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';

    protected static ?string $navigationGroup = 'User Management';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Consultant Information')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'email')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\TagsInput::make('specializations')
                            ->placeholder('Add specialization')
                            ->helperText('Press Enter to add a specialization'),
                        Forms\Components\TagsInput::make('languages')
                            ->placeholder('Add language')
                            ->helperText('Languages the consultant speaks'),
                        Forms\Components\Textarea::make('bio')
                            ->rows(4)
                            ->maxLength(2000),
                        Forms\Components\TextInput::make('hourly_rate')
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'suspended' => 'Suspended',
                            ])
                            ->required(),
                        Forms\Components\Toggle::make('is_available')
                            ->label('Available for Consultations'),
                        Forms\Components\DateTimePicker::make('approved_at')
                            ->label('Approved At'),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Vetting Documents')
                    ->schema([
                        Forms\Components\FileUpload::make('vetting_documents')
                            ->multiple()
                            ->directory('consultant-documents')
                            ->visibility('private')
                            ->acceptedFileTypes(['application/pdf', 'image/*']),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.full_name')
                    ->label('Name')
                    ->searchable(['first_name', 'last_name']),
                Tables\Columns\TextColumn::make('specializations')
                    ->badge()
                    ->separator(','),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'suspended',
                    ]),
                Tables\Columns\IconColumn::make('is_available')
                    ->boolean()
                    ->label('Available'),
                Tables\Columns\TextColumn::make('hourly_rate')
                    ->money('usd')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'suspended' => 'Suspended',
                    ]),
                Tables\Filters\TernaryFilter::make('is_available')
                    ->label('Available'),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn (Consultant $record) => $record->status === 'pending')
                    ->action(fn (Consultant $record) => $record->update([
                        'status' => 'approved',
                        'approved_at' => now(),
                    ])),
                Tables\Actions\Action::make('suspend')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->visible(fn (Consultant $record) => $record->status === 'approved')
                    ->requiresConfirmation()
                    ->action(fn (Consultant $record) => $record->update([
                        'status' => 'suspended',
                        'is_available' => false,
                    ])),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListConsultants::route('/'),
            'create' => Pages\CreateConsultant::route('/create'),
            'edit' => Pages\EditConsultant::route('/{record}/edit'),
        ];
    }
}

