<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConsultationRequestResource\Pages;
use App\Models\ConsultationRequest;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ConsultationRequestResource extends Resource
{
    protected static ?string $model = ConsultationRequest::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $navigationGroup = 'Consultations';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Request Information')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'email')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Forms\Components\Select::make('status')
                            ->options([
                                ConsultationRequest::STATUS_PENDING => 'Pending',
                                ConsultationRequest::STATUS_MATCHING => 'Matching',
                                ConsultationRequest::STATUS_MATCHED => 'Matched',
                                ConsultationRequest::STATUS_IN_PROGRESS => 'In Progress',
                                ConsultationRequest::STATUS_COMPLETED => 'Completed',
                                ConsultationRequest::STATUS_CANCELLED => 'Cancelled',
                            ])
                            ->required(),
                        
                        Forms\Components\Textarea::make('problem_description')
                            ->required()
                            ->maxLength(5000)
                            ->rows(5),
                    ])->columns(2),
                
                Forms\Components\Section::make('Technical Details')
                    ->schema([
                        Forms\Components\TagsInput::make('tech_stack')
                            ->required(),
                        
                        Forms\Components\Textarea::make('error_logs')
                            ->maxLength(10000)
                            ->rows(4),
                    ]),
                
                Forms\Components\Section::make('Matching Information')
                    ->schema([
                        Forms\Components\Select::make('matched_consultant_id')
                            ->relationship('matchedConsultant', 'id')
                            ->searchable()
                            ->preload()
                            ->label('Matched Consultant'),
                        
                        Forms\Components\DateTimePicker::make('matched_at')
                            ->label('Matched At'),
                        
                        Forms\Components\TagsInput::make('excluded_consultants')
                            ->label('Excluded Consultants'),
                        
                        Forms\Components\TextInput::make('shuffle_count')
                            ->numeric()
                            ->default(0),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable(),
                
                Tables\Columns\TextColumn::make('user.email')
                    ->sortable()
                    ->searchable()
                    ->label('User'),
                
                Tables\Columns\TextColumn::make('problem_description')
                    ->limit(50)
                    ->tooltip(function (Tables\Columns\TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) <= 50) {
                            return null;
                        }
                        return $state;
                    })
                    ->searchable(),
                
                Tables\Columns\TagsColumn::make('tech_stack')
                    ->separator(',')
                    ->limit(3),
                
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        ConsultationRequest::STATUS_PENDING => 'warning',
                        ConsultationRequest::STATUS_MATCHING => 'info',
                        ConsultationRequest::STATUS_MATCHED => 'success',
                        ConsultationRequest::STATUS_IN_PROGRESS => 'primary',
                        ConsultationRequest::STATUS_COMPLETED => 'success',
                        ConsultationRequest::STATUS_CANCELLED => 'gray',
                        default => 'gray',
                    })
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('matchedConsultant.user.full_name')
                    ->label('Matched Consultant')
                    ->default('Not matched')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        ConsultationRequest::STATUS_PENDING => 'Pending',
                        ConsultationRequest::STATUS_MATCHING => 'Matching',
                        ConsultationRequest::STATUS_MATCHED => 'Matched',
                        ConsultationRequest::STATUS_IN_PROGRESS => 'In Progress',
                        ConsultationRequest::STATUS_COMPLETED => 'Completed',
                        ConsultationRequest::STATUS_CANCELLED => 'Cancelled',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('match')
                    ->label('Match Consultant')
                    ->icon('heroicon-o-user-plus')
                    ->color('success')
                    ->url(fn (ConsultationRequest $record): string => ConsultationRequestResource::getUrl('match', ['record' => $record]))
                    ->visible(fn (ConsultationRequest $record): bool => 
                        in_array($record->status, [
                            ConsultationRequest::STATUS_PENDING,
                            ConsultationRequest::STATUS_MATCHING,
                        ])
                    ),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListConsultationRequests::route('/'),
            'create' => Pages\CreateConsultationRequest::route('/create'),
            'view' => Pages\ViewConsultationRequest::route('/{record}'),
            'edit' => Pages\EditConsultationRequest::route('/{record}/edit'),
            'match' => Pages\MatchConsultationRequest::route('/{record}/match'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', ConsultationRequest::STATUS_PENDING)->count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }
}
