import axios from 'axios'
import { CLOUD_API } from '../data/data'

export async function sendImageToCloud(file) {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', 'upload')
  try {
    const uploadRes = await axios.post(CLOUD_API, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return uploadRes.data.url
  } catch (e) {
    console.log(e)
    return ''
  }
}
