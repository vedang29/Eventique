"use client";

import { useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import getBackendUrl from "@/lib/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, type CreditCardType } from "./creditCard";
import { Input } from "../ui/input";
import PaymentModal from "./PaymentModal";
import { Skeleton } from "../ui/skeleton";

const BankName: Record<string,string> = {
  "bob": "Bank of Baroda",
  "yesbank": "Yes Bank",
  "hdfc":"HDFC",
  "icic":"ICIC",
  "kotak":"KOTAK"
}

interface Card {
  id: string;
  name: string;
  balance: string;
  bank_name: string;
  card_number: string;
  created_at: string;
}

interface BackendResponse {
  data: Card[];
  message: string;
}

const formatNumber = (num: string) =>
  num.replace(/(\d{4})/g, "$1 ").trim();

const ALL_TYPES = [
  "brand-dark",
  "brand-light",
  "gray-dark",
  "gray-light",
  "transparent-strip",
  "gray-strip",
  "gradient-strip",
  "salmon-strip",
  "gray-strip-vertical",
  "gradient-strip-vertical",
  "salmon-strip-vertical",
];

const seededType = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ALL_TYPES[Math.abs(hash) % ALL_TYPES.length];
};

const PaymentDetails = () => {
  const router = useRouter();
  const [amount,setAmount] = useState<string>("0");
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const cardTypeMap = useMemo(() => {
      const map: Record<string, CreditCardType> = {};
      cards.forEach((card) => {
        map[card.id] = seededType(card.id) as CreditCardType;
      });
      return map;
    }, [cards]);

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${getBackendUrl()}/user/my/cards`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = res.data.data ?? [];

      setCards(list);

      setSelected((prev) =>
        prev ? list.find((c) => c.id === prev.id) ?? list[0] : list[0]
      );
    } catch (error) {
       toast.error("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("You are not logged in");
      router.push("/login");
      return;
    }

    fetchCards();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-full bg-white rounded-2xl p-8 shadow-sm space-y-6">
        <Skeleton className="h-8 w-48" />

        <Separator />

        <div className="flex gap-10 mt-8">
          <div className="flex-1 space-y-6">
            <Skeleton className="h-56 w-[350px] rounded-xl mx-auto" />

            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
          </div>

          <div className="w-[380px] space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selected) return null;

  const last4 = selected.card_number.slice(-4);

  async function handleDeposit() {
    try {
     const URL = getBackendUrl();
      const token = localStorage.getItem("token");
      const getToken = await axios.get(`${URL}/transactions/token`);
      let transactionToken = getToken.data.token 
      const res = await axios.post(`${URL}/transactions/initiate`,{
        bankName: selected.bank_name,
        cardNumber: selected.card_number,
        token: transactionToken,
        amount: amount
      },{headers:{
        Authorization: `Bearer ${token}`
      }})
      toast.success("Transaction Processing has been started")
      if(res.status === 200){
        setPaymentUrl(`http://localhost:8081/bank/${selected.bank_name}/deposit/${transactionToken}/${amount}`);
      }
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  async function handleWithdraw() {
    try {
      const URL = getBackendUrl();
      const token = localStorage.getItem("token");
      if(!token){
        toast.warning("You are not logged in")
        router.push("/login")
      }
      const getToken = await axios.get(`${URL}/transactions/token`,{headers:{Authorization: `Bearer ${token}`}});
      let transactionToken = getToken.data.token 
      const res = await axios.post(`${URL}/transactions/initiate`,{
        bankName: selected.bank_name,
        cardNumber: selected.card_number,
        token: transactionToken,
        amount: amount
      },{headers:{
        Authorization: `Bearer ${token}`
      }})
      toast.success("Transaction Processing has been started")
      if(res.status === 200){
        setPaymentUrl(`http://localhost:5173/bank/${selected.bank_name}/withdraw/${transactionToken}/${amount}`);
      }
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  return (
    <div className="min-h-full bg-white rounded-2xl p-8 flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Payments</h1>
        <p className="text-muted-foreground text-sm">
          Manage your cards and balances
        </p>
      </div>

      <Separator />

      <div className="flex flex-1 gap-10 mt-8 overflow-hidden">
        <div className="flex flex-col gap-6 flex-1 overflow-y-scroll no-scrollbar">
         <div className="flex w-full h-80 justify-center items-center">
           <CreditCard
            company={BankName[selected.bank_name]}
            cardHolder={(selected.name)}
            cardNumber={formatNumber(selected.card_number)}
            width={350}
            type={cardTypeMap[selected.id]}
          />
         </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-100 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Card Number</label>
            <Input
              placeholder="4789-6865-1402-3377"
              value={selected.card_number}
              readOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Bank Name</label>
              <Input
                placeholder="Bank of Baroda"
                value={BankName[selected.bank_name]}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Balance</label>
              <Input
                placeholder="0"
                value={selected.balance}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Amount</label>
            <Input
              placeholder="Enter amount to deposit or withdraw"
              type="number"
              min={10}
              value={amount}
              onChange={(e) => setAmount((e.target.value).toString())}
            />
          </div>

        </div>

          <div className="flex w-full h- rounded-md p-3 gap-4 border border-zinc-100 bg-white justify-center items-center">
            <Button className="h-12 px-10 rounded-xl shadow-md" onClick={handleDeposit}>
              Deposit
            </Button>

            <Button variant="secondary" className="h-12 px-10 rounded-xl hover:bg-zinc-300 hover:text-zinc-800" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </div>
          <div className="flex justify-center items-center w-full h-12 p-1">
            <p className="text-xs">*All the transactions are secured by <span className="font-semibold">Capital</span> Payments</p>
          </div>
        </div>

        <div className="w-[380px] flex flex-col">
          <h3 className="text-sm text-muted-foreground mb-0.5 uppercase tracking-wide">
            Your Cards
          </h3>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-2 overflow-x-hidden no-scrollbar">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelected(card)}
                className="cursor-pointer gap-3"
              >
                <CreditCard
                  company={BankName[card.bank_name]}
                  cardNumber={formatNumber(card.card_number)}
                  cardHolder={(card.name)}
                  width={335}
                  type={cardTypeMap[card.id]}
                />
              </div>
            ))}
          </div>
          {paymentUrl && (
            <PaymentModal url={paymentUrl} onClose={() => {fetchCards(); setPaymentUrl(null)}} />
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default PaymentDetails;