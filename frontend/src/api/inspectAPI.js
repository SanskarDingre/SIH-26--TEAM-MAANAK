import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export async function inspectImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${BASE_URL}/api/inspect`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function getHistory() {
  const response = await axios.get(`${BASE_URL}/api/history`);
  return response.data;
}
export async function verifyInspection(id, decision) {
  const response = await axios.patch(`${BASE_URL}/api/inspect/${id}/verify`, { decision });
  return response.data;
}








