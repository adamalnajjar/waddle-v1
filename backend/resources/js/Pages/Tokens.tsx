import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Alert, AlertDescription } from '@/Components/ui/Alert';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { PageProps } from '@/types';

interface TokenPackage {
  id: number;
  name: string;
  token_amount: number;
  price: number;
  subscriber_price?: number;
  effective_price: number;
  description: string;
  is_featured: boolean;
}

interface TokenTransaction {
  id: number;
  type: string;
  amount: number;
  balance_after: number;
  description?: string;
  created_at: string;
}

interface TokensPageProps extends PageProps {
  packages?: TokenPackage[];
  transactions?: TokenTransaction[];
}

export default function Tokens() {
  const { auth, packages = [], transactions = [] } = usePage<TokensPageProps>().props;
  const user = auth.user;
  
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Default packages if not provided from backend
  const defaultPackages: TokenPackage[] = [
    { id: 1, name: 'Starter', token_amount: 25, price: 50, effective_price: 50, description: 'Great for trying out', is_featured: false },
    { id: 2, name: 'Basic', token_amount: 50, price: 90, effective_price: 90, description: 'Most common choice', is_featured: false },
    { id: 3, name: 'Popular', token_amount: 100, price: 160, effective_price: 160, description: 'Best value', is_featured: true },
    { id: 4, name: 'Pro', token_amount: 250, price: 350, effective_price: 350, description: 'For power users', is_featured: false },
  ];

  const displayPackages = packages.length > 0 ? packages : defaultPackages;

  const handlePurchase = async (pkg: TokenPackage) => {
    setError(null);
    setSuccess(null);
    setSelectedPackage(pkg);
    setIsPurchasing(true);

    // In a real implementation, this would initiate Stripe checkout
    setTimeout(() => {
      setSuccess(`Successfully purchased ${pkg.token_amount} tokens!`);
      setIsPurchasing(false);
      setSelectedPackage(null);
    }, 1500);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'deduction':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'refund':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'bonus':
        return <Sparkles className="h-4 w-4 text-yellow-500" />;
      default:
        return <Coins className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Token Management</h1>
            <p className="text-muted-foreground mt-1">
              Purchase tokens to start consultations
            </p>
          </div>
          <Card className="sm:min-w-[200px]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-500/10">
                <Coins className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.token_balance || 0}</p>
                <p className="text-sm text-muted-foreground">Current Balance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Token Packages */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Buy Tokens</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {displayPackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={cn(
                  "relative overflow-hidden transition-shadow hover:shadow-lg",
                  pkg.is_featured && "border-primary"
                )}
              >
                {pkg.is_featured && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg">{pkg.name}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold">
                      {formatCurrency(pkg.effective_price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Coins className="h-4 w-4" />
                    <span>{pkg.token_amount} tokens</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {pkg.description}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {formatCurrency(pkg.effective_price / pkg.token_amount)} per token
                  </p>
                  <Button 
                    className="w-full"
                    variant={pkg.is_featured ? 'default' : 'outline'}
                    onClick={() => handlePurchase(pkg)}
                    isLoading={isPurchasing && selectedPackage?.id === pkg.id}
                    disabled={isPurchasing}
                  >
                    Buy Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscriber Discount Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Save up to 25% on tokens
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Subscribe to a plan and get discounted token prices
              </p>
            </div>
            <Link href="/pricing">
              <Button>View Plans</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <Card>
            {transactions.length === 0 ? (
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your token purchases and usage will appear here
                </p>
              </CardContent>
            ) : (
              <div className="divide-y">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="p-4 flex items-center gap-4"
                  >
                    <div className="p-2 rounded-full bg-muted">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {transaction.description || transaction.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={cn(
                      "font-semibold",
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Balance: {transaction.balance_after}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
