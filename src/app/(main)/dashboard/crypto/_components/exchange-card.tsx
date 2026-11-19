"use client";

import { type ReactNode, useState } from "react";

import { cn } from "cn";
import { ArrowDownUp } from "lucide-react";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { type CryptoAsset, cryptoAssets, exchangeFeePercent } from "./data";

const amountFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 });
const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function ExchangeAssetSelect({
  asset,
  excludedSymbol,
  onChange,
  label,
}: {
  asset: CryptoAsset;
  excludedSymbol: CryptoAsset["symbol"];
  onChange: (symbol: CryptoAsset["symbol"]) => void;
  label: string;
}) {
  return (
    <Select
      value={asset.symbol}
      onValueChange={(value) => {
        const selectedAsset = cryptoAssets.find((item) => item.symbol === value);
        if (selectedAsset) onChange(selectedAsset.symbol);
      }}
    >
      <SelectTrigger size="sm" aria-label={label} className="bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        <SelectGroup>
          {cryptoAssets.map((item) => (
            <SelectItem key={item.symbol} value={item.symbol} disabled={item.symbol === excludedSymbol}>
              <SimpleIcon icon={item.icon} className={cn("size-3.5", item.iconClassName)} aria-hidden="true" />
              {item.symbol}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function ExchangeAmountField({
  id,
  label,
  asset,
  excludedSymbol,
  value,
  onAssetChange,
  onAmountChange,
  error,
  children,
}: {
  id: string;
  label: string;
  asset: CryptoAsset;
  excludedSymbol: CryptoAsset["symbol"];
  value: string;
  onAssetChange: (symbol: CryptoAsset["symbol"]) => void;
  onAmountChange?: (amount: string) => void;
  error?: string;
  children?: ReactNode;
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <Field className="bg-muted/20 gap-1 rounded-lg border p-2" data-invalid={Boolean(error)}>
      <div className="flex items-start justify-between gap-3">
        <FieldLabel htmlFor={id} className="text-muted-foreground text-xs">
          {label}
        </FieldLabel>
        <ExchangeAssetSelect
          asset={asset}
          excludedSymbol={excludedSymbol}
          label={`${label} asset`}
          onChange={onAssetChange}
        />
      </div>
      <InputGroup className="h-8 border-0 shadow-none has-[[data-slot][aria-invalid=true]]:ring-1 dark:bg-transparent">
        <InputGroupInput
          id={id}
          inputMode="decimal"
          className="px-0 text-2xl tracking-tight tabular-nums md:text-2xl"
          placeholder="0.00"
          readOnly={!onAmountChange}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          onChange={(event) => onAmountChange?.(event.target.value)}
        />
      </InputGroup>
      <div className="flex min-h-5 items-center justify-between gap-2">
        {error ? (
          <FieldError id={errorId} className="text-xs">
            {error}
          </FieldError>
        ) : (
          <span className="text-muted-foreground text-xs tabular-nums">
            Balance: {amountFormatter.format(asset.amount)} {asset.symbol}
          </span>
        )}
        {children}
      </div>
    </Field>
  );
}

export function ExchangeCard() {
  const [paySymbol, setPaySymbol] = useState<CryptoAsset["symbol"]>("BTC");
  const [receiveSymbol, setReceiveSymbol] = useState<CryptoAsset["symbol"]>("ETH");
  const [amount, setAmount] = useState("0.1");
  const payAsset = cryptoAssets.find((asset) => asset.symbol === paySymbol) ?? cryptoAssets[0];
  const receiveAsset = cryptoAssets.find((asset) => asset.symbol === receiveSymbol) ?? cryptoAssets[1];
  const payAmount = Number(amount);
  const payValueUsd = payAmount * payAsset.priceUsd;
  const invalidAmount = amount !== "" && (!Number.isFinite(payValueUsd) || payAmount <= 0);
  const insufficientBalance = !invalidAmount && payAmount > payAsset.amount;
  const feeUsd = invalidAmount ? 0 : (payValueUsd * exchangeFeePercent) / 100;
  const receiveAmount = invalidAmount ? 0 : (payValueUsd - feeUsd) / receiveAsset.priceUsd;
  const rate = payAsset.priceUsd / receiveAsset.priceUsd;
  let amountError: string | undefined;
  if (invalidAmount) amountError = "Enter a valid amount.";
  else if (insufficientBalance) amountError = `Insufficient ${paySymbol} balance.`;

  function swapAssets() {
    setPaySymbol(receiveSymbol);
    setReceiveSymbol(paySymbol);
    if (!invalidAmount && amount !== "") setAmount(String(Number((payAmount * rate).toFixed(8))));
  }

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle>Exchange</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <FieldGroup className="gap-2">
          <ExchangeAmountField
            id="exchange-pay"
            label="You pay"
            asset={payAsset}
            excludedSymbol={receiveSymbol}
            value={amount}
            onAssetChange={setPaySymbol}
            onAmountChange={setAmount}
            error={amountError}
          >
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="secondary"
                size="xs"
                onClick={() => setAmount(String(payAsset.amount / 2))}
              >
                50%
              </Button>
              <Button type="button" variant="secondary" size="xs" onClick={() => setAmount(String(payAsset.amount))}>
                Max
              </Button>
            </div>
          </ExchangeAmountField>
          <div className="relative flex h-0 items-center justify-center">
            <Button
              type="button"
              size="icon-xs"
              variant="outline"
              className="bg-card ring-card ring-4"
              aria-label="Swap exchange assets"
              onClick={swapAssets}
            >
              <ArrowDownUp />
            </Button>
          </div>
          <ExchangeAmountField
            id="exchange-receive"
            label="You receive"
            asset={receiveAsset}
            excludedSymbol={paySymbol}
            value={amountFormatter.format(receiveAmount)}
            onAssetChange={setReceiveSymbol}
          />
        </FieldGroup>
        <dl className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Rate</dt>
            <dd className="text-right tabular-nums">
              1 {paySymbol} = {amountFormatter.format(rate)} {receiveSymbol}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Estimated fee ({exchangeFeePercent}%)</dt>
            <dd className="tabular-nums">{usdFormatter.format(feeUsd)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
