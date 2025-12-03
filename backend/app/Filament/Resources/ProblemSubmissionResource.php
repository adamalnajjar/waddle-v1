<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProblemSubmissionResource\Pages;
use App\Models\ProblemSubmission;
use App\Models\Consultant;
use App\Models\ConsultantInvitation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Builder;

class ProblemSubmissionResource extends Resource
{
    protected static ?string $model = ProblemSubmission::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    
    protected static ?string $navigationGroup = 'Problems';
    
    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'problem_statement';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'submitted')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Problem Details')
                    ->schema([
                        Forms\Components\Textarea::make('problem_statement')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('error_description')
                            ->rows(6)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'submitted' => 'Submitted',
                                'matching' => 'Matching',
                                'matched' => 'Matched',
                                'in_progress' => 'In Progress',
                                'completed' => 'Completed',
                                'refunded' => 'Refunded',
                                'cancelled' => 'Cancelled',
                            ])
                            ->required(),
                        Forms\Components\TextInput::make('submission_fee')
                            ->numeric()
                            ->suffix('tokens')
                            ->disabled(),
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
                Tables\Columns\TextColumn::make('user.full_name')
                    ->label('User')
                    ->searchable(['first_name', 'last_name'])
                    ->sortable(),
                Tables\Columns\TextColumn::make('problem_statement')
                    ->limit(50)
                    ->searchable(),
                Tables\Columns\TextColumn::make('technologies_list')
                    ->label('Technologies')
                    ->getStateUsing(fn ($record) => $record->technologies->pluck('name')->join(', '))
                    ->limit(30)
                    ->wrap(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'gray' => 'draft',
                        'warning' => 'submitted',
                        'info' => 'matching',
                        'primary' => 'matched',
                        'success' => 'in_progress',
                        'success' => 'completed',
                        'danger' => 'refunded',
                        'gray' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('submission_fee')
                    ->suffix(' tokens')
                    ->sortable(),
                Tables\Columns\TextColumn::make('submitted_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'submitted' => 'Submitted',
                        'matching' => 'Matching',
                        'matched' => 'Matched',
                        'in_progress' => 'In Progress',
                        'completed' => 'Completed',
                        'refunded' => 'Refunded',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('match')
                    ->label('Match')
                    ->icon('heroicon-o-user-plus')
                    ->color('primary')
                    ->visible(fn ($record) => $record->status === 'submitted')
                    ->url(fn ($record) => static::getUrl('match', ['record' => $record])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('submitted_at', 'desc');
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('User Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('user.full_name')
                            ->label('Name'),
                        Infolists\Components\TextEntry::make('user.email')
                            ->label('Email'),
                        Infolists\Components\TextEntry::make('user.development_competency')
                            ->label('Experience Level')
                            ->badge(),
                    ])
                    ->columns(3),

                Infolists\Components\Section::make('Problem Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('problem_statement')
                            ->columnSpanFull(),
                        Infolists\Components\TextEntry::make('error_description')
                            ->columnSpanFull()
                            ->markdown(),
                    ]),

                Infolists\Components\Section::make('Technologies')
                    ->schema([
                        Infolists\Components\TextEntry::make('technologies_list')
                            ->label('')
                            ->getStateUsing(fn ($record) => $record->technologies->pluck('name')->join(', '))
                            ->badge()
                            ->separator(','),
                    ]),

                Infolists\Components\Section::make('Attachments')
                    ->schema([
                        Infolists\Components\RepeatableEntry::make('attachments')
                            ->schema([
                                Infolists\Components\TextEntry::make('file_name'),
                                Infolists\Components\TextEntry::make('human_size'),
                            ])
                            ->columns(2),
                    ])
                    ->visible(fn ($record) => $record->attachments->count() > 0),

                Infolists\Components\Section::make('Status & Fees')
                    ->schema([
                        Infolists\Components\TextEntry::make('status')
                            ->badge(),
                        Infolists\Components\TextEntry::make('submission_fee')
                            ->suffix(' tokens'),
                        Infolists\Components\TextEntry::make('submitted_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('refunded_at')
                            ->dateTime()
                            ->visible(fn ($record) => $record->refunded_at !== null),
                    ])
                    ->columns(4),
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
            'index' => Pages\ListProblemSubmissions::route('/'),
            'view' => Pages\ViewProblemSubmission::route('/{record}'),
            'edit' => Pages\EditProblemSubmission::route('/{record}/edit'),
            'match' => Pages\MatchProblemSubmission::route('/{record}/match'),
        ];
    }
}

