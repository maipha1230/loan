import axiosInstance from "./axiosClient";

export async function GetLoanList() {
  try {
    const response = await axiosInstance.get("/loan/get-list");
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function FindLoanOneById(id: number) {
  try {
    const response = await axiosInstance.get(`/loan/get-information/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function CreateLoan(data: any) {
  try {
    const response = await axiosInstance.post(`/loan/create`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function UpdateLoan(id: number, data: any) {
  try {
    const response = await axiosInstance.post(`/loan/update/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function RemoveLoan(id: number) {
  try {
    const response = await axiosInstance.post(`/loan/delete/${id}`, {});
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function GetContractList(body: any) {
  try {
    const response = await axiosInstance.post(`/loan/contract/list`, body);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function FindContractOneById(id: number) {
  try {
    const response = await axiosInstance.get(
      `/loan/contract/information/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function CreateContract(data: any) {
  try {
    const response = await axiosInstance.post(`/loan/contract/create`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function UpdateContract(id: number, data: any) {
  try {
    const response = await axiosInstance.post(
      `/loan/contract/update/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
}
export async function CancelContract(id: number, data: any) {
  try {
    const response = await axiosInstance.post(
      `/loan/contract/cancel/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
}
