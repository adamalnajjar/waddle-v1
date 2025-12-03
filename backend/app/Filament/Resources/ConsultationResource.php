<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConsultationResource\Pages;
use App\Models\Consultation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ConsultationResource extends Resource
{
    protected static ?string $model = Consultation::class;

    protected static ?string $navigationIcon = 'heroicon-o-video-camera';

    protected static ?string $navigationGroup = 'Consultations';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Consultation Details')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'email')
                            ->searchable()
                            ->required(),
                        Forms\Components\Select::make('consultant_id')
                            ->relationship('consultant', 'id')
                            ->searchable()
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->options([
                                'scheduled' => 'Scheduled',
                                'in_progress' => 'In Progress',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                                'no_show' => 'No Show',
                            ])
                            ->required(),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Session Information')
                    ->schema([
                        Forms\Components\TextInput::make('zoom_meeting_id')
                            ->label('Zoom Meeting ID'),
                        Forms\Components\TextInput::make('zoom_join_url')
                            ->label('Join URL')
                            ->url(),
                        Forms\Components\DateTimePicker::make('started_at')
                            ->label('Started At'),
                        Forms\Components\DateTimePicker::make('ended_at')
                            ->label('Ended At'),
                        Forms\Components\TextInput::make('duration_minutes')
                            ->numeric()
                            ->label('Duration (minutes)'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Billing')
                    ->schema([
                        Forms\Components\TextInput::make('tokens_charged')
                            ->numeric()
                            ->label('Tokens Charged'),
                        Forms\Components\TextInput::make('token_rate_per_minute')
                            ->numeric()
                            ->label('Token Rate/Min'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Feedback')
                    ->schema([
                        Forms\Components\TextInput::make('user_rating')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(5)
                            ->label('User Rating'),
                        Forms\Components\Textarea::make('user_feedback')
                            ->label('User Feedback')
                            ->rows(3),
                        Forms\Components\Textarea::make('notes')
                            ->label('Admin Notes')
                            ->rows(3),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.full_name')
                    ->label('Client')
                    ->searchable(['first_name', 'last_name']),
                Tables\Columns\TextColumn::make('consultant.user.full_name')
                    ->label('Consultant')
                    ->searchable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'scheduled',
                        'primary' => 'in_progress',
                        'success' => 'completed',
                        'danger' => fn ($state) => in_array($state, ['cancelled', 'no_show']),
                    ]),
                Tables\Columns\TextColumn::make('duration_minutes')
                    ->label('Duration')
                    ->suffix(' min')
                    ->sortable(),
                Tables\Columns\TextColumn::make('tokens_charged')
                    ->label('Tokens')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user_rating')
                    ->label('Rating')
                    ->sortable(),
                Tables\Columns\TextColumn::make('started_at')
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
                        'scheduled' => 'Scheduled',
                        'in_progress' => 'In Progress',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'no_show' => 'No Show',
                    ]),
                Tables\Filters\Filter::make('completed_today')
                    ->query(fn ($query) => $query->where('status', 'completed')->whereDate('ended_at', today()))
                    ->label('Completed Today'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListConsultations::route('/'),
            'create' => Pages\CreateConsultation::route('/create'),
            'edit' => Pages\EditConsultation::route('/{record}/edit'),
        ];
    }
}

