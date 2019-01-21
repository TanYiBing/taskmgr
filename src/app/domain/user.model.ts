// 用户信息
export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  projectIds?: string[];
  taskIds?: string[];
  address?: Address;
  identity?: Identity;
  dateOfBirth?: string;
}

// 地址信息
export interface Address {
  id?: number;
  province: string;
  city: string;
  district: string;
  street?: string;
}


// 身份号码
export interface Identity {
  identityNo: string | null;
  identityType: IdentityType | null;
}


// 身份类型
export enum IdentityType {
  IdCard = 0,
  Insurance,
  Passport,
  Military,
  Other
}
