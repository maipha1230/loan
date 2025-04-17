import axiosInstance from "./axiosClient";

export async function GetCustomerList() {
  try {
    const response = await axiosInstance.get("/customer/get-list");
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function FindCustomerOneById(id: number) {
  try {
    const response = await axiosInstance.get(`/customer/get-information/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function CreateCustomer(data: any) {
  try {
    const response = await axiosInstance.post(`/customer/create`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function UpdateCustomer(id: number, data: any) {
  try {
    const response = await axiosInstance.post(`/customer/update/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function RemoveCustomer(id: number) {
  try {
    const response = await axiosInstance.post(`/customer/delete/${id}`, {});
    return response.data;
  } catch (error: any) {
    throw error;
  }
}
