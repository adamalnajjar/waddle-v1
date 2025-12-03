import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { 
  Coins, 
  MessageSquare, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Plus,
  Star,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: 'Token Balance',
      value: user?.tokens_balance || 0,
      icon: Coins,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      link: '/tokens',
    },
    {
      title: 'Active Consultations',
      value: 0,
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/consultations',
    },
    {
      title: 'Hours Consulted',
      value: '0h',
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Avg. Rating Given',
      value: '-',
      icon: Star,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'Start a Consultation',
      description: 'Get help from an expert now',
      icon: Plus,
      link: '/consultations/new',
      primary: true,
    },
    {
      title: 'Buy Tokens',
      description: 'Top up your token balance',
      icon: Coins,
      link: '/tokens',
    },
    {
      title: 'View History',
      description: 'See past consultations',
      icon: Clock,
      link: '/consultations',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your account
          </p>
        </div>
        <Link to="/consultations/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Consultation
          </Button>
        </Link>
      </div>

      {/* Low Balance Warning */}
      {user && user.tokens_balance < 10 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 rounded-full bg-yellow-500/10">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Low Token Balance</p>
              <p className="text-sm text-muted-foreground">
                You have {user.tokens_balance} tokens remaining. Consider purchasing more to continue consultations.
              </p>
            </div>
            <Link to="/tokens">
              <Button variant="outline" size="sm">
                Buy Tokens
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            {stat.link ? (
              <Link to={stat.link}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                      <stat.icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Link>
            ) : (
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.link}>
              <Card className={cn(
                "h-full hover:shadow-md transition-all cursor-pointer",
                action.primary && "border-primary bg-primary/5"
              )}>
                <CardContent className="p-6">
                  <div className={cn(
                    "p-2 rounded-lg w-fit",
                    action.primary ? "bg-primary/10" : "bg-muted"
                  )}>
                    <action.icon className={cn(
                      "h-5 w-5",
                      action.primary ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <h3 className="font-semibold mt-4">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Consultations</h2>
          <Link to="/consultations" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium">No consultations yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start your first consultation to get expert help
              </p>
              <Link to="/consultations/new" className="mt-4">
                <Button>Start a Consultation</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status */}
      {!user?.has_subscription && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Upgrade to Premium
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get priority matching, discounted tokens, and more benefits
                </p>
              </div>
              <Link to="/subscription">
                <Button>View Plans</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

