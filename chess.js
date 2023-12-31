// const { exec } = require("child_process")

// // Đường dẫn đến động cơ cờ vua
// const enginePath = "BugChessNN_20200919_release_AVX2.exe"

// // Lệnh để khởi động động cơ cờ vua
// const command = `${enginePath}`

// // Tạo một tiến trình con để tương tác với động cơ cờ vua
// const uciProcess = exec(command)

// // Gửi lệnh UCI
// uciProcess.stdin.write("uci\n")

// // Xử lý phản hồi từ động cơ cờ vua
// uciProcess.stdout.on("data", (data) => {
//   console.log(data.toString())

//   // Dừng tiến trình sau khi nhận được dòng 'uciok'
//   if (data.includes("uciok")) {
//     uciProcess.stdin.write("go depth 40\n")
//   }
//   if (data.includes("bestmove")) {
//     uciProcess.stdin.write("stop\n")
//     uciProcess.kill()
//   }
// })

// // Đóng kết nối khi tiến trình con kết thúc
// uciProcess.on("exit", () => {
//   console.log("Kết thúc tương tác với động cơ cờ vua.")
// })

const { exec } = require("child_process")
const fs = require("fs")

// Đường dẫn đến động cơ cờ vua
const enginePath = "BugChessNN_20200919_release_AVX2.exe"

// Lệnh để khởi động động cơ cờ vua
const command = `${enginePath}`

// Tạo một tiến trình con để tương tác với động cơ cờ vua
const uciProcess = exec(command)

// Mở một tệp văn bản để ghi kết quả của động cơ
const outputFile = fs.createWriteStream("engine_output.txt")

// Gửi lệnh UCI
uciProcess.stdin.write("uci\n")

// Xử lý phản hồi từ động cơ cờ vua và ghi vào tệp văn bản
uciProcess.stdout.on("data", (data) => {
  const dataString = data.toString()
  console.log(dataString)

  // Ghi dữ liệu vào tệp văn bản
  outputFile.write(dataString)

  // Dừng tiến trình sau khi nhận được dòng 'uciok'
  if (data.includes("uciok")) {
    uciProcess.stdin.write("go infinite\n")
  }
  if (data.includes("bestmove")) {
    uciProcess.stdin.write("stop\n")
    uciProcess.kill()
  }
})

// Đóng kết nối khi tiến trình con kết thúc và đóng tệp văn bản
uciProcess.on("exit", () => {
  console.log("Kết thúc tương tác với động cơ cờ vua.")
  outputFile.end() // Đóng tệp văn bản khi tiến trình con kết thúc
})
