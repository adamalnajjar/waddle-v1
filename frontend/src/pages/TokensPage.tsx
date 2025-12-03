import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { updateTokenBalance } from '../features/auth/authSlice';
import { tokenApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn, formatCurrency, formatDate, formatRelativeTime } from '../lib/utils';
import type { TokenPackage, TokenTransaction } from '../types';

export const TokensPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
    loadTransactions();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await tokenApi.getPackages();
      setPackages(response.data.packages);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await tokenApi.getTransactions();
      setTransactions(response.data.transactions);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handlePurchase = async (pkg: TokenPackage) => {
    setError(null);
    setSuccess(null);
    setSelectedPackage(pkg);
    setIsPurchasing(true);

    try {
      // Initiate purchase
      const initResponse = await tokenApi.purchase(pkg.id);
      const { payment_intent_id } = initResponse.data;

      // In production, this would open Stripe payment modal
      // For now, we'll simulate a successful payment
      const confirmResponse = await tokenApi.confirmPurchase(payment_intent_id, pkg.id);
      
      dispatch(updateTokenBalance(confirmResponse.data.new_balance));
      setSuccess(`Successfully purchased ${pkg.token_amount} tokens!`);
      loadTransactions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
      setSelectedPackage(null);
    }
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
    <div className="space-y-8">
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
              <p className="text-2xl font-bold">{user?.tokens_balance || 0}</p>
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
        {isLoadingPackages ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-8 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-4" />
                  <div className="h-10 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
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
                    {user?.has_subscription && pkg.subscriber_price && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {formatCurrency(pkg.price)}
                      </span>
                    )}
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
        )}
      </div>

      {/* Subscriber Discount Banner */}
      {!user?.has_subscription && (
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
            <Button>View Plans</Button>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <Card>
          {isLoadingTransactions ? (
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 bg-muted rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                    <div className="h-4 bg-muted rounded w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          ) : transactions.length === 0 ? (
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
                      {formatRelativeTime(transaction.created_at)}
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
  );
};

