/* eslint-disable linebreak-style */


/** Original tutorial is available at https://concrete5.co.jp/blog/creating-video-thumbnails-aws-lambda-your-s3-bucket
 ** Author: Derek Cameron <derek@concrete5.co.jp>
 ** Copyright: 2020
 **/

const file = require("../lib").file;

const lvt = new file("./example.mp4", "./newfile.ext", {
    ffmpegPath: "/usr/local/bin/ffmpeg",
});


lvt.createThumbnail({
    width: 350,

    height: 250,

    time: "00:00:11",

    thumbnailOption: "none"
}).then(value => console.log(value)).catch(err => console.log(err));
