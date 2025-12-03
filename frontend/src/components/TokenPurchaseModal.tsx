import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenApi } from '../services/api';
import { Button } from './ui/Button';
import { 
  X, 
  Coins, 
  Sparkles, 
  Check,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { TokenPackage } from '../types';

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTokens?: number;
  onPurchaseComplete?: () => void;
}

export const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  isOpen,
  onClose,
  requiredTokens,
  onPurchaseComplete,
}) => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPackages();
    }
  }, [isOpen]);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const response = await tokenApi.getPackages();
      setPackages(response.data.packages || []);
      
      // Auto-select the smallest package that covers required tokens
      if (requiredTokens) {
        const suitable = (response.data.packages || []).find(
          (p: TokenPackage) => p.token_amount >= requiredTokens
        );
        if (suitable) {
          setSelectedPackage(suitable);
        }
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
      setError('Failed to load token packages');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setIsPurchasing(true);
    setError(null);

    try {
      // In a real implementation, this would redirect to Stripe checkout
      // For now, we'll just show a success state
      const response = await tokenApi.purchase(selectedPackage.id);
      
      if (response.data.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkout_url;
      } else {
        onPurchaseComplete?.();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate purchase');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleViewAllPackages = () => {
    onClose();
    navigate('/tokens');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Get More Tokens</h2>
              {requiredTokens && (
                <p className="text-sm text-muted-foreground">
                  You need at least {requiredTokens} tokens to continue
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={loadPackages}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Package Selection */}
              <div className="space-y-3 mb-6">
                {packages.slice(0, 3).map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  const meetsRequirement = !requiredTokens || pkg.token_amount >= requiredTokens;
                  
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      disabled={!meetsRequirement}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : meetsRequirement
                            ? "border-border hover:border-primary/50"
                            : "border-border opacity-50 cursor-not-allowed",
                        pkg.is_featured && "relative"
                      )}
                    >
                      {pkg.is_featured && (
                        <span className="absolute -top-2 right-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                          Popular
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                          )}>
                            <Coins className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{pkg.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {pkg.token_amount} tokens
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${pkg.price}</p>
                          <p className="text-xs text-muted-foreground">
                            ${(pkg.price / pkg.token_amount).toFixed(2)}/token
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* View All Button */}
              <button
                onClick={handleViewAllPackages}
                className="w-full text-sm text-primary hover:underline mb-6"
              >
                View all packages & subscriptions →
              </button>

              {/* Subscribe Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Save with a subscription</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Subscribers get up to 25% off all token purchases
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={!selectedPackage || isPurchasing}
                className="w-full h-12"
              >
                {isPurchasing ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5 mr-2" />
                )}
                {selectedPackage 
                  ? `Purchase ${selectedPackage.token_amount} Tokens - $${selectedPackage.price}`
                  : 'Select a Package'
                }
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Secure payment powered by Stripe. Tokens never expire.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

