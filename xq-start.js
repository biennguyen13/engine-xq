import { exec } from "child_process"
import os from "os"

// Chạy lệnh npm run dev
exec("npm run start:all")

// // Kiểm tra tổng số RAM có sẵn trên máy tính (đơn vị là byte)
// const totalMemory = os.totalmem()

// // Kiểm tra số RAM còn trống trên máy tính (đơn vị là byte)
// const freeMemory = os.freemem()

// // Hiển thị thông tin RAM sử dụng hiện tại (đơn vị là byte)
// const usedMemory = totalMemory - freeMemory
// console.log(`Tổng RAM: ${totalMemory} bytes`)
// console.log(`RAM còn trống: ${freeMemory} bytes`)
// console.log(`RAM đang sử dụng: ${usedMemory} bytes`)
