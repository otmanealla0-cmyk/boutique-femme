export async function compressImage(file: File, maxDim = 1920, quality = 0.85): Promise<File> {
  try {
    const blob = await new Promise<Blob>((resolve, reject) => {
      const img = new window.Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        let { width, height } = img
        if (width === 0 || height === 0) return reject(new Error('Invalid dimensions'))

        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('No canvas context'))
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('Blob failed')),
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Image load failed'))
      }

      img.src = objectUrl
    })

    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
  } catch {
    // Compression failed — return original file as-is
    return file
  }
}
