<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConsultantInvitationResource\Pages;
use App\Models\ConsultantInvitation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;

class ConsultantInvitationResource extends Resource
{
    protected static ?string $model = ConsultantInvitation::class;

    protected static ?string $navigationIcon = 'heroicon-o-paper-airplane';
    
    protected static ?string $navigationGroup = 'Problems';
    
    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Invitations';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'info';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\Select::make('problem_submission_id')
                            ->relationship('problemSubmission', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "Problem #{$record->id} - " . substr($record->problem_statement, 0, 50))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('consultant_id')
                            ->relationship('consultant', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->user->full_name)
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'accepted' => 'Accepted',
                                'declined' => 'Declined',
                                'expired' => 'Expired',
                            ])
                            ->required(),
                        Forms\Components\Toggle::make('is_surge')
                            ->label('Surge Pricing'),
                        Forms\Components\TextInput::make('surge_multiplier')
                            ->numeric()
                            ->step(0.1)
                            ->default(1.0)
                            ->visible(fn ($get) => $get('is_surge')),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                Tables\Columns\TextColumn::make('problemSubmission.id')
                    ->label('Problem')
                    ->formatStateUsing(fn ($state) => $state ? "Problem #{$state}" : '-')
                    ->visible(fn ($record) => $record->problem_submission_id !== null),
                Tables\Columns\TextColumn::make('consultationRequest.id')
                    ->label('Consultation')
                    ->formatStateUsing(fn ($state) => $state ? "Request #{$state}" : '-')
                    ->visible(fn ($record) => $record->consultation_request_id !== null),
                Tables\Columns\TextColumn::make('consultant.user.full_name')
                    ->label('Consultant')
                    ->searchable(['first_name', 'last_name']),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'accepted',
                        'danger' => 'declined',
                        'gray' => 'expired',
                    ]),
                Tables\Columns\IconColumn::make('is_surge')
                    ->boolean()
                    ->label('Surge')
                    ->trueIcon('heroicon-o-bolt')
                    ->trueColor('warning'),
                Tables\Columns\TextColumn::make('surge_multiplier')
                    ->label('Multiplier')
                    ->formatStateUsing(fn ($state) => $state ? "{$state}x" : '-')
                    ->visible(fn ($record) => $record?->is_surge_pricing),
                Tables\Columns\TextColumn::make('invited_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable()
                    ->color(fn ($record) => $record->expires_at && $record->expires_at->isPast() ? 'danger' : null),
                Tables\Columns\TextColumn::make('responded_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'accepted' => 'Accepted',
                        'declined' => 'Declined',
                        'expired' => 'Expired',
                    ]),
                Tables\Filters\TernaryFilter::make('is_surge')
                    ->label('Surge Pricing'),
                Tables\Filters\Filter::make('expired')
                    ->query(fn ($query) => $query->where('expires_at', '<', now())->where('status', 'pending'))
                    ->label('Expired (needs processing)'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('expire')
                    ->label('Mark Expired')
                    ->icon('heroicon-o-clock')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'pending' && $record->expires_at?->isPast())
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'expired'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('expire_all')
                        ->label('Mark All Expired')
                        ->icon('heroicon-o-clock')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each(function ($record) {
                                if ($record->status === 'pending' && $record->expires_at?->isPast()) {
                                    $record->update(['status' => 'expired']);
                                }
                            });
                        }),
                ]),
            ])
            ->defaultSort('invited_at', 'desc');
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Invitation Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('problemSubmission.problem_statement')
                            ->label('Problem')
                            ->limit(100),
                        Infolists\Components\TextEntry::make('consultant.user.full_name')
                            ->label('Consultant'),
                        Infolists\Components\TextEntry::make('status')
                            ->badge(),
                        Infolists\Components\IconEntry::make('is_surge')
                            ->boolean()
                            ->label('Surge Pricing'),
                        Infolists\Components\TextEntry::make('surge_multiplier')
                            ->formatStateUsing(fn ($state) => $state ? "{$state}x" : '-'),
                    ])
                    ->columns(3),
                    
                Infolists\Components\Section::make('Timestamps')
                    ->schema([
                        Infolists\Components\TextEntry::make('invited_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('expires_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('responded_at')
                            ->dateTime(),
                    ])
                    ->columns(3),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListConsultantInvitations::route('/'),
            'view' => Pages\ViewConsultantInvitation::route('/{record}'),
        ];
    }
}

