const path = require("path");
const fs = require("fs");
const devPath = path.resolve(__dirname, "dev");
const srcRoot = path.resolve(__dirname, "src");
const pagePath = path.resolve(srcRoot, "page");
const mainFile = "index.js";

function getEntry() {
  let entryMap = {};

  fs.readdirSync(pagePath).forEach(pathname => {
    console.log(pathname)
    // 得到完整的url路径
    let fullPathName = path.resolve(pagePath, pathname);
    // 得到文件相关信息
    let stat = fs.statSync(fullPathName);
    // 得到入口文件(index.js)
    let fileName = path.resolve(fullPathName, mainFile);
    // stat.isDirectory() 如果是一个目录，则返回true
    // fs.existsSync() 如果该文件存在，则返回true
    if (stat.isDirectory() && fs.existsSync(fileName)) {
      entryMap[pathname] = fileName;
    }
  })

  return entryMap;
}

const entryMap = getEntry();
module.exports = {
  mode: "development",
  entry: entryMap,
  output: {
    path: devPath,
    filename: "[name].min.js"
  },
  module: {
    rules: [
      {test: /\.css$/, use: ["style-loader", "css-loader"], include: srcRoot},
      {test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"], include: srcRoot},
      {test: /\.(png|jpg|jpeg)$/, use: "url-loader?limit=8192", include: srcRoot}
    ]
  }
}
