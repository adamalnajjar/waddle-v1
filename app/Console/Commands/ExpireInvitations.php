<?php

namespace App\Console\Commands;

use App\Jobs\ExpireInvitationsJob;
use Illuminate\Console\Command;

class ExpireInvitations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invitations:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process expired invitations and issue refunds for problems with no accepted consultants';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Processing expired invitations...');
        
        ExpireInvitationsJob::dispatchSync();
        
        $this->info('Done!');
        
        return Command::SUCCESS;
    }
}

