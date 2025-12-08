import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button.tsx';
import { Card, CardContent } from '@/Components/ui/Card.tsx';
import { MessageSquare, Plus, Clock, CheckCircle } from 'lucide-react';
import type { PageProps } from '@/types';

export default function Consultations() {
  const { auth } = usePage<PageProps>().props;

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Consultations</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your consultation history
            </p>
          </div>
          <Link href="/consultations/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Consultation
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b">
          <button className="pb-2 px-1 text-sm font-medium border-b-2 border-primary text-primary">
            All
          </button>
          <button className="pb-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            Active
          </button>
          <button className="pb-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            Completed
          </button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-6" />
              <h3 className="text-xl font-semibold mb-2">No consultations yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start your first consultation to get expert help with your coding problems.
                Our consultants are ready to assist you!
              </p>
              <Link href="/consultations/new">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Start a Consultation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Total Consultations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0h</p>
                  <p className="text-sm text-muted-foreground">Time Consulted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <CheckCircle className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Problems Solved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
