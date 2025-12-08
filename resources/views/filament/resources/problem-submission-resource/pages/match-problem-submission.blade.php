<x-filament-panels::page>
    <div class="space-y-6">
        {{-- Problem Summary --}}
        <x-filament::section>
            <x-slot name="heading">
                Problem Details
            </x-slot>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">User</h4>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ $record->user->full_name }} ({{ $record->user->email }})
                    </p>
                    @if($record->user->development_competency)
                        <x-filament::badge class="mt-1">
                            {{ ucfirst($record->user->development_competency) }}
                        </x-filament::badge>
                    @endif
                </div>
                
                <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Technologies</h4>
                    <div class="mt-1 flex flex-wrap gap-2">
                        @foreach($record->technologies as $tech)
                            <x-filament::badge color="info">
                                {{ $tech->name }}
                            </x-filament::badge>
                        @endforeach
                    </div>
                </div>
                
                <div class="col-span-full">
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Problem Statement</h4>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ $record->problem_statement }}
                    </p>
                </div>
                
                @if($record->error_description)
                    <div class="col-span-full">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Error Description</h4>
                        <pre class="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">{{ $record->error_description }}</pre>
                    </div>
                @endif
                
                @if($record->attachments->count() > 0)
                    <div class="col-span-full">
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Attachments ({{ $record->attachments->count() }})</h4>
                        <ul class="mt-1 text-sm text-gray-900 dark:text-white">
                            @foreach($record->attachments as $attachment)
                                <li>{{ $attachment->file_name }} ({{ $attachment->human_size }})</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            </div>
        </x-filament::section>

        {{-- Algorithm Suggested Consultants --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center justify-between w-full">
                    <span>Algorithm Suggested Consultants ({{ $suggestedConsultants->count() }})</span>
                    @if($suggestedConsultants->count() > 0)
                        <x-filament::button 
                            wire:click="inviteAll"
                            color="success"
                            size="sm"
                        >
                            Invite All Suggested
                        </x-filament::button>
                    @endif
                </div>
            </x-slot>
            
            @if($suggestedConsultants->count() > 0)
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    @foreach($suggestedConsultants as $consultant)
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 {{ in_array($consultant->id, $selectedConsultants) ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : '' }}">
                            <div class="flex items-start justify-between">
                                <div class="flex items-center gap-3">
                                    <x-filament::input.checkbox
                                        wire:model.live="selectedConsultants"
                                        :value="$consultant->id"
                                    />
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">
                                            {{ $consultant->user->full_name }}
                                        </p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ $consultant->user->email }}
                                        </p>
                                    </div>
                                </div>
                                @if($consultant->match_score ?? false)
                                    <x-filament::badge color="success">
                                        {{ $consultant->match_score }}% match
                                    </x-filament::badge>
                                @endif
                            </div>
                            
                            <div class="mt-3">
                                <p class="text-xs text-gray-500 dark:text-gray-400">Technologies:</p>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    @foreach($consultant->technologies->take(5) as $tech)
                                        <x-filament::badge size="sm" color="gray">
                                            {{ $tech->name }}
                                        </x-filament::badge>
                                    @endforeach
                                    @if($consultant->technologies->count() > 5)
                                        <span class="text-xs text-gray-500">+{{ $consultant->technologies->count() - 5 }} more</span>
                                    @endif
                                </div>
                            </div>
                            
                            <div class="mt-3 flex items-center justify-between text-sm">
                                <span class="text-gray-500 dark:text-gray-400">
                                    Hourly: {{ $consultant->hourly_rate }} tokens
                                </span>
                                @if($consultant->is_surge_available)
                                    <x-filament::button 
                                        wire:click="inviteSingleWithSurge({{ $consultant->id }})"
                                        color="warning"
                                        size="xs"
                                    >
                                        Surge Invite (1.2x)
                                    </x-filament::button>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <x-heroicon-o-user-group class="mx-auto h-12 w-12 text-gray-400" />
                    <p class="mt-2">No matching consultants found based on technologies.</p>
                    <p class="text-sm">You can manually select from all consultants below.</p>
                </div>
            @endif
        </x-filament::section>

        {{-- All Available Consultants --}}
        <x-filament::section collapsible collapsed>
            <x-slot name="heading">
                All Available Consultants ({{ $allConsultants->count() }})
            </x-slot>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @foreach($allConsultants as $consultant)
                    <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 {{ in_array($consultant->id, $selectedConsultants) ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : '' }}">
                        <div class="flex items-start gap-3">
                            <x-filament::input.checkbox
                                wire:model.live="selectedConsultants"
                                :value="$consultant->id"
                            />
                            <div class="flex-1">
                                <p class="font-medium text-gray-900 dark:text-white">
                                    {{ $consultant->user->full_name }}
                                </p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ $consultant->user->email }}
                                </p>
                                <div class="flex flex-wrap gap-1 mt-2">
                                    @foreach($consultant->technologies->take(3) as $tech)
                                        <x-filament::badge size="sm" color="gray">
                                            {{ $tech->name }}
                                        </x-filament::badge>
                                    @endforeach
                                    @if($consultant->technologies->count() > 3)
                                        <span class="text-xs text-gray-500">+{{ $consultant->technologies->count() - 3 }} more</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </x-filament::section>

        {{-- Action Buttons --}}
        @if(count($selectedConsultants) > 0)
            <div class="flex justify-end gap-3 sticky bottom-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <span class="text-sm text-gray-500 dark:text-gray-400 self-center">
                    {{ count($selectedConsultants) }} consultant(s) selected
                </span>
                <x-filament::button 
                    wire:click="inviteSelected"
                    color="primary"
                >
                    Send Invitations
                </x-filament::button>
            </div>
        @endif
    </div>
</x-filament-panels::page>

