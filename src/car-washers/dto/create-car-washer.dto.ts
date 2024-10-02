export class CreateCarWasherDto {
  fullName: string;
  phoneNumber: string;
  email: string;
  profilePicture: string; // Profile picture upload

  bvn: string; // Bank Verification Number

  nin: string; // National Identification Number

  bankName: string;

  bankAccountNumber: string;

  kycDocument: string; // Path to the uploaded KYC document

  isKYCVerified: boolean;
  isActive: boolean;
}
