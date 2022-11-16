import { uploadImage } from './service-utils'

export async function sendImageToCloud(file) {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', 'upload')
  const uploadRes = await uploadImage(data)
  return uploadRes.data.url
}
