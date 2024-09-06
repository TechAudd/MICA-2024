interface IRegistrationData {
  type: string;
  fee: number;
  earlyBirdFee: number;
  foreignDelegateFee: number;
}

export const registrationData: IRegistrationData[] = [
  {
    type: "IEEE Member",
    fee: 9500,
    earlyBirdFee: 7500,
    foreignDelegateFee: 110,
  },
  {
    type: "Non-IEEE Member",
    fee: 11500,
    earlyBirdFee: 9500,
    foreignDelegateFee: 140,
  },
  {
    type: "Student IEEE Member",
    fee: 6500,
    earlyBirdFee: 4500,
    foreignDelegateFee: 65,
  },
  {
    type: "Student Non-IEEE Member",
    fee: 8500,
    earlyBirdFee: 6500,
    foreignDelegateFee: 90,
  },
  {
    type: "Attendee with tutorials",
    fee: 2000,
    earlyBirdFee: 2000,
    foreignDelegateFee: 20,
  },
];
