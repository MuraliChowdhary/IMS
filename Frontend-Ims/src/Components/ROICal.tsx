import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "../Components/ui/label";

export function ROICalculator() {
  const [investment, setInvestment] = useState("");
  const [percentage, setPercentage] = useState("");
  const [savings, setSavings] = useState<number | null>(null);

  const calculateSavings = () => {
    const principal = parseFloat(investment);
    const rate = parseFloat(percentage);

    if (isNaN(principal) || isNaN(rate)) {
      alert("Please enter valid numbers");
      return;
    }

    const annualSavings = (principal * rate) / 100;
    setSavings(annualSavings);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Savings Calculator</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Annual Savings Calculator</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="investment" className="text-right">
              Investment (₹)
            </Label>
            <Input
              id="investment"
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 20000"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="percentage" className="text-right">
              Rate (%)
            </Label>
            <Input
              id="percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 2"
            />
          </div>
          
          {savings !== null && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="font-semibold">Estimated Annual Savings:</h3>
              <p className="text-green-500">₹{savings.toFixed(2)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {savings >= 0 ? "🟢 Profit" : "🔴 Loss"}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={calculateSavings}>Calculate</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}