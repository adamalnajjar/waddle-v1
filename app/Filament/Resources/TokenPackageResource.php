<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TokenPackageResource\Pages;
use App\Models\TokenPackage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TokenPackageResource extends Resource
{
    protected static ?string $model = TokenPackage::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-pound';

    protected static ?string $navigationGroup = 'Billing';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Package Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description')
                            ->rows(2),
                        Forms\Components\TextInput::make('token_amount')
                            ->numeric()
                            ->required()
                            ->label('Token Amount'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Pricing')
                    ->schema([
                        Forms\Components\TextInput::make('price')
                            ->numeric()
                            ->prefix('£')
                            ->required()
                            ->label('Regular Price'),
                        Forms\Components\TextInput::make('subscriber_price')
                            ->numeric()
                            ->prefix('£')
                            ->label('Subscriber Price')
                            ->helperText('Leave empty to use regular price'),
                        Forms\Components\TextInput::make('stripe_price_id')
                            ->label('Stripe Price ID'),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Display')
                    ->schema([
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured Package')
                            ->helperText('Show as recommended'),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->default(true),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric()
                            ->default(0)
                            ->label('Sort Order'),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('token_amount')
                    ->label('Tokens')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('GBP')
                    ->sortable(),
                Tables\Columns\TextColumn::make('subscriber_price')
                    ->money('GBP')
                    ->label('Sub. Price')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('price_per_token')
                    ->label('£/Token')
                    ->getStateUsing(fn ($record) => $record->token_amount > 0 ? number_format($record->price / $record->token_amount, 3) : 0),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
                Tables\Columns\TextColumn::make('sort_order')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('sort_order');
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
            'index' => Pages\ListTokenPackages::route('/'),
            'create' => Pages\CreateTokenPackage::route('/create'),
            'edit' => Pages\EditTokenPackage::route('/{record}/edit'),
        ];
    }
}

