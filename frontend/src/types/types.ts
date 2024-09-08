import React from "react";

import {
  FUNCTIONING_AREA,
  ROLE,
  CURRENCY,
  MEMBERSHIP,
  PAGES,
} from "../Data/Constants";

export interface IClassName {
  className?: string;
}

export interface ISidebarData {
  title: string;
  navigator: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface IProgressProps {
  progress: number;
}

export interface RequestData {
  price: number;
  name: string;
  mailId: string;
  phone: string;
}

export interface reqObj {
  affiliation: string;
  mailId: string;
  member: string;
  membershipId: string;
  name: string;
  occupation: string;
  pages: string;
  paperId: string;
  paperTitle: string;
  phone: string;
  price: number;
  registerType: string;
  txnid?: string;
}

export interface IVerifyPaymentRequestObject {
  currency: "INR" | "USD";
  registerType: string;
  occupation: string;
  member: "IEEE member" | "non-IEEE member" | "IES member";
  numberOfPages: "MoreThan10" | "LessEqual10";
  extraPages: string;
  amount: number;
  designation?: string;
}

export type currencyType = CURRENCY.INR | CURRENCY.USD;

export type roleType =
  | ROLE.PAPER_AUTHOR
  | ROLE.DOCTORAL_CONSORTIUM
  | ROLE.LISTENER;

export type functionAreaType =
  | FUNCTIONING_AREA.FACULTY
  | FUNCTIONING_AREA.INDUSTRYEXPERT
  | FUNCTIONING_AREA.STUDENT
  | FUNCTIONING_AREA.STUDENT_FULL_REGISTRATION
  | FUNCTIONING_AREA.STUDENT_ADDITIONAL;

export type iEEEMembership = MEMBERSHIP.IEEEMEMBER | MEMBERSHIP.NONIEEEMEMBER | MEMBERSHIP.IESMEMBER;

export type NUMBEROFPAGES = PAGES.LESSTHANEIGHT | PAGES.MORETHANEIGHT;

export interface IFormOneValues {
  name: string | "";
  contact: string | "";
  email: string | "";
  affiliation: string | "";
  currency: currencyType | "";
}

export interface IFormTwoValues {
  role: roleType | "";
  functionArea: functionAreaType | "";
  ieeeMembership: iEEEMembership | "";
  membershipID?: string | "";
  designation?: string | "";
}

export interface IFromThreeValues {
  extraValue?: string | "";
  numberOfPages?: NUMBEROFPAGES | "";
  paperId?: string | "";
  paperTitle?: string | "";
  researchTitle?: string | "";
}

export interface IRegisterationDetails {
  vals1: IFormOneValues | null;
  vals2: IFormTwoValues | null;
  vals3: IFromThreeValues | null;
}

export interface IData {
  data: IRegisterationDetails;
}

// Context props
export interface FormProviderProps {
  children: React.ReactNode;
}

export interface IForm1ContextInterface {
  currentFormOneValues: IFormOneValues;
  updateFormOneValues: (value: IFormOneValues) => void;
}

export interface IForm2ContextInterface {
  currentValues: IFormTwoValues;
  updateCurrentForm2Values: (value: IFormTwoValues) => void;
}

export interface IForm3ContextInterface {
  currentFormThreeValues: IFromThreeValues;
  updateFormThreeValues: (values: IFromThreeValues) => void;
}

// Sidebar props
export interface ChildProps {
  setCurrentTab: (tab: string) => void;
}

// types for api services
interface PaymentId {
  _id: string;
  txnid: string;
  easepayid: string;
  bank_ref_num: string;
  status: string;
  net_amount_debit: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IGetRegistrationDetailsData {
  _id: string;
  txnid: string;
  registerType: string;
  name: string;
  phone: string;
  mailId: string;
  affiliation: string;
  paperTitle: string;
  paperId: string;
  occupation: string;
  member: string;
  membershipId: string;
  pages: string;
  price: string;
  payment: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentId: PaymentId;
  invoice: string;
}

export interface IGetRegistrationDetails {
  totalPages: number;
  data: IGetRegistrationDetailsData[];
}

// Types for overview pages
interface MemberShipId {
  "IEEE member": number;
  "non-IEEE member": number;
  "IES member": number;
}

interface ResponseFunctionalArea {
  Faculty: MemberShipId;
  Student: MemberShipId;
  "Industry Expert": MemberShipId;
}

export interface ResponseRoleType {
  "Paper Author": ResponseFunctionalArea;
  "Doctoral Consortium": ResponseFunctionalArea;
  Listener: ResponseFunctionalArea;
}

export interface OverviewResponseData {
  data: ResponseRoleType;
  totalRegisters: number;
}

type ResponseCurrencyType = {
  USD: number;
  INR: number;
};

export interface IRevenueResponse {
  totalPrice: ResponseCurrencyType;
}
