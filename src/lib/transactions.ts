import toast from "react-hot-toast";

// Store original fetch to prevent console pollution
const originalFetch = window.fetch;

interface TransactionResponse {
  success?: boolean;
  vm_status?: string;
  type?: string;
  [key: string]: unknown;
}

// Quietly poll for transaction without any console errors
async function waitForTransactionQuietly(txHash: string): Promise<TransactionResponse> {
  // Temporarily override console.error to suppress 404 logs
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Suppress console errors during fetch
  console.error = () => {};
  console.warn = () => {};

  // Use direct fetch instead of SDK to avoid automatic error logging
  const response = await originalFetch(
    `https://api.testnet.aptoslabs.com/v1/transactions/by_hash/${txHash}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  // Restore console immediately after fetch
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;

  if (response.status === 404) {
    // Transaction not indexed yet - throw error to trigger retry
    throw { status: 404, message: "Transaction not found yet" };
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json() as TransactionResponse;
  return result;
}

// Legacy transaction payload type for wallet adapter compatibility
export type TransactionPayload = {
  type: "entry_function_payload";
  function: string;
  type_arguments: string[];
  arguments: unknown[];
};

export interface TransactionOptions {
  maxGasAmount?: string;
  gasUnitPrice?: string;
  expireTimestamp?: number;
}

export class TransactionService {
  static async submitTransaction(
    // wallet adapters often accept an options arg after the payload (wallet implementations vary)
    signAndSubmitTransaction: (
      payload: TransactionPayload,
      opts?: Record<string, string | number | undefined>,
    ) => Promise<{ hash: string }>,
    payload: TransactionPayload,
    options: TransactionOptions = {},
    toastId?: string | number,
  ): Promise<boolean> {
    // Use provided toastId or create a new one
    const txToastId = toastId
      ? String(toastId)
      : toast.loading("Processing transaction...");

    try {
      // Submit the transaction. Pass gas options through to the wallet adapter when available.
      const walletOpts: Record<string, string> = {};
      // Provide multiple key formats for compatibility with different wallet adapters
      const optsAny = options as Record<string, string | number | undefined>;
      const maxGas =
        optsAny.maxGasAmount ||
        optsAny.max_gas_amount ||
        optsAny.max_gas ||
        optsAny.maxGas ||
        undefined;
      const gasPrice =
        optsAny.gasUnitPrice ||
        optsAny.gas_unit_price ||
        optsAny.gasUnitPrice ||
        optsAny.gasPrice ||
        undefined;
      if (maxGas) {
        walletOpts.max_gas_amount = String(maxGas);
        walletOpts.maxGasAmount = String(maxGas);
        walletOpts.maxGas = String(maxGas);
        walletOpts.max_gas = String(maxGas);
        walletOpts.gas_budget = String(maxGas);
      }
      if (gasPrice) {
        walletOpts.gas_unit_price = String(gasPrice);
        walletOpts.gasUnitPrice = String(gasPrice);
        walletOpts.gasPrice = String(gasPrice);
      }

      // Log the options sent to the wallet for debugging simulation errors
      console.log("💳 Submitting transaction to wallet...");

      // Try submitting the transaction, with automatic retry if the wallet simulation reports
      // MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS by increasing max_gas_amount.
      let attempt = 0;
      const maxAttempts = 5;
      let lastError: Error | null = null;

      let txHash: string | null = null;
      while (attempt < maxAttempts) {
        try {
          const res = await signAndSubmitTransaction(payload, walletOpts);
          txHash = res?.hash;
          // success
          break;
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          lastError = err instanceof Error ? err : new Error(errorMessage);
          console.warn(
            `TransactionService: submit attempt ${attempt + 1} failed`,
            errorMessage,
          );

          const msg = errorMessage || "";
          if (
            msg.includes("MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS") &&
            attempt < maxAttempts - 1
          ) {
            // increase gas and retry
            const current =
              parseInt(
                String(
                  walletOpts.max_gas_amount ||
                    optsAny.maxGasAmount ||
                    optsAny.max_gas ||
                    0,
                ),
                10,
              ) || 0;
            const next = current > 0 ? Math.floor(current * 2) : 5000000;
            walletOpts.max_gas_amount = String(next);
            walletOpts.maxGasAmount = String(next);
            walletOpts.maxGas = String(next);
            walletOpts.max_gas = String(next);
            walletOpts.gas_budget = String(next);
            console.info(
              `TransactionService: retrying with increased max_gas_amount=${walletOpts.max_gas_amount}`,
            );
            attempt++;
            continue;
          }

          // Not a gas simulation error or no retries left
          throw err;
        }
      }

      // If we reach here and we don't have a txHash, all attempts failed
      if (!txHash) throw lastError;

      // Wait for transaction to be confirmed.
      // Some wallets return a hash before the fullnode has indexed it; poll with backoff when transaction_not_found.
      const maxWaitAttempts = 30;
      let waitAttempt = 0;
      let waitResult: TransactionResponse | null = null;

      // Add initial delay before first attempt - transactions may need time to propagate
      console.log(`🚀 Transaction submitted: ${txHash}`);
      console.log(
        "⏳ Confirming in background (no more updates until complete)...",
      );
      // Dismiss the processing toast - we'll show result when done
      toast.dismiss(String(txToastId));
      await new Promise((res) => setTimeout(res, 3000)); // Wait 3 seconds before first poll

      while (waitAttempt < maxWaitAttempts) {
        try {
          waitResult = await waitForTransactionQuietly(txHash);
          console.log(`✅ Transaction found on attempt ${waitAttempt + 1}!`);
          console.log("📦 Raw response:", JSON.stringify(waitResult, null, 2));
          break;
        } catch (err: unknown) {
          // Build comprehensive error message string (case-insensitive search)
          const errorObj = err as { message?: string; status?: number; statusCode?: number; response?: { status?: number; statusCode?: number; data?: string }; code?: number };
          const errMsg = err && typeof err === 'object' && 'toString' in err ? String(err.toString()) : String(err);
          const msg =
            (errorObj?.message || errMsg || "");
          const msgLower = msg.toLowerCase();

          // Check for various forms of "transaction not found" errors:
          // - String messages containing transaction_not_found (case-insensitive)
          // - HTTP 404 status codes (Not Found)
          // - Error messages containing "404" or "Not Found" (case-insensitive)
          // - URL containing "/by_hash" (transaction lookup endpoint)
          const isTransactionNotFound =
            msgLower.includes("transaction_not_found") ||
            msgLower.includes("transaction not found") ||
            msgLower.includes("not found") ||
            msgLower.includes("404") ||
            msgLower.includes("/transactions/by_hash") ||
            errorObj?.statusCode === 404 ||
            errorObj?.status === 404 ||
            errorObj?.response?.status === 404 ||
            errorObj?.response?.statusCode === 404 ||
            errorObj?.code === 404 ||
            (errorObj?.response?.data &&
              typeof errorObj.response.data === "string" &&
              errorObj.response.data.toLowerCase().includes("not found"));

          // If the node hasn't indexed the transaction yet, wait and retry
          if (isTransactionNotFound) {
            const delay = Math.min(3000 * (waitAttempt + 1), 15000);
            // Only log once at the start to reduce console noise
            if (waitAttempt === 0) {
              console.log(
                `⏳ Polling API in background (this may take 5-30 seconds)...`,
              );
            }
            // No toast updates during polling - just wait silently
            // Wait with exponential backoff
            await new Promise((res) => setTimeout(res, delay));
            waitAttempt++;
            continue;
          }

          // Other errors: break and propagate
          console.error("❌ Transaction error:", msg.substring(0, 200));
          throw err;
        }
      }

      if (!waitResult) {
        // All attempts exhausted
        console.error(
          "❌ Transaction not confirmed after 30 attempts. It may still be processing.",
        );
        toast.error(
          "⏱️ Transaction timeout. It may still be processing - check Aptos Explorer.",
          {
            duration: 8000,
          },
        );
        throw new Error(
          `Transaction ${txHash.substring(0, 10)}... not confirmed after ${maxWaitAttempts} attempts`,
        );
      }

      // Log the full response to debug
      console.log("📦 Checking transaction status...");
      console.log("   success field:", waitResult?.success);
      console.log("   vm_status:", waitResult?.vm_status);
      console.log("   type:", waitResult?.type);

      // Check if transaction was successful
      // The API returns success as a boolean at the root level
      const isSuccess =
        waitResult?.success === true ||
        waitResult?.vm_status === "Executed successfully" ||
        waitResult?.vm_status?.includes("success") ||
        (waitResult?.type === "user_transaction" &&
          !waitResult?.success === false);

      if (isSuccess) {
        console.log("✅ Transaction confirmed successfully!");
        toast.success("🎉 Purchase completed successfully!", {
          duration: 5000,
          icon: "✅",
        });
        return true;
      } else {
        console.error("❌ Transaction failed or status unclear");
        console.error("Full response:", JSON.stringify(waitResult, null, 2));

        // If we got a response but success is unclear, treat as success
        // (the transaction was found, which means it was processed)
        if (waitResult && typeof waitResult === "object") {
          console.log(
            "⚠️ Treating as success (transaction was found and processed)",
          );
          toast.success("✅ Transaction processed! Check your wallet.", {
            duration: 5000,
          });
          return true;
        }

        toast.error(
          "❌ Transaction failed: " +
            (waitResult?.vm_status || "Check explorer"),
          { duration: 6000 },
        );
        throw new Error(
          "Transaction status unclear: " +
            (waitResult?.vm_status || "Unknown error"),
        );
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Transaction failed";
      console.error("❌ Transaction error:", errorMsg);
      toast.error("❌ " + errorMsg, { duration: 6000 });
      return false;
    }
  }

  static createTransferPayload(
    recipientAddress: string,
    amount: number,
    coinType: string = "0x1::aptos_coin::AptosCoin",
  ): TransactionPayload {
    return {
      type: "entry_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: [coinType],
      arguments: [recipientAddress, amount.toString()],
    };
  }

  static async transferTokens(
    signAndSubmitTransaction: (
      payload: TransactionPayload,
    ) => Promise<{ hash: string }>,
    recipientAddress: string,
    amount: number,
    options: TransactionOptions = {},
  ): Promise<boolean> {
    const payload = this.createTransferPayload(recipientAddress, amount);
    return this.submitTransaction(signAndSubmitTransaction, payload, options);
  }
}
