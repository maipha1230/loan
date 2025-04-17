interface ContractModel {
  id: number;
  totalAmount: number;
  rate: number;
  startDate: string | Date; 
  endDate: string | Date; 
  status: "ACTIVE" | "INACTIVE"
  loanId: number;
  Loan: {
    id: number;
    loanName: string;
    minAmount: number;
    maxAmount: number;
    minRange: number;
    maxRange: number;
    createdAt: string;
    updatedAt: string;
  };
  customerId: number;
  Customer: {
    id: number;
    phone: string;
    email: string;
    firstname: string;
    lastname: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
