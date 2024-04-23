import fs from 'fs'
import path from 'path'

export function serverLog(this: any, data?: any) {
  const filePath = path.join(__dirname, 'serverLog.json')
  const jsonString = JSON.stringify(data ? data : this, null, 2)

  fs.writeFile(filePath, jsonString, (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err)
    } else {
      console.log('JSON written to file successfully.')
    }
  })
}

declare global {
  interface Console {
    cuslog: (data?: any) => void
  }
}
console.cuslog = serverLog
