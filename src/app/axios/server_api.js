import axios from "axios";

const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/v1`
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

export const fetchMemberRequest = async () => {
  try {
    const response = await axiosInstance.get('/members/me');
    return response;
  } catch (error) {
    throw error;
  }
}

export const signupRequest = async (formData) => {
  try {
    const response = await axiosInstance.post('/members', formData);
    return response;
  } catch (error) {
    throw error;
  }
}

export const loginRequest = async (username, password) => {
  try {
    const response = await axiosInstance.post('/token', 
    { username, password },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded'} },
  );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchBoardDataRequest = async (bo_table, params) => {
  try {
    // console.log('fetchBoardDataRequest', bo_table, params);
    const response = await axiosInstance.get(`/boards/${bo_table}/writes`,
      { params: params },
    );
    // console.log('fetchBoardDataRequest', response);
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchBoardNewDataRequest = async (bo_table, params) => {
  try {
    const response = await axiosInstance.get(`/board-new/writes/${bo_table}`,
      { params: params },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchWriteRequest = async (bo_table, wr_id) => {
  try {
    const response = await axiosInstance.get(`/boards/${bo_table}/writes/${wr_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchSecretWriteRequest = async (bo_table, wr_id, wr_password) => {
  try {
    const response = await axiosInstance.post(
      `/boards/${bo_table}/writes/${wr_id}`,
      JSON.stringify(wr_password),
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchWriteListRequest = async (bo_table, params) => {
  try {
    const response = await axiosInstance.get(`/boards/${bo_table}/writes`, {
      params: params,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const createWriteRequest = async (bo_table, formData) => {
  try {
    const response = await axiosInstance.post(
      `/boards/${bo_table}/writes`,
      formData,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateWriteRequest = async (bo_table, wr_id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/boards/${bo_table}/writes/${wr_id}`,
      JSON.stringify(formData),
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fileUploadRequest = async (bo_table, wr_id, formData) => {
  try {
    const response = await axiosInstance.post(
      `/boards/${bo_table}/writes/${wr_id}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteWriteRequest = async (bo_table, wr_id) => {
  try {
    const response = await axiosInstance.delete(`/boards/${bo_table}/writes/${wr_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteNoneMemberWriteRequest = async (bo_table, wr_id, wr_password) => {
  try {
    const response = await axiosInstance.post(
      `/boards/${bo_table}/writes/${wr_id}/delete`,
      wr_password,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteWriteListRequest = async (bo_table, wr_ids) => {
  try {
    const response = await axiosInstance.post(
      `/boards/${bo_table}/writes/delete`,
      wr_ids,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const createCommentRequest = async (bo_table, wr_id, data) => {
  try {
    const response = await axiosInstance.post(
      `/boards/${bo_table}/writes/${wr_id}/comments`,
      data,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateCommentRequest = async (bo_table, wr_id, data) => {
  try {
    const response = await axiosInstance.put(
      `/boards/${bo_table}/writes/${wr_id}/comments`,
      data,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  }
  catch (error) {
    throw error;
  }
}

export const deleteCommentRequest = async (bo_table, wr_id, comment_id) => {
  try {
    const response = await axiosInstance.delete(`/boards/${bo_table}/writes/${wr_id}/comments/${comment_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteNoneMemberCommentRequest = async (bo_table, wr_id, comment_id, wr_password) => {
  try {
    const response = await axiosInstance.post(
      `/boards/${bo_table}/writes/${wr_id}/comments/${comment_id}/delete`,
      wr_password,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchActionBoardListRequest = async (bo_table, action) => {
  try {
    const response = await axiosInstance.get(`/boards/${bo_table}/${action}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const executeActionBoardRequest = async (bo_table, action, data) => {
  try {
    const response = await axiosInstance.post(
      `/boards/${bo_table}/${action}`,
      data,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchLatestPollRequest = async () => {
  try {
    const response = await axiosInstance.get('/polls/latest');
    return response;
  } catch (error) {
    throw error;
  }
}

export const pollSurveyRequest = async (po_id, selectedOptionIndex) => {
  try {
    const response = await axiosInstance.patch(`/polls/${po_id}/${selectedOptionIndex}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchPollResultsRequest = async (po_id) => {
  try {
    const response = await axiosInstance.get(`/polls/${po_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const createPollEtcOpinionRequest = async (po_id, data) => {
  try {
    const response = await axiosInstance.post(
      `/polls/${po_id}/etc`,
      data,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const deletePollEtcOpinionRequest = async (po_id, pc_id) => {
  try {
    const response = await axiosInstance.delete(`/polls/${po_id}/etc/${pc_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}