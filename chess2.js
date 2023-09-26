const { exec } = require("child_process")

// Thay đổi đường dẫn đến file .exe của bạn
const executablePath = "BugChessNN_20200919_release_SSE4.exe"

exec(executablePath, (error, stdout, stderr) => {
  if (error) {
    console.error(`Lỗi: ${error.message}`)
    return
  }

  if (stderr) {
    console.error(`Lỗi tiêu chuẩn: ${stderr}`)
    return
  }

  console.log(`Kết quả: ${stdout}`)
})
